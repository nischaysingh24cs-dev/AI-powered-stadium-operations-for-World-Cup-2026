import type { Gate } from '@/lib/simulate';

const STATUS_LABEL: Record<string, string> = {
  clear: 'CLEAR',
  busy: 'BUSY',
  critical: 'DELAY',
};

const STATUS_COLOR: Record<string, string> = {
  clear: 'text-turf',
  busy: 'text-amber',
  critical: 'text-critical',
};

export default function DepartureBoard({ gates }: { gates: Gate[] }) {
  return (
    <div className="rounded-lg bg-panel border border-border overflow-hidden">
      <div className="bg-panel2 px-4 py-2 flex items-center justify-between border-b border-border">
        <h2 className="text-sm font-display font-bold tracking-wider text-floodlight scorecard-text">
          GATE STATUS BOARD
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-turf">
          <span className="w-1.5 h-1.5 rounded-full bg-turf animate-pulseDot" />
          LIVE
        </span>
      </div>
      <div className="divide-y divide-border">
        <div className="grid grid-cols-[1fr_80px_80px] px-4 py-1.5 text-xs text-mist uppercase tracking-wider">
          <span>Gate</span>
          <span className="text-right">Wait</span>
          <span className="text-right">Status</span>
        </div>
        {gates.map((g) => (
          <div key={g.id} className="grid grid-cols-[1fr_80px_80px] px-4 py-2 flap">
            <span className="text-floodlight text-sm font-mono">{g.name}</span>
            <span className="text-right text-floodlight text-sm font-mono">{g.waitMinutes} min</span>
            <span className={`text-right text-sm font-mono font-bold ${STATUS_COLOR[g.status]}`}>
              {STATUS_LABEL[g.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
