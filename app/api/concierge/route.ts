import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are the official AI Fan Concierge for a FIFA World Cup 2026 host stadium.

Your job: help fans quickly and warmly, in whatever language they write to you in (always reply in the same language they used, or the language they request).

You can help with:
- Wayfinding to gates, seats, restrooms, concessions, and accessible entrances
- Explaining stadium policies (bag policy, re-entry, prohibited items) in general, sensible terms
- Transit and parking guidance
- Lost & found, medical points, and family/accessibility services
- General matchday atmosphere questions (what time gates open, what to expect)

Style rules:
- Be warm, concise, and concrete. Prefer short paragraphs or a short list over long prose.
- If you don't have a specific real-time fact (like an exact live queue time), say so honestly and give the most helpful general guidance instead of inventing a precise number.
- Never claim to have live sensor access.
- Keep responses under ~120 words unless the user asks for more detail.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const language: string | undefined = body.language;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Request must include a non-empty messages array.' },
        { status: 400 }
      );
    }

    const model = getAIClient();

    const systemInstruction = language
      ? `${SYSTEM_PROMPT}\n\nThe fan has selected "${language}" as their preferred language. Reply in ${language} regardless of what language they type in.`
      : SYSTEM_PROMPT;

    const chat = model.startChat({
      history: messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      systemInstruction,
    });

    const lastMessage = messages[messages.length - 1].content;
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
