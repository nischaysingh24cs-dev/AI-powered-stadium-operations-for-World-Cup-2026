import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are the Safety & Anomaly Triage Copilot inside a FIFA World Cup 2026 stadium. You will receive a description of what a stadium CCTV camera is seeing. Return a JSON object with exactly these fields: "severity" (low/medium/high/critical), "riskScore" (integer 1-10), "category" (short label), "recommendedAction" (one specific actionable sentence), "dispatchRecommended" (boolean). Return ONLY the JSON object, no additional text.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const description: string | undefined = body.description;
    const camera: string | undefined = body.camera;

    if (!description) {
      return NextResponse.json({ error: 'Request must include a description field.' }, { status: 400 });
    }

    const model = getAIClient();

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Camera: ${camera ?? 'Unknown'}\n\nDescription: ${description}\n\nProvide the triage assessment as JSON.` }],
        },
      ],
      systemInstruction: SYSTEM_PROMPT,
    });

    const rawText = result.response.text();

    let triageResult;
    try {
      const jsonStr = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      triageResult = JSON.parse(jsonStr);
    } catch {
      triageResult = {
        severity: 'medium',
        riskScore: 5,
        category: 'unknown',
        recommendedAction: rawText || 'Manual review recommended.',
        dispatchRecommended: false,
      };
    }

    return NextResponse.json(triageResult);
  } catch (err: any) {
    console.error('Triage error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Something went wrong running triage.' },
      { status: 500 }
    );
  }
}
