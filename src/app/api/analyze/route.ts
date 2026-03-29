import { NextRequest, NextResponse } from "next/server";

const ZAI_API_KEY = process.env.ZAI_API_KEY || "";
const ZAI_BASE_URL = "https://api.z.ai/api/paas/v4";

async function callAI(messages: { role: string; content: string }[]) {
  const res = await fetch(`${ZAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ZAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "glm-4-plus",
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI API error: ${res.status} - ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeText } = await req.json();

    if (!jobDescription?.trim() || !resumeText?.trim()) {
      return NextResponse.json(
        { error: "Missing job description or resume" },
        { status: 400 }
      );
    }

    if (!ZAI_API_KEY) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert career advisor and recruitment AI. You analyze job descriptions and resumes to provide detailed, actionable insights. Always respond with valid JSON only, no markdown, no code fences.`;

    const userPrompt = `Analyze this job description and resume. Return a JSON object with these fields:

{
  "fitScore": <number 0-100 representing how well the candidate fits>,
  "strengths": [<array of 4-6 strings describing what matches well>],
  "gaps": [<array of 3-5 strings describing what's missing or weak>],
  "tailoredResume": "<a complete rewritten resume optimized for this specific job, with relevant keywords highlighted naturally>",
  "coverLetter": "<a professional cover letter connecting the candidate's experience to the job requirements>",
  "interviewQuestions": [<array of 5 objects with "q" (question) and "a" (suggested answer based on their background)>],
  "salaryRange": {"min": <number>, "max": <number>, "currency": "<3 letter code>"},
  "tips": [<array of 5-7 specific actionable tips to improve their chances>]
}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Return ONLY the JSON object, nothing else.`;

    const response = await callAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    // Parse the JSON response
    let parsed;
    try {
      // Try to extract JSON from the response (in case it has markdown fences)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      console.error("Failed to parse AI response:", response);
      return NextResponse.json(
        { error: "Failed to parse AI analysis. Please try again." },
        { status: 500 }
      );
    }

    // Validate required fields
    if (
      typeof parsed.fitScore !== "number" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.gaps)
    ) {
      return NextResponse.json(
        { error: "Invalid AI response structure. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
