import Anthropic from '@anthropic-ai/sdk';

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Add it to your .env.local file or Vercel environment variables.'
    );
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export const MODEL = 'claude-sonnet-4-20250514';
