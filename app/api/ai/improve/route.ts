import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, context = 'work experience description', tone = 'professional' } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide some text to improve.' },
        { status: 400 }
      );
    }

    if (text.length > 2500) {
      return NextResponse.json(
        { error: 'Input text exceeds the maximum allowed length (2,500 characters).' },
        { status: 400 }
      );
    }

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

    const systemInstruction = `You are an expert executive resume writer and career coach.
Your job is to improve the user's draft text for their resume (${context}).
CRITICAL RULES:
1. Do NOT invent metrics (e.g. do not invent "$2M saved" or "40% increase" unless the user specified numbers).
2. Do NOT invent technologies, certifications, or company titles that the user did not mention.
3. Use strong, active past-tense verbs (e.g., "Architected", "Spearheaded", "Streamlined", "Engineered", "Orchestrated").
4. Eliminate fluff, buzzwords, and first-person pronouns ("I", "we", "my").
5. Keep the tone ${tone}, concise, and ATS-friendly.
6. Provide ONLY the improved text directly without conversational greetings, meta-disclaimers, or explanations.`;

    const prompt = `Here is the user's text to improve:
"${text.trim()}"

Provide the polished, high-impact version.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const improvedText = response.text?.trim() || '';

    if (!improvedText) {
      return NextResponse.json(
        { error: 'Could not generate improved text. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      originalText: text,
      improvedText,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/improve:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while generating the suggestion.' },
      { status: 500 }
    );
  }
}
