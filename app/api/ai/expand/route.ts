import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roughNotes = '', roleTitle = '' } = body;

    if (!roughNotes || roughNotes.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter your rough notes or bullets to expand.' },
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

    const systemInstruction = `You are a professional resume editor.
The user will provide rough casual notes about their work or project.
Your task is to convert these rough notes into 2 to 4 crisp, professional resume bullet points.
CRITICAL INTEGRITY CONSTRAINTS:
1. Do NOT invent achievements, revenue, metrics, or technologies that the user did not mention.
2. If metrics are missing, focus on the functional scope, quality, and workflow without fabricating statistics.
3. Start each bullet point with an active past-tense verb.
4. Return ONLY a JSON array of strings containing the bullet points.`;

    const prompt = `Role context: ${roleTitle || 'Professional'}
Rough notes from user:
"${roughNotes.trim()}"

Transform these rough notes into polished resume bullets.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const text = response.text?.trim() || '[]';
    let bullets: string[] = [];
    try {
      bullets = JSON.parse(text);
    } catch {
      bullets = text
        .split('\n')
        .map((line) => line.replace(/^[-*•\d.]\s*/, '').trim())
        .filter((l) => l.length > 0);
    }

    return NextResponse.json({ bullets });
  } catch (err: any) {
    console.error('Error in /api/ai/expand:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to expand notes.' },
      { status: 500 }
    );
  }
}
