import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient, MODEL } from '@/lib/anthropic';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are the Safety & Anomaly Triage Copilot inside a FIFA World Cup 2026 stadium.

You will receive a natural-language description of what a stadium CCTV camera is seeing, as if produced by a vision-language model (e.g. CLIP + object detection).

Return a JSON object with exactly these fields:
- "severity": one of "low", "medium", "high", "critical"
- "riskScore": integer 1-10 (1 = negligible, 10 = imminent danger)
- "category": short label (e.g. "crowding", "unattended item", "medical", "altercation", "normal")
- "recommendedAction": one specific, actionable sentence for the shift supervisor
- "dispatchRecommended": boolean — true only if security/medical dispatch is warranted right now

Be conservative: when in doubt, lean slightly toward higher severity. Never invent details not in the description.
Return ONLY the JSON object, no additional text.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const description: string | undefined = body.description;
    const camera: string | undefined = body.camera;

    if (!description) {
      return NextResponse.json(
        { error: 'Request must include a description field.' },
        { status: 400 }
      );
    }

    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Camera: ${camera ?? 'Unknown'}\n\nDescription: ${description}\n\nProvide the triage assessment as JSON.`,
        },
      ],
    });

    const textBlock = response.content.find((c) => c.type === 'text');
    const rawText = textBlock && textBlock.type === 'text' ? textBlock.text : '';

    let result;
    try {
      const jsonStr = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      result = JSON.parse(jsonStr);
    } catch {
      result = {
        severity: 'medium',
        riskScore: 5,
        category: 'unknown',
        recommendedAction: rawText || 'Manual review recommended.',
        dispatchRecommended: false,
      };
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Triage error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Something went wrong running triage.' },
      { status: 500 }
    );
  }
}
