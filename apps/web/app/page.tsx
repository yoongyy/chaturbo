import Link from "next/link";

const pillars = [
  {
    title: "Recover missed calls",
    text: "Forward every inbound call to the owner and text the customer back when nobody answers."
  },
  {
    title: "Qualify jobs fast",
    text: "Ask one short question at a time, collect the city and service needed, and summarize the lead cleanly."
  },
  {
    title: "Win setup deals",
    text: "Use personalized audits and outreach scripts to close contractor clients without building a generic CRM."
  }
];

const industries = ["Roofing", "HVAC", "Plumbing", "Electrical", "Landscaping", "Cleaning"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(29,122,107,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(233,106,65,0.14),_transparent_28%),linear-gradient(180deg,_#08111a_0%,_#0d1724_48%,_#f6f1e7_48%,_#f6f1e7_100%)] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[36px] border border-white/10 bg-slate-950 px-6 py-10 text-white shadow-[0_24px_90px_rgba(2,6,23,0.45)] md:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chaturbo Lead Rescue</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Recover missed calls before customers call your competitor.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                A practical AI lead-gen and missed-call recovery system for roofing, HVAC, and plumbing contractors. We text back leads, qualify the job, and give the owner a clean summary.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/login" className="rounded-2xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-coral/20 hover:brightness-110">
                  Open owner portal
                </Link>
                <Link href="/demo" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">
                  See live demo
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {industries.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                  <p className="text-lg font-semibold text-white">{pillar.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{pillar.text}</p>
                </div>
              ))}

              <div className="rounded-[28px] border border-coral/30 bg-ink/95 p-5 text-sm text-white shadow-[0_18px_60px_rgba(233,106,65,0.12)]">
                <p className="text-xs uppercase tracking-[0.22em] text-coral">Sales demo</p>
                <p className="mt-2 text-lg font-semibold text-white">Call the number, miss the call, get the text-back.</p>
                <p className="mt-2 text-slate-300">Then reply by SMS and watch the lead summary land in the dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {[
            ["01", "Sales pages that close", "Personalized audit pages and outreach scripts built for each contractor prospect."],
            ["02", "Missed-call recovery", "Forward the call, detect the miss, and text the lead back automatically."],
            ["03", "Simple owner inbox", "Track leads, update status, send replies, and keep the summary clean."]
          ].map(([num, title, text]) => (
            <div key={title} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-mint">{num}</p>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-mint">What to use it for</p>
              <h2 className="mt-2 text-3xl font-semibold text-ink">Built for selling within 30 days</h2>
              <p className="mt-3 max-w-2xl text-slate-600">
                Create a demo roofing company, assign a Twilio number, run the call flow, and show the lead rescue result live in the dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/login" className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Owner login
              </Link>
              <Link href="/audit/alpha-roofing-dallas-audit" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                Public audit example
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
