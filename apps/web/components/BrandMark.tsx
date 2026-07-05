interface Props {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export default function BrandMark({ compact = false, inverse = false, className = "" }: Props) {
  const titleClassName = inverse ? "text-white" : "text-slate-950";

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 shadow-[0_0_18px_rgba(249,115,22,0.35)]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
            stroke="#FFF4C8"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="leading-tight">
        <p className={`font-display font-black uppercase tracking-tighter ${compact ? "text-lg" : "text-base"} ${titleClassName}`}>
          CHATURBO
        </p>
        {compact ? null : (
          <p className={`text-[10px] uppercase tracking-[0.28em] ${inverse ? "text-slate-400" : "text-slate-500"}`}>Lead Rescue Engine</p>
        )}
      </div>
    </div>
  );
}
