import Link from "next/link";

const industries = ["Roofing", "HVAC", "Plumbing", "Electrical", "Landscaping", "Cleaning"];

const comparisonRows = [
  ["Response time", "30 minutes to 4 hours", "3 seconds flat via SMS"],
  ["Lead capture rate", "Most missed calls go nowhere", "High-intent leads stay in the thread"],
  ["Homeowner behavior", "Moves on to the next contractor", "Books before they call the next guy"],
  ["Monthly leaked revenue", "$5,000 to $15,000+ lost", "$0.00 lost from the missed call window"]
];

const mechanics = [
  {
    title: "The 24/7 Instant Text-Back",
    text: "The moment a call is missed, the system sends a friendly text so the homeowner knows they are not being ignored."
  },
  {
    title: "The Live SMS Dispatcher",
    text: "One question at a time: what job, where, and how urgent. Then the lead is qualified without making the owner do admin work."
  },
  {
    title: "The Owner Summary",
    text: "Every lead lands as a clean summary with the job type, city, urgency, and next step. Nothing feels like software training."
  }
];

const valueProps = [
  {
    title: "No software project",
    text: "We install the missed-call flow for you. The owner is not asked to learn prompts, routing rules, or technical settings."
  },
  {
    title: "No slow follow-up",
    text: "The first reply goes out in seconds, not after lunch, so the homeowner stays warm and keeps talking."
  },
  {
    title: "No unreadable inbox",
    text: "Every lead is summarized in plain English with the job, city, and urgency. Nothing feels buried in tooling."
  }
];

const offerItems = [
  "$997 one-time setup to configure your tracking line, call forwarding, and booking flow.",
  "$299/month maintenance to keep the routing, texting, and workflow tuning running.",
  "If the system does not save and book at least 3 high-ticket jobs in your first 30 days, the setup fee is refunded."
];

const faqs = [
  {
    q: "Do I need to learn a dashboard?",
    a: "No. The owner only needs a simple lead inbox. The technical setup stays behind the scenes."
  },
  {
    q: "Is this for contractors only?",
    a: "Yes. The page is written for roofers, HVAC, plumbing, electrical, and similar local service businesses."
  },
  {
    q: "What happens after a missed call?",
    a: "The system texts the lead back, qualifies the request, and pushes a clean summary to the owner."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(29,122,107,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(233,106,65,0.16),_transparent_28%),linear-gradient(180deg,_#08111a_0%,_#0d1724_44%,_#f6f1e7_44%,_#f6f1e7_100%)] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[40px] border border-white/10 bg-slate-950 text-white shadow-[0_30px_100px_rgba(2,6,23,0.48)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
              <div className="inline-flex rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                Missed call rescue system
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Stop letting missed calls go to your competitors.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                When a homeowner calls and nobody answers, Chaturbo texts them back in 3 seconds, qualifies the job, and hands your team a clean summary before the lead goes cold.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/audit/alpha-roofing-dallas-audit" className="rounded-2xl bg-coral px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-coral/20 hover:brightness-110">
                  Get a Free Missed-Call Audit
                </Link>
                <Link href="/register" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">
                  Secure My Territory
                </Link>
                <Link href="/demo" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15">
                  See Live Demo
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {industries.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    {item}
                  </span>
                ))}
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400">
                Built for roofers, HVAC, plumbers, electricians, landscapers, and cleaning crews that want more booked jobs, not more software.
              </p>
            </div>

            <div className="border-t border-white/10 bg-white/[0.04] px-6 py-8 md:px-10 md:py-10 lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
              <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">The problem</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">A missed call is leaked revenue.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  If you are on a roof, in traffic, or finishing a job, you cannot answer every ring. Homeowners do not wait. They call the next company in Google.
                </p>
              </div>

              <div className="mt-4 grid gap-4">
                {mechanics.map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[28px] border border-coral/30 bg-ink/95 p-5 text-sm text-white shadow-[0_18px_60px_rgba(233,106,65,0.12)]">
                <p className="text-xs uppercase tracking-[0.22em] text-coral">Sales demo</p>
                <p className="mt-2 text-lg font-semibold text-white">Call the number, miss the call, get the text-back.</p>
                <p className="mt-2 text-slate-300">Then reply by SMS and watch the lead summary land in the dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex flex-col gap-3 md:max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-mint">The simple math</p>
            <h2 className="text-3xl font-semibold text-ink md:text-4xl">Contractors do not buy software. They buy booked jobs.</h2>
            <p className="text-slate-600">
              Show them the cost of waiting, then show them how fast the system replies. Keep the story focused on lost calls, not internal tools.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Metric</th>
                  <th className="px-4 py-3 font-semibold">Without Chaturbo</th>
                  <th className="px-4 py-3 font-semibold">With Chaturbo Lead Rescue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {comparisonRows.map(([metric, without, withChaturbo]) => (
                  <tr key={metric}>
                    <td className="px-4 py-4 font-medium text-ink">{metric}</td>
                    <td className="px-4 py-4 text-slate-600">{without}</td>
                    <td className="px-4 py-4 text-slate-600">{withChaturbo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item.title} className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.24em] text-mint">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-mint">The offer</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Chaturbo Lead Rescue Engine</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              We do not sell a complicated dashboard. We set up the missed-call flow, keep it running, and tune the workflow as your business grows.
            </p>

            <div className="mt-6 space-y-3">
              {offerItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-coral/25 bg-coral/10 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-coral">No-brainer guarantee</p>
              <p className="mt-2 text-lg font-semibold text-ink">If the system does not save and book at least 3 high-ticket jobs in your first 30 days, the setup fee is refunded.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Secure My Territory
              </Link>
              <Link href="/audit/alpha-roofing-dallas-audit" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
                See Example Audit
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-mint">What the owner sees</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Simple. Readable. No tech homework.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                The owner only needs the lead inbox, the booking link, and the summary. All technical setup belongs in the internal admin side, not the contractor-facing workflow.
              </p>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-mint">Common objections</p>
              <div className="mt-4 space-y-4">
                {faqs.map((item) => (
                  <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <p className="font-semibold text-ink">{item.q}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.1)] md:p-8">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Final call to action</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Lock in your territory. Secure your leads.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                If you want a page that feels like premium infrastructure instead of cheap software, this is the right starting point.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/register" className="rounded-2xl bg-coral px-5 py-3 text-sm font-semibold text-white">
                  Secure My Territory & Setup My Free Audit
                </Link>
                <Link href="/login" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                  Open owner portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
