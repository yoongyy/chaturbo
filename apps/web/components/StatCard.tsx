interface Props {
  label: string;
  value: string;
  helper?: string;
}

export default function StatCard({ label, value, helper }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.4)]">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {helper ? <p className="mt-2 text-sm text-slate-400">{helper}</p> : null}
    </div>
  );
}
