import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mint">Contact</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-ink md:text-5xl">Talk to Chaturbo</h1>
        <p className="mt-4 max-w-3xl text-slate-600">
          Serving SMEs in KL, Selangor, and across Malaysia. If you want to automate customer replies, lead capture, quotation prep, or admin follow-up, start here.
        </p>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-black/5 bg-white/90 p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Contact options</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a href="mailto:hello@chaturbo.com" className="rounded-[28px] border border-black/5 bg-[#eef9f5] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">Email</p>
              <p className="mt-2 text-lg font-semibold text-ink">hello@chaturbo.com</p>
            </a>
            <a href="https://wa.me/60123456789" className="rounded-[28px] border border-black/5 bg-[#fff6ef] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">WhatsApp</p>
              <p className="mt-2 text-lg font-semibold text-ink">+60 XX XXX XXXX</p>
            </a>
            <div className="rounded-[28px] border border-black/5 bg-sand/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Location</p>
              <p className="mt-2 text-lg font-semibold text-ink">Kuala Lumpur, Malaysia</p>
            </div>
            <div className="rounded-[28px] border border-black/5 bg-sand/55 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Service area</p>
              <p className="mt-2 text-lg font-semibold text-ink">KL, Selangor, and nationwide</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-[#0f1720] p-6 text-white shadow-[0_18px_50px_rgba(15,23,32,0.25)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9ae6c9]">Preferred next step</p>
          <h2 className="font-display mt-2 text-3xl font-semibold md:text-4xl">Apply for the free pilot instead of starting with a long sales call</h2>
          <p className="mt-4 text-slate-300">
            The application tells us what to automate, who your customers are, and how the messages move today. That gives us enough context to propose a pilot quickly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/apply" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink">
              Apply for Free Setup
            </Link>
            <Link href="/apply" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              Start Free Audit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
