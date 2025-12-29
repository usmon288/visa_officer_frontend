import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Concise system prompts for faster responses
const systemPrompts: Record<string, string> = {
  ielts: `You are Dr. Emma Richardson, IELTS examiner. Keep responses to 1 SHORT sentence. Ask one question at a time.`,
  
  job: `You are Michael Chen, HR Director. Keep responses to 1 SHORT sentence. Ask one question at a time.`,
  
  "visa-work": `You are Officer James Mitchell, US work visa officer. Ask about: job title, salary, skills, why they can't hire American, return plans. 1 SHORT sentence per response.`,
  
  "visa-student": `You are Officer Sarah Williams, US student visa officer. Ask about: university, major, funding, parents' income, return plans. 1 SHORT sentence per response.`,
  
  "visa-worktravel": `You are Officer David Rodriguez, J-1 visa officer. Ask about: program, employer, job type, student status, return plans. 1 SHORT sentence per response.`,
  
  "visa-travel": `You are Officer Lisa Anderson, tourist visa officer. Ask about: travel purpose, duration, accommodation, funding, ties to home. 1 SHORT sentence per response.`,
  
  visa: `You are a visa officer. Ask about visit purpose, plans, funding, home ties. 1 SHORT sentence per response.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, interviewType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = systemPrompts[interviewType as keyof typeof systemPrompts] || systemPrompts.job;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 80,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm sorry, I didn't catch that. Could you please repeat?";

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("interview-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
