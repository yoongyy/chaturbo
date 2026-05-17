import Link from "next/link";

export default function HomePage() {
  const featuredWorkflows = [
    {
      title: "Fix OpenRouter Rate-Limit Fallback",
      category: "API reliability",
      price: 35,
      savings: "Saved ~2.5h and ~120k tokens per incident",
      monthlyRevenue: "$140-$525/mo",
      readiness: 84
    },
    {
      title: "Shopify OAuth Callback on Vercel",
      category: "Integration",
      price: 45,
      savings: "Saved ~3h setup/debug time",
      monthlyRevenue: "$180-$675/mo",
      readiness: 88
    },
    {
      title: "Telegram Signal to MT5 Bridge",
      category: "Automation",
      price: 55,
      savings: "Reduced failed execution retries by 60%",
      monthlyRevenue: "$220-$825/mo",
      readiness: 91
    },
    {
      title: "Local LLM Ollama Setup Playbook",
      category: "AI infrastructure",
      price: 30,
      savings: "Saved ~1.8h onboarding per teammate",
      monthlyRevenue: "$120-$450/mo",
      readiness: 78
    }
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 p-7 shadow-[0_20px_60px_rgba(24,47,57,0.10)] md:p-10">
        <div className="pointer-events-none absolute -left-14 -top-14 h-56 w-56 rounded-full bg-[#ffd7a8]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 right-0 h-60 w-60 rounded-full bg-[#c4f3ea]/80 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Chaturbo for OpenClaw Owners
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Stop burning tokens on repeated fixes. Convert solved AI workflows into assets.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Chaturbo scans your local OpenClaw history, sanitizes secrets on your machine, and turns repeatable fixes into
              publishable workflow drafts.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Start free
              </Link>
              <Link href="/login" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                Sign in
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Owner Benefit #1</p>
              <p className="mt-2 text-2xl font-semibold text-ink">Save time + token spend</p>
              <p className="mt-1 text-sm text-slate-600">Keep solved incident paths reusable instead of re-debugging from scratch.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Owner Benefit #2</p>
              <p className="mt-2 text-2xl font-semibold text-ink">Monetize solved workflows</p>
              <p className="mt-1 text-sm text-slate-600">Publish selected drafts as credit-priced workflow assets for other operators.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Raw chat safety</p>
              <p className="mt-2 text-sm text-slate-700">
                Raw conversations stay local. Only sanitized workflow drafts are uploaded after your approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">One-command connect</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">No 9-step setup. One command.</h2>
          <p className="mt-2 text-slate-600">
            Owners should not memorize CLI workflows. Use a single connect command that handles login, scan, and draft upload.
          </p>
          <div className="mt-4 rounded-2xl bg-[#11161a] p-4 text-sm text-[#d5fce6]">
            <p className="opacity-80">Terminal</p>
            <p className="mt-2 font-mono">chaturbo connect</p>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            <p>1. Detects OpenClaw logs automatically</p>
            <p>2. Sanitizes locally before any upload</p>
            <p>3. Shows draft value estimates and uploads approved drafts</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#f0fffa] to-[#fff8ee] p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-coral">Operator ROI snapshot</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Avg time recovered</p>
              <p className="mt-1 text-2xl font-semibold text-ink">2-4h / issue</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Token waste reduced</p>
              <p className="mt-1 text-2xl font-semibold text-ink">30-65%</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Draft publish readiness</p>
              <p className="mt-1 text-2xl font-semibold text-ink">70+</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Est. revenue range</p>
              <p className="mt-1 text-2xl font-semibold text-ink">$120-$825</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Featured workflows</p>
            <h2 className="mt-1 text-3xl font-semibold text-ink">What owners can list and monetize</h2>
          </div>
          <Link href="/workflows" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            View catalog
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredWorkflows.map((workflow) => (
            <div key={workflow.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{workflow.category}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                  Readiness {workflow.readiness}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-ink">{workflow.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{workflow.savings}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">{workflow.price} credits</span>
                <span className="font-semibold text-mint">{workflow.monthlyRevenue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
