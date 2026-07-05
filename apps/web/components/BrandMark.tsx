interface Props {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export default function BrandMark({ compact = false, inverse = false, className = "" }: Props) {
  const titleClassName = inverse ? "text-white" : "text-slate-950";
  const subtitleClassName = inverse ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-500 via-orange-500 to-amber-400 shadow-[0_0_18px_rgba(249,115,22,0.35)]">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#0b0f16" />
        </svg>
      </span>
      <div className="leading-tight">
        <p className={`font-display font-black uppercase tracking-tighter ${compact ? "text-sm" : "text-base"} ${titleClassName}`}>
          CHATURBO
          <span className="ml-2 rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-normal text-orange-500">
            AI
          </span>
        </p>
        <p className={`text-[10px] uppercase tracking-[0.28em] ${subtitleClassName}`}>Lead Rescue Engine</p>
      </div>
    </div>
  );
}
