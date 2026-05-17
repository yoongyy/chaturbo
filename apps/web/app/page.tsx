import Link from "next/link";

export default function HomePage() {
  const dummyWorkflows = [
    {
      title: "Fix OpenRouter Rate-Limit Fallback",
      category: "API reliability",
      price: 35,
      savings: "Saved ~2.5h and ~120k tokens per incident",
      monthlyRevenue: "$140-$525/mo"
    },
    {
      title: "Shopify OAuth Callback on Vercel",
      category: "Integration",
      price: 45,
      savings: "Saved ~3h setup/debug time",
      monthlyRevenue: "$180-$675/mo"
    },
    {
      title: "Telegram Signal to MT5 Bridge",
      category: "Automation",
      price: 55,
      savings: "Reduced failed execution retries by 60%",
      monthlyRevenue: "$220-$825/mo"
    },
    {
      title: "Local LLM Ollama Setup Playbook",
      category: "AI infrastructure",
      price: 30,
      savings: "Saved ~1.8h onboarding per teammate",
      monthlyRevenue: "$120-$450/mo"
    }
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="card p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-mint">Chaturbo MVP</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Turn solved AI-agent problems into reusable workflow assets.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600">
          Raw conversations stay local. Only sanitized workflow drafts are uploaded after your approval.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-xl bg-mint px-5 py-3 text-white">
            Create account
          </Link>
          <Link href="/login" className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700">
            Login
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-mint">Save Time + Tokens</p>
          <h2 className="mt-2 text-2xl font-semibold">Stop re-solving the same incident</h2>
          <p className="mt-2 text-slate-600">
            Scan local OpenClaw logs, detect reusable troubleshooting flows, and keep internal fixes structured for repeat use.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>Typical workflow draft captures common errors and fix steps</li>
            <li>Privacy sanitizer removes keys, emails, local paths, and tokens</li>
            <li>Draft quality score helps prioritize what to publish</li>
          </ul>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-coral">Make Money</p>
          <h2 className="mt-2 text-2xl font-semibold">Monetize your solved workflows</h2>
          <p className="mt-2 text-slate-600">
            Publish selected drafts as reusable assets and price them in credits. Your hard debugging work becomes a repeatable
            product.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>Owner chooses exactly which drafts to publish</li>
            <li>Public preview shows compatibility and quality before usage</li>
            <li>Revenue estimates help prioritize high-value workflows</li>
          </ul>
        </div>
      </section>

      <section className="mt-6 card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dummy Workflow Listing</p>
            <h2 className="mt-1 text-2xl font-semibold">Examples of sellable workflow assets</h2>
          </div>
          <Link href="/workflows" className="rounded-xl bg-ink px-4 py-2 text-sm text-white">
            View all workflows
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {dummyWorkflows.map((workflow) => (
            <div key={workflow.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{workflow.category}</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{workflow.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{workflow.savings}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="rounded-full bg-white px-3 py-1 text-slate-700">{workflow.price} credits</span>
                <span className="font-medium text-mint">{workflow.monthlyRevenue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
