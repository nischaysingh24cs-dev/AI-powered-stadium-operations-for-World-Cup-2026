import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai';
import type { Gate, OpsAlert, StadiumStats } from '@/lib/simulate';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are the Operations Command Copilot inside a FIFA World Cup 2026 stadium control room. You will be given a live JSON snapshot of gate queue data, recent alerts, and venue stats. Produce a short operations briefing for the shift supervisor: 1. One-sentence overall situation summary. 2. "Watch list" - up to 3 bullet points on the most pressing issues. 3. "Recommended actions" - up to 3 concrete, specific staff actions. Keep the entire briefing under 130 words. Plain text only, use simple "-" bullets, no markdown headers.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const gates: Gate[] = body.gates ?? [];
    const alerts: OpsAlert[] = body.alerts ?? [];
    const stats: StadiumStats | undefined = body.stats;

    const model = getAIClient();

    const snapshot = JSON.stringify({ gates, alerts, stats }, null, 2);

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Here is the current live snapshot:\n\n${snapshot}\n\nGenerate the briefing now.` }],
        },
      ],
      systemInstruction: SYSTEM_PROMPT,
    });

    const briefing = result.response.text();

    return NextResponse.json({ briefing });
  } catch (err: any) {
    console.error('Ops summary error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Something went wrong generating the briefing.' },
      { status: 500 }
    );
  }
}
