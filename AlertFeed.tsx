import type { Gate } from '@/lib/simulate';

const STATUS_LABEL: Record<Gate['status'], string> = {
  clear: 'CLEAR',
  busy: 'BUSY',
  critical: 'DELAY',
};

const STATUS_COLOR: Record<Gate['status'], string> = {
  clear: 'text-turf',
  busy: 'text-amber',
  critical: 'text-critical',
};

export default function DepartureBoard({ gates }: { gates: Gate[] }) {
  return (
    <div className="rounded-2xl border border-border bg-panel/80 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-panel2 px-5 py-3">
        <span className="font-display text-sm tracking-[0.2em] text-mist">
          GATE STATUS BOARD
        </span>
        <span className="flex items-center gap-2 text-xs text-mist scoreboard-text">
          <span className="h-1.5 w-1.5 rounded-full bg-turf animate-pulseDot" />
          LIVE
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 px-5 py-2 text-[11px] uppercase tracking-widest text-mist scoreboard-text">
        <span>Gate</span>
        <span>Wait</span>
        <span>Status</span>
      </div>
      <div className="animate-flicker">
        {gates.map((g) => (
          <div
            key={g.id}
            className="flap grid grid-cols-[1fr_auto_auto] items-center gap-x-6 px-5 py-3"
          >
            <span className="scoreboard-text text-sm text-floodlight">
              {g.name}
            </span>
            <span className="scoreboard-text text-sm text-floodlight tabular-nums">
              {g.waitMinutes} min
            </span>
            <span
              className={`scoreboard-text text-xs font-semibold ${STATUS_COLOR[g.status]}`}
            >
              {STATUS_LABEL[g.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
