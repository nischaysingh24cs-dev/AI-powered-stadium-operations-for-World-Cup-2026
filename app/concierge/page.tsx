'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian',
  'Arabic', 'Japanese', 'Korean', 'Mandarin', 'Hindi', 'Bengali',
  'Russian', 'Turkish', 'Dutch', 'Swedish', 'Polish', 'Greek',
];

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const updated = [...messages, { role: 'user' as const, content: text }];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, language: language || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: err.message?.includes('ANTHROPIC_API_KEY')
            ? 'No API key configured. Add ANTHROPIC_API_KEY to enable the concierge.'
            : 'Sorry, I could not process your request. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <div className="mb-4">
        <p className="text-xs text-mist uppercase tracking-wider mb-1">Fan-Facing Channel</p>
        <h1 className="text-2xl font-display font-bold text-floodlight">Fan Concierge</h1>
        <p className="text-sm text-mist mt-1">
          AI-powered assistant — wayfinding, policies, transit, accessibility. Ask in any language.
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-mist">Language:</span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(language === lang ? '' : lang)}
            className={`px-2 py-0.5 rounded text-xs border transition-colors ${
              language === lang
                ? 'bg-gold/20 border-gold text-gold'
                : 'border-border text-mist hover:text-floodlight'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-lg bg-panel border border-border p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-mist text-sm text-center py-8">
            👋 Hi! I&apos;m your stadium concierge. Ask me about gates, seats, policies, transit, or anything matchday.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-gold/20 text-floodlight'
                  : 'bg-panel2 text-floodlight'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-panel2 rounded-lg px-3 py-2 text-sm text-mist animate-pulse">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about gates, seats, transit, policies…"
          className="flex-1 rounded-lg bg-panel border border-border px-4 py-2 text-sm text-floodlight placeholder:text-mist focus:outline-none focus:border-gold"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gold text-pitchnight font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
