import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompts = {
  ielts: `You are an IELTS speaking test examiner conducting a practice test. 
Your role is to:
- Start with Part 1 questions (introduction and familiar topics)
- Progress to Part 2 (give a cue card topic for the candidate to speak about for 1-2 minutes)
- End with Part 3 (abstract discussion questions related to Part 2)
- Speak naturally and professionally
- Give encouraging responses but don't over-praise
- Ask one question at a time
- Keep your responses concise (1-2 sentences between questions)

Start by introducing yourself and asking the candidate's name.`,

  job: `You are an experienced HR manager conducting a job interview.
Your role is to:
- Start with introductions and put the candidate at ease
- Ask about their background and experience
- Include behavioral questions (Tell me about a time when...)
- Ask about strengths, weaknesses, and career goals
- Discuss why they're interested in the role
- Ask one question at a time
- Keep your responses professional and encouraging

Start by welcoming the candidate and asking them to tell you about themselves.`,

  visa: `You are a visa officer conducting a visa interview.
Your role is to:
- Ask about the purpose of the visit
- Inquire about travel plans and itinerary
- Ask about financial means and sponsorship
- Discuss ties to home country
- Verify documentation claims
- Be professional but thorough
- Ask one question at a time
- Keep questions direct and clear

Start by greeting the applicant and asking about the purpose of their visit.`,
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
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
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
