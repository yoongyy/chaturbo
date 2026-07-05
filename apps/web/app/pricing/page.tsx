import Link from "next/link";
import { foundingOffer, pricingFaqs, pricingPlans, setupFeeHighlights } from "../../lib/pricing";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] text-slate-100">
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-orange-400">
            Pricing
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Simple Pricing for Missed-Call Recovery
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Start with free setup if you are one of the first 10 contractors. After that, setup is $299 one-time.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-orange-500/20 bg-orange-500/10 px-6 py-5 shadow-[0_0_40px_rgba(249,115,22,0.08)]">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-400">Founding Offer</p>
          <p className="mt-2 text-sm font-semibold text-white">{foundingOffer.headline}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{foundingOffer.body}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex h-full flex-col rounded-[28px] border bg-slate-900 p-6 shadow-2xl ${
                plan.badge ? "border-orange-500/60 shadow-[0_0_50px_rgba(249,115,22,0.16)]" : "border-slate-850"
              }`}
            >
              {plan.badge ? (
                <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 rounded-full bg-orange-500 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-950 shadow-lg">
                  {plan.badge}
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-orange-400">Plan</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{plan.bestFor}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white">
                    ${plan.price}
                    <span className="ml-1 text-sm font-semibold text-slate-400">/month</span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Cancel anytime</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-5">
                <ul className="space-y-3 text-sm text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-0.5 text-orange-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href="/register"
                  className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold transition-all active:scale-95 ${
                    plan.badge
                      ? "bg-orange-500 text-slate-950 hover:bg-orange-600"
                      : "border border-slate-700 bg-slate-950 text-white hover:border-orange-500/60 hover:bg-slate-900"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-850 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-white">Setup fee</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {setupFeeHighlights.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-0.5 text-orange-500">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-850 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-white">Pricing FAQ</h2>
            <div className="mt-5 space-y-4">
              {pricingFaqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
                  <p className="text-sm font-bold text-white">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-[28px] border border-slate-850 bg-slate-900 p-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-400">Missed-call recovery</p>
              <h2 className="mt-2 text-2xl font-black text-white">Chaturbo is the simpler alternative to a full phone-answering service.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
                Keep your current number, activate Chaturbo only when you miss the call, and capture the lead before it goes to your competitor.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white hover:bg-slate-950">
                Back home
              </Link>
              <Link href="/register" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-orange-600">
                Start with Free Setup
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
