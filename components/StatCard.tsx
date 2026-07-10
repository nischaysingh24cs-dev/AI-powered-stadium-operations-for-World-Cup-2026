export default function StatCard({
  label,
  value,
  suffix,
  accent = 'text-floodlight',
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg bg-panel border border-border p-4 flex flex-col gap-1">
      <span className="text-mist text-xs uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-display font-bold ${accent}`}>
        {value}
        {suffix && <span className="text-sm ml-1 text-mist">{suffix}</span>}
      </span>
    </div>
  );
}
