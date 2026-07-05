import type { PropsWithChildren } from "react";
import BrandMark from "./BrandMark";

interface Props extends PropsWithChildren {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}

export default function AuthShell({ eyebrow, title, description, bullets, children }: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.12),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.1),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(249,115,22,0.08),_transparent_34%),linear-gradient(180deg,_#08111a_0%,_#0d1724_100%)] px-4 py-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] px-8 py-10 text-white shadow-[0_24px_90px_rgba(2,6,23,0.45)]">
          <BrandMark inverse />
          <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-orange-400">{eyebrow}</p>
          <h1 className="font-display mt-4 max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">{description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {bullet}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.95)_100%)] p-6 text-white shadow-[0_24px_90px_rgba(2,6,23,0.4)] md:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
