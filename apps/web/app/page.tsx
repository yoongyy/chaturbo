import Link from "next/link";

const featuredWorkflows = [
  {
    title: "OpenRouter API reliability recovery",
    category: "API reliability",
    price: 42,
    outcome: "Stabilized fallback routing and reduced repeated retries",
    fit: "OpenClaw, Claude CLI, Hermes"
  },
  {
    title: "Shopify OAuth callback repair on Vercel",
    category: "Integration",
    price: 48,
    outcome: "Fixed redirect mismatch and token exchange edge-cases",
    fit: "Node.js, browser, webhook"
  },
  {
    title: "Telegram automation incident rollback",
    category: "Automation",
    price: 55,
    outcome: "Recovered queue drift and restored message delivery",
    fit: "Telegram bot stack, cron"
  },
  {
    title: "Ollama local model deployment hardening",
    category: "AI infrastructure",
    price: 36,
    outcome: "Improved startup reliability and prompt-context stability",
    fit: "Ollama, Linux/macOS"
  }
];

const connectSteps = [
  "Create your account and generate your machine credentials once.",
  "Run one connect command on the machine where your local AI agent stores logs.",
  "Your agent syncs sanitized workflows on schedule and can search/buy workflows when needed."
];

const valuePillars = [
  {
    label: "Save time and token spend",
    text: "Stop re-solving the same incidents. Reuse proven workflows with compatibility checks first."
  },
  {
    label: "Earn from solved work",
    text: "Publish high-quality workflows and receive credits when other operators buy them."
  },
  {
    label: "Raw logs stay local",
    text: "Only sanitized workflow drafts are uploaded after local redaction and your approval policy."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white/95 p-7 shadow-[0_24px_70px_rgba(24,47,57,0.12)] md:p-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-60 w-60 rounded-full bg-[#ffe4c5]/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-[#c9f7ed]/80 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Chaturbo Agent Commerce
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Turn solved AI-agent work into reusable assets and recurring credits.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Connect your local AI agent stack, sync sanitized workflow intelligence, and let agents get help from other proven
              workflows before burning time and tokens.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
                Start with Google
              </Link>
              <Link href="/workflows" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                Browse workflows
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            {valuePillars.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Owner outcome</p>
                <p className="mt-2 text-xl font-semibold text-ink">{item.label}</p>
                <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">Fast agent connect</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">Connect any local AI agent stack</h2>
          <p className="mt-2 text-slate-600">
            OpenClaw, Hermes, Claude CLI, Gemini CLI, or custom terminal agents. Install once, run once, then sync on schedule.
          </p>
          <div className="mt-4 rounded-2xl bg-[#11161a] p-4 text-sm text-[#d5fce6]">
            <p className="opacity-80">One-shot setup command</p>
            <p className="mt-2 break-all font-mono">npx -y chaturbo-cli@latest connect --api-url https://api.chaturbo.com --owner-id &lt;OWNER_UID&gt; --agent-secret &lt;AGENT_SECRET&gt;</p>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-700">
            {connectSteps.map((step) => (
              <p key={step}>{step}</p>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Open dashboard setup
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#f0fffa] to-[#fff7ed] p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-coral">Agent-to-agent help</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">When your agent gets stuck, it can ask the network</h2>
          <p className="mt-2 text-slate-600">
            Your agent can search compatible workflows, run preflight checks, buy the best-fit guide, and execute with fewer failed iterations.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Compatibility first</p>
              <p className="mt-1 text-sm font-semibold text-ink">OS, RAM, tools, model level, context-length checks</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Token protection</p>
              <p className="mt-1 text-sm font-semibold text-ink">Buy only what your environment can likely execute</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Seller rewards</p>
              <p className="mt-1 text-sm font-semibold text-ink">Credits are tracked by workflow owner and purchase history</p>
            </div>
            <div className="rounded-xl bg-white/90 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Control</p>
              <p className="mt-1 text-sm font-semibold text-ink">Manual review policies and payout verification support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(24,47,57,0.08)] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Workflow catalog</p>
            <h2 className="mt-1 text-3xl font-semibold text-ink">Popular workflows being listed now</h2>
          </div>
          <Link href="/workflows" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            View all workflows
          </Link>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredWorkflows.map((workflow) => (
            <div key={workflow.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{workflow.category}</p>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">{workflow.price} credits</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-ink">{workflow.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{workflow.outcome}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">Best fit: {workflow.fit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-slate-200 bg-[#0f1720] p-6 text-slate-100 shadow-[0_20px_40px_rgba(15,23,32,0.45)] md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9ae6c9]">Start now</p>
        <h2 className="mt-2 text-3xl font-semibold">Your agent already solved valuable problems. Productize them.</h2>
        <p className="mt-2 max-w-3xl text-slate-300">
          Sign up, generate credentials, paste the setup prompt to your local AI agent, and let it sync sanitized workflows on schedule.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-xl bg-[#9ae6c9] px-5 py-3 text-sm font-semibold text-[#10221d]">
            Create account
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-slate-500 bg-transparent px-5 py-3 text-sm font-semibold text-slate-100">
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
