"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL, apiRequest } from "../../lib/api";
import { Draft } from "../../lib/types";
import StatCard from "../../components/StatCard";

type OsTab = "macos" | "linux" | "windows";

const connectCommands: Record<OsTab, string> = {
  macos: "chaturbo connect",
  linux: "chaturbo connect",
  windows: "chaturbo connect"
};

const cronExamples: Record<OsTab, string> = {
  macos: '0 * * * * /bin/zsh -lc "chaturbo sync"',
  linux: '0 * * * * /bin/bash -lc "chaturbo sync"',
  windows: 'schtasks /Create /SC HOURLY /TN ChaturboSync /TR "chaturbo sync"'
};

const npmDocsUrl = "https://www.npmjs.com/package/chaturbo-cli";
const repoReadmeUrl = "https://github.com/yoongyy/chaturbo#readme";

export default function DashboardPage() {
  const secretStorageKey = (uid: string) => `chaturbo_agent_secret_${uid}`;
  const readSavedSecret = (uid: string) => {
    if (typeof window === "undefined" || !uid) return "";
    return localStorage.getItem(secretStorageKey(uid)) || "";
  };
  const saveSecret = (uid: string, secret: string) => {
    if (typeof window === "undefined" || !uid || !secret) return;
    localStorage.setItem(secretStorageKey(uid), secret);
  };

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState("");
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [activeOs, setActiveOs] = useState<OsTab>("macos");
  const [copyMessage, setCopyMessage] = useState("");
  const [ownerUid, setOwnerUid] = useState("");
  const [agentSecret, setAgentSecret] = useState("");
  const [hasExistingCredential, setHasExistingCredential] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsPurchased, setCreditsPurchased] = useState<number | null>(null);
  const [creditsEarned, setCreditsEarned] = useState<number | null>(null);
  const [toppingUp, setToppingUp] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [autoPublishing, setAutoPublishing] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState<boolean | null>(null);

  async function loadDrafts() {
    setLoadingDrafts(true);
    setError("");
    try {
      const res = await apiRequest<{ drafts: Draft[] }>("/workflow-drafts", {}, true);
      setDrafts(res.drafts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drafts");
    } finally {
      setLoadingDrafts(false);
    }
  }

  useEffect(() => {
    loadDrafts();
    apiRequest<{ user: { ownerUid?: string } }>("/auth/me", {}, true)
      .then((res) => {
        const uid = res.user.ownerUid || "";
        setOwnerUid(uid);
        const savedSecret = readSavedSecret(uid);
        if (savedSecret) {
          setAgentSecret(savedSecret);
        }
      })
      .catch(() => {});

    apiRequest<{ credentials: Array<Record<string, unknown>> }>("/auth/agent/credentials", {}, true)
      .then((res) => setHasExistingCredential((res.credentials || []).length > 0))
      .catch(() => setHasExistingCredential(false));

    apiRequest<{ credits: number; creditsPurchased?: number; creditsEarned?: number }>("/credits/balance", {}, true)
      .then((res) => {
        setCredits(res.credits);
        setCreditsPurchased(res.creditsPurchased ?? null);
        setCreditsEarned(res.creditsEarned ?? null);
      })
      .catch(() => {
        setCredits(null);
        setCreditsPurchased(null);
        setCreditsEarned(null);
      });

    apiRequest<{ stripeEnabled: boolean }>("/credits/config", {}, true)
      .then((res) => setStripeEnabled(Boolean(res.stripeEnabled)))
      .catch(() => setStripeEnabled(false));

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const topupState = params.get("topup");
      const sessionId = params.get("session_id");
      if (topupState === "success" && sessionId) {
        apiRequest<{
          processed?: boolean;
          alreadyProcessed?: boolean;
          addedCredits?: number;
          credits: number;
          creditsPurchased?: number;
          creditsEarned?: number;
        }>(
          "/credits/checkout-confirm",
          {
            method: "POST",
            body: JSON.stringify({ sessionId })
          },
          true
        )
          .then((res) => {
            setCredits(res.credits);
            if (typeof res.creditsPurchased === "number") setCreditsPurchased(res.creditsPurchased);
            if (typeof res.creditsEarned === "number") setCreditsEarned(res.creditsEarned);
            if (res.alreadyProcessed) {
              setCopyMessage("Top-up already processed.");
            } else {
              setCopyMessage(`Top-up success: +${res.addedCredits ?? 0} credits`);
            }
          })
          .catch((err) => setError(err instanceof Error ? err.message : "Failed to confirm top-up"));
      } else if (topupState === "cancelled") {
        setCopyMessage("Top-up cancelled.");
      }

      if (topupState) {
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, []);

  const stats = useMemo(() => {
    const detected = drafts.length;
    const ready = drafts.filter((d) => d.quality.publishReadinessScore >= 70).length;
    const cleanup = drafts.filter((d) => d.privacy.riskLevel !== "low").length;
    const revenueLow = drafts.reduce((s, d) => s + d.estimates.potentialMonthlyRevenueLow, 0);
    const revenueHigh = drafts.reduce((s, d) => s + d.estimates.potentialMonthlyRevenueHigh, 0);
    const tokenCost = drafts.reduce((s, d) => s + d.estimates.tokenCostUsd, 0);
    const hours = drafts.reduce((s, d) => s + d.estimates.timeSpentHours, 0);
    return { detected, ready, cleanup, revenueLow, revenueHigh, tokenCost, hours };
  }, [drafts]);

  const quickConnectCommand = ownerUid && agentSecret
    ? `npx -y chaturbo-cli@latest connect --api-url ${API_URL} --owner-id ${ownerUid} --agent-secret ${agentSecret}`
    : "";
  const fallbackConnectCommand = `npx -y chaturbo-cli@latest connect --api-url ${API_URL}`;
  const commandToCopy = quickConnectCommand || fallbackConnectCommand;
  const commandText = quickConnectCommand
    ? quickConnectCommand
    : hasExistingCredential
      ? fallbackConnectCommand
      : "Generate machine credentials to get one-shot connect command";
  const ownerForPrompt = ownerUid || "<OWNER_UID>";
  const secretForPrompt = agentSecret || "<AGENT_SECRET>";
  const agentBootstrapPrompt = `You are my local AI agent. Set up and operate Chaturbo integration on this machine.

Use these credentials:
- ownerUid: ${ownerForPrompt}
- agentSecret: ${secretForPrompt}
- apiUrl: ${API_URL}

Reference docs first:
- npm package: ${npmDocsUrl}
- platform README: ${repoReadmeUrl}
- API health: ${API_URL}/health

Tasks to complete now:
1) Install and connect CLI:
   npx -y chaturbo-cli@latest connect --api-url ${API_URL} --owner-id ${ownerForPrompt} --agent-secret ${secretForPrompt}
2) Run a local dry run and verify:
   chaturbo scan agent --local-only
3) Configure hourly sync job based on this OS:
   ${cronExamples[activeOs]}
4) Verify sync works:
   chaturbo sync
5) Enable workflow discovery/reuse commands for this machine:
   chaturbo marketplace search --query "oauth"
   chaturbo marketplace library
6) If workflow is useful, purchase and save for execution:
   chaturbo marketplace buy --id <workflow_id>
7) Print final status:
   - connected: yes/no
   - scheduler installed: yes/no
   - last sync result
   - credits balance
   - purchased workflows count

Important constraints:
- Never upload raw conversations.
- Keep secrets local and redacted.
- Use Chaturbo CLI and docs above for command syntax.`;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Your AI agent already solved valuable problems. Chaturbo helps you turn them into reusable workflow assets.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Raw conversations stay local. Only sanitized workflow drafts are uploaded after your approval.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-ink">Credits & Purchases</h2>
            <p className="mt-1 text-sm text-slate-600">Top up credits here, then your local agent can buy and reuse workflows via CLI.</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Current balance</p>
            <p className="text-2xl font-semibold text-ink">{credits ?? "-"} credits</p>
            <p className="mt-1 text-xs text-slate-500">Top-up: {creditsPurchased ?? "-"} | Earned: {creditsEarned ?? "-"}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled={toppingUp || stripeEnabled === false}
            onClick={async () => {
              setToppingUp(true);
              setError("");
              try {
                const res = await apiRequest<{ url: string }>("/credits/checkout-session", {
                  method: "POST",
                  body: JSON.stringify({ credits: 100 })
                }, true);

                if (!res.url) {
                  throw new Error("Checkout URL not returned from API");
                }

                if (typeof window !== "undefined") {
                  window.location.assign(res.url);
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : "Top-up failed");
              } finally {
                setToppingUp(false);
              }
            }}
            className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {toppingUp ? "Redirecting..." : "Top up +100 credits"}
          </button>
          <a href="/workflows" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
            Browse workflows to buy
          </a>
          <button
            disabled={requestingPayout || !creditsEarned || creditsEarned < 10}
            onClick={async () => {
              setRequestingPayout(true);
              setError("");
              try {
                const payoutCredits = Math.min(creditsEarned ?? 0, 100);
                const res = await apiRequest<{
                  credits: number;
                  creditsPurchased: number;
                  creditsEarned: number;
                  payoutRequest: { id: string; usdAmount: number; status: string };
                }>(
                  "/credits/payout-request",
                  {
                    method: "POST",
                    body: JSON.stringify({ credits: payoutCredits, note: "dashboard_requested" })
                  },
                  true
                );
                setCredits(res.credits);
                setCreditsPurchased(res.creditsPurchased);
                setCreditsEarned(res.creditsEarned);
                setCopyMessage(`Payout requested: ${payoutCredits} credits ($${res.payoutRequest.usdAmount})`);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to request payout");
              } finally {
                setRequestingPayout(false);
                setTimeout(() => setCopyMessage(""), 2200);
              }
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            {requestingPayout ? "Requesting payout..." : "Request payout (up to 100 earned credits)"}
          </button>
        </div>
        {stripeEnabled === false ? (
          <p className="mt-2 text-xs text-rose-600">Stripe is not configured on the API project. Set `STRIPE_SECRET_KEY` in API env.</p>
        ) : null}
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-medium text-slate-700">Agent CLI buy flow</p>
          <p className="mt-1 font-mono">chaturbo marketplace search --query "oauth"</p>
          <p className="mt-1 font-mono">chaturbo marketplace buy --id &lt;workflow_id&gt;</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Detected workflows" value={String(stats.detected)} />
        <StatCard label="Publish-ready workflows" value={String(stats.ready)} />
        <StatCard label="Needs cleanup" value={String(stats.cleanup)} />
        <StatCard label="Est. monthly earning low/high" value={`$${stats.revenueLow} - $${stats.revenueHigh}`} />
        <StatCard label="Total token cost invested" value={`$${stats.tokenCost.toFixed(2)}`} />
        <StatCard label="Total time spent" value={`${stats.hours.toFixed(1)} h`} />
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Connect Your AI Agent</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">How your local AI agent connects to Chaturbo</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Chaturbo does not connect to your model directly. It reads local AI agent logs on your machine, sanitizes secrets
              locally, then uploads only approved workflow drafts.
            </p>
          </div>
          <button
            onClick={loadDrafts}
            disabled={loadingDrafts}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            {loadingDrafts ? "Refreshing..." : "I ran connect, refresh drafts"}
          </button>
          <button
            onClick={async () => {
              setAutoPublishing(true);
              setError("");
              try {
                const res = await apiRequest<{ evaluated: number; eligible: number; published: number }>(
                  "/workflow-drafts/auto-publish",
                  {
                    method: "POST",
                    body: JSON.stringify({ threshold: 85, maxCount: 50 })
                  },
                  true
                );
                setCopyMessage(`Auto-publish done: ${res.published}/${res.eligible} published`);
                setTimeout(() => setCopyMessage(""), 2200);
                await loadDrafts();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Auto-publish failed");
              } finally {
                setAutoPublishing(false);
              }
            }}
            disabled={autoPublishing}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            {autoPublishing ? "Auto-publishing..." : "Auto-publish ready drafts"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">First-time owner flow</p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>1. Run your local AI agent (OpenClaw, Hermes, Claude CLI, Gemini CLI) and complete at least one task so logs exist.</p>
              <p>2. Generate machine credentials from this page (owner UID + secret).</p>
              <p>3. Copy one command and run it on the machine where your local AI agent stores logs.</p>
              <p>4. Add hourly/daily scheduler using <span className="font-mono font-semibold">chaturbo sync</span>.</p>
            </div>
            <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Owner UID</p>
              <p className="mt-1 font-mono">{ownerUid || "Loading..."}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                disabled={pairing}
                onClick={async () => {
                  setPairing(true);
                  setError("");
                  try {
                    const res = await apiRequest<{
                      credentials: { ownerUid: string; agentSecret: string };
                    }>("/auth/agent/pair", { method: "POST", body: JSON.stringify({ name: "local-agent" }) }, true);
                    setOwnerUid(res.credentials.ownerUid);
                    setAgentSecret(res.credentials.agentSecret);
                    saveSecret(res.credentials.ownerUid, res.credentials.agentSecret);
                    setHasExistingCredential(true);
                    setCopyMessage("Machine credentials generated. Copy command below.");
                    setTimeout(() => setCopyMessage(""), 2500);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to generate machine credentials");
                  } finally {
                    setPairing(false);
                  }
                }}
                className="rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {pairing ? "Generating..." : hasExistingCredential ? "Rotate machine credentials" : "Generate machine credentials"}
              </button>
            </div>
            {hasExistingCredential && !quickConnectCommand ? (
              <p className="mt-2 text-xs text-slate-600">
                Agent is already paired. Existing secret is hidden for security. Use the connect command below or rotate credentials.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveOs("macos")}
                className={`rounded-full px-3 py-1 text-sm ${activeOs === "macos" ? "bg-ink text-white" : "bg-slate-100 text-slate-700"}`}
              >
                macOS
              </button>
              <button
                onClick={() => setActiveOs("linux")}
                className={`rounded-full px-3 py-1 text-sm ${activeOs === "linux" ? "bg-ink text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Linux
              </button>
              <button
                onClick={() => setActiveOs("windows")}
                className={`rounded-full px-3 py-1 text-sm ${activeOs === "windows" ? "bg-ink text-white" : "bg-slate-100 text-slate-700"}`}
              >
                Windows
              </button>
            </div>

            <div className="mt-3 rounded-xl bg-[#10171c] p-3">
              <p className="text-xs text-slate-300">Terminal command</p>
              <p className="mt-1 font-mono text-sm text-emerald-300">
                {commandText}
              </p>
            </div>
            <div className="mt-3 rounded-xl bg-slate-100 p-3">
              <p className="text-xs text-slate-600">Hourly automation example</p>
              <p className="mt-1 font-mono text-xs text-slate-700">{cronExamples[activeOs]}</p>
            </div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">AI Agent Bootstrap Prompt</p>
              <p className="mt-1 text-xs text-slate-600">
                Paste this prompt into your local AI agent so it can self-setup Chaturbo, install sync schedule, and enable workflow search/buy.
              </p>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-2 text-[11px] leading-5 text-slate-700">
                {agentBootstrapPrompt}
              </pre>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                disabled={!commandToCopy}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(commandToCopy);
                    setCopyMessage("Copied command");
                  } catch {
                    setCopyMessage("Copy failed. Select and copy manually.");
                  }
                  setTimeout(() => setCopyMessage(""), 1800);
                }}
                className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Copy command
              </button>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(agentBootstrapPrompt);
                    setCopyMessage("Copied bootstrap prompt");
                  } catch {
                    setCopyMessage("Copy failed. Select and copy manually.");
                  }
                  setTimeout(() => setCopyMessage(""), 1800);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                Copy bootstrap prompt
              </button>
              <a href="/workflows" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
                See published examples
              </a>
            </div>
            {copyMessage ? <p className="mt-2 text-xs text-mint">{copyMessage}</p> : null}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">No logs found?</p>
          <div className="mt-1 space-y-1 text-sm text-amber-900/90">
            <p>1. Make sure your local AI agent has run at least one task on this machine.</p>
            <p>2. Re-run with explicit path: <span className="font-mono">chaturbo connect --path ~/.openclaw</span> or your Hermes/Claude/Gemini log folder.</p>
            <p>3. Use local-only check first: <span className="font-mono">chaturbo connect --local-only</span></p>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</div> : null}
    </div>
  );
}
