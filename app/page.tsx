import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 bg-floodlight-glow bg-pitch-lines">
      <h1 className="text-4xl md:text-6xl font-display font-bold text-floodlight mb-4">
        🏟️ Stadium Copilot
      </h1>
      <p className="text-mist text-lg max-w-2xl mb-8">
        GenAI-powered Smart Stadium &amp; Tournament Operations for FIFA World Cup 2026.
        Three connected experiences, one shared intelligence layer.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        <Link
          href="/ops"
          className="rounded-lg bg-panel border border-border p-6 hover:border-gold transition-colors group"
        >
          <h2 className="font-display font-bold text-floodlight text-lg mb-2 group-hover:text-gold transition-colors">
            ⚙️ Ops Command
          </h2>
          <p className="text-mist text-sm">
            Live gate wait times, crowd forecast, alert feed, and AI-generated operations briefings.
          </p>
        </Link>
        <Link
          href="/concierge"
          className="rounded-lg bg-panel border border-border p-6 hover:border-gold transition-colors group"
        >
          <h2 className="font-display font-bold text-floodlight text-lg mb-2 group-hover:text-gold transition-colors">
            💬 Fan Concierge
          </h2>
          <p className="text-mist text-sm">
            Multilingual AI chat assistant — wayfinding, policies, transit, accessibility. 40+ languages.
          </p>
        </Link>
        <Link
          href="/vision"
          className="rounded-lg bg-panel border border-border p-6 hover:border-gold transition-colors group"
        >
          <h2 className="font-display font-bold text-floodlight text-lg mb-2 group-hover:text-gold transition-colors">
            👁️ Safety &amp; Vision
          </h2>
          <p className="text-mist text-sm">
            Simulated vision-language triage — severity assessment, risk scoring, human-in-the-loop dispatch.
          </p>
        </Link>
      </div>
    </div>
  );
}
