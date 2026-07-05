import Link from "next/link";
import BrandMark from "../../components/BrandMark";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
          <BrandMark inverse />
          <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-orange-400">Contact</p>
          <h1 className="font-display mt-3 text-4xl font-black text-white md:text-5xl">Talk to Chaturbo</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            Serving contractors who want missed-call recovery, lead rescue, and simple follow-up that keeps the owner workflow readable.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-orange-200 bg-white p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Contact options</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <a href="mailto:hello@chaturbo.com" className="rounded-[28px] border border-slate-200 bg-[#f6f1e7] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-ink">hello@chaturbo.com</p>
              </a>
              <a href="https://wa.me/60123456789" className="rounded-[28px] border border-slate-200 bg-[#f6f1e7] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">WhatsApp</p>
                <p className="mt-2 text-lg font-semibold text-ink">+60 XX XXX XXXX</p>
              </a>
              <div className="rounded-[28px] border border-slate-200 bg-[#f6f1e7] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</p>
                <p className="mt-2 text-lg font-semibold text-ink">Kuala Lumpur, Malaysia</p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-[#f6f1e7] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Service area</p>
                <p className="mt-2 text-lg font-semibold text-ink">KL, Selangor, and nationwide</p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Preferred next step</p>
            <h2 className="font-display mt-2 text-3xl font-black md:text-4xl">Apply for the free pilot instead of starting with a long sales call</h2>
            <p className="mt-4 text-slate-300">
              The application tells us what to automate, who your customers are, and how the messages move today. That gives us enough context to propose a pilot quickly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/apply" className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950">
                Apply for Free Setup
              </Link>
              <Link href="/apply" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
                Start Free Audit
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
