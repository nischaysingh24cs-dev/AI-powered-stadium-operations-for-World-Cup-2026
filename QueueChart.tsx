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
    <div className="rounded-2xl border border-border bg-panel/80 p-5">
      <p className="text-xs uppercase tracking-widest text-mist">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accent}`}>
        {value}
        {suffix && <span className="ml-1 text-base text-mist">{suffix}</span>}
      </p>
    </div>
  );
}
