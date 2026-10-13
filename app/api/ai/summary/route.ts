import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      desiredRole = '',
      experienceLevel = 'Mid-Senior',
      preferredTone = 'Confident & Professional',
      keySkills = '',
      targetIndustry = '',
      existingSummary = '',
      resumeContext = '',
    } = body;

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json(
        {
          error:
            'AI writing assistant is currently unavailable (API key not configured in environment). You can write or edit manually anytime.',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const systemInstruction = `You are a certified professional resume strategist.
Your task is to write a compelling, 3 to 4 sentence executive summary statement for a resume.
RULES:
1. Ground the summary ONLY in the supplied role, experience level, skills, and industry context.
2. DO NOT invent fictitious universities, awards, or arbitrary metric numbers unless provided.
3. Tone: ${preferredTone}.
4. Length: 3-4 cohesive sentences.
5. Emphasize value proposition, technical/domain expertise, and execution focus.
6. Return ONLY the final summary text without quotes, markdown headers, or introductory conversational filler.`;

    const userPrompt = `Desired Role: ${desiredRole || 'Professional'}
Experience Level: ${experienceLevel}
Key Skills: ${keySkills || 'Specified in resume'}
Target Industry: ${targetIndustry || 'Technology / General'}
Current Summary Draft: ${existingSummary || 'None provided'}
Relevant Background Context: ${resumeContext || 'None provided'}

Write an impactful professional summary for this profile.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.35,
      },
    });

    const summary = response.text?.trim() || '';

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error('Error in /api/ai/summary:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to craft summary.' },
      { status: 500 }
    );
  }
}
