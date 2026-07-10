import type { OpsAlert } from '@/lib/simulate';

const SEVERITY_STYLE: Record<string, string> = {
  info: 'border-l-mist text-mist',
  warning: 'border-l-amber text-amber',
  critical: 'border-l-critical text-critical',
};

export default function AlertFeed({ alerts }: { alerts: OpsAlert[] }) {
  return (
    <div className="rounded-lg bg-panel border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-wider text-mist">LIVE ALERT FEED</h3>
        <span className="text-[10px] text-mist">{alerts.length} events</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`border-l-2 pl-3 py-1.5 ${SEVERITY_STYLE[a.severity]}`}
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-0.5">
              <span className="font-bold">{a.severity}</span>
              <span className="text-mist">{a.time}</span>
            </div>
            <p className="text-floodlight text-sm leading-snug">{a.message}</p>
            <p className="text-mist text-[10px] mt-0.5">{a.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
