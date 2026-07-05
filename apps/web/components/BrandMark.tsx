interface Props {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}

export default function BrandMark({ compact = false, inverse = false, className = "" }: Props) {
  const titleClassName = inverse ? "text-white" : "text-slate-950";

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px]">
        <img src="/favicon.svg" alt="" aria-hidden="true" className="h-full w-full" />
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
