import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, transcript } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("Lovable API key not configured");
    }

    console.log(`Analyzing ${type} interview transcript`);

    let systemPrompt = "";
    let responseFormat = "";

    switch (type) {
      case "ielts":
        systemPrompt = `You are an expert IELTS examiner. Analyze the following speaking test transcript and provide:
1. An overall band score (0.0-9.0, in 0.5 increments)
2. Individual scores for: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation
3. Detailed feedback with specific examples from the transcript
4. Improvement suggestions

Be fair but rigorous in your assessment.`;
        responseFormat = `Return a JSON object with this exact structure:
{
  "overallScore": number (0.0-9.0),
  "breakdown": {
    "fluencyCoherence": number,
    "lexicalResource": number,
    "grammaticalRange": number,
    "pronunciation": number
  },
  "feedback": "string with detailed analysis",
  "improvements": ["array", "of", "specific", "suggestions"]
}`;
        break;

      case "job":
        systemPrompt = `You are an experienced HR professional and hiring manager. Analyze the following job interview transcript and determine:
1. Whether the candidate should be hired (true/false)
2. Overall performance rating (0-100)
3. Strengths demonstrated
4. Areas of concern
5. Detailed feedback

Consider: communication skills, professionalism, relevant experience, cultural fit, enthusiasm, and problem-solving abilities.`;
        responseFormat = `Return a JSON object with this exact structure:
{
  "hired": boolean,
  "score": number (0-100),
  "strengths": ["array", "of", "strengths"],
  "concerns": ["array", "of", "concerns"],
  "feedback": "string with detailed analysis"
}`;
        break;

      case "visa":
        systemPrompt = `You are an experienced visa officer. Analyze the following visa interview transcript and determine:
1. Whether the visa should be approved (true/false)
2. Confidence level in the decision (0-100)
3. Key factors that influenced the decision
4. Any red flags or concerns
5. Detailed reasoning

Consider: purpose of visit, ties to home country, financial stability, travel history, and consistency of answers.`;
        responseFormat = `Return a JSON object with this exact structure:
{
  "approved": boolean,
  "confidence": number (0-100),
  "positiveFactors": ["array", "of", "positive", "factors"],
  "concerns": ["array", "of", "concerns"],
  "feedback": "string with detailed reasoning"
}`;
        break;

      default:
        throw new Error("Invalid interview type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: `${systemPrompt}\n\n${responseFormat}` },
          { role: "user", content: `Interview Transcript:\n\n${transcript}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lovable AI error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response received:", content);

    // Parse the JSON from the response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonString = jsonMatch[1].trim();
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Return a default response if parsing fails
      result = type === "ielts" 
        ? { overallScore: 6.5, feedback: content, improvements: [] }
        : type === "job"
        ? { hired: true, score: 75, feedback: content, strengths: [], concerns: [] }
        : { approved: true, confidence: 75, feedback: content, positiveFactors: [], concerns: [] };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-interview:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
