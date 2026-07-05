interface Props {
  label: string;
  value: string;
  helper?: string;
}

export default function StatCard({ label, value, helper }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.4)]">
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-400">{label}</p>
      <p className="font-display mt-3 text-3xl font-black text-white">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p> : null}
    </div>
  );
}
