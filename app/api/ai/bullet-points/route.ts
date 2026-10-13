import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobTitle = '',
      company = '',
      responsibilities = '',
      technologies = '',
      achievements = '',
    } = body;

    if (!jobTitle && !responsibilities && !achievements) {
      return NextResponse.json(
        { error: 'Please provide at least a Job Title or some Responsibilities to generate bullet points.' },
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

    const systemInstruction = `You are an elite tech & corporate resume consultant.
Your mission is to generate 3 to 5 concise, high-impact resume achievement bullet points based STRICTLY on the user's provided details.
CRITICAL RULES:
1. Do NOT fabricate specific numerical metrics (e.g. do not invent "$500,000 saved" or "99.9% uptime") UNLESS the user gave a metric or result. If no metric was given, focus on the action, methodology, and outcome without making up numbers.
2. Only mention tools/technologies provided or standard to the role described.
3. Every bullet point MUST start with a strong, varied action verb (e.g., Developed, Orchestrated, Designed, Streamlined, Spearheaded, Automated).
4. No first-person pronouns ("I", "my", "we").
5. Return ONLY a JSON array of strings containing the bullet points.`;

    const userPrompt = `Job Title: ${jobTitle || 'N/A'}
Company/Industry: ${company || 'N/A'}
Responsibilities/Tasks: ${responsibilities || 'N/A'}
Technologies/Tools used: ${technologies || 'N/A'}
Known Results/Achievements: ${achievements || 'N/A'}

Generate 3-5 high-impact bullet points for this role.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
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
        .filter((line) => line.length > 0);
    }

    return NextResponse.json({
      bullets,
    });
  } catch (err: any) {
    console.error('Error in /api/ai/bullet-points:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate bullet points.' },
      { status: 500 }
    );
  }
}
