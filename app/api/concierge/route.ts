import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are the official AI Fan Concierge for a FIFA World Cup 2026 host stadium. Help fans quickly and warmly, in whatever language they write to you in. You can help with wayfinding, stadium policies, transit, and accessibility. Be warm, concise, and concrete. Keep responses under ~120 words.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const language: string | undefined = body.language;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Request must include a non-empty messages array.' }, { status: 400 });
    }

    const model = getAIClient();

    const systemText = language
      ? `${SYSTEM_PROMPT}\n\nThe fan has selected "${language}" as their preferred language. Reply in ${language} regardless of what language they type in.`
      : SYSTEM_PROMPT;

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
      systemInstruction: { parts: [{ text: systemText }] },
    });

    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Concierge chat error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Something went wrong talking to the concierge.' },
      { status: 500 }
    );
  }
}
