import type { OpsAlert } from '@/lib/simulate';

const SEVERITY_STYLE: Record<OpsAlert['severity'], string> = {
  info: 'border-l-mist text-mist',
  warning: 'border-l-amber text-amber',
  critical: 'border-l-critical text-critical',
};

export default function AlertFeed({ alerts }: { alerts: OpsAlert[] }) {
  return (
    <div className="rounded-2xl border border-border bg-panel/80 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm tracking-[0.2em] text-mist">
          LIVE ALERT FEED
        </h3>
        <span className="text-xs text-mist">{alerts.length} events</span>
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`rounded-lg border-l-4 bg-panel2/60 px-3 py-2 ${SEVERITY_STYLE[a.severity]}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">
                {a.severity}
              </span>
              <span className="scoreboard-text text-[11px] text-mist">{a.time}</span>
            </div>
            <p className="mt-1 text-sm text-floodlight">{a.message}</p>
            <p className="mt-0.5 text-xs text-mist">{a.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
