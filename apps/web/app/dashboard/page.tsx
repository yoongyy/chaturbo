"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";
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

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState("");
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [activeOs, setActiveOs] = useState<OsTab>("macos");
  const [copyMessage, setCopyMessage] = useState("");

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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Connect OpenClaw</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">How your AI agent connects to Chaturbo</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Chaturbo does not connect to your model directly. It reads local OpenClaw logs on your machine, sanitizes secrets
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
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">First-time owner flow</p>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
              <p>1. Install OpenClaw and complete at least one task so logs exist.</p>
              <p>2. Install Chaturbo CLI once.</p>
              <p>3. Run: <span className="font-mono font-semibold">chaturbo connect</span></p>
              <p>4. Run once: <span className="font-mono font-semibold">chaturbo pair</span></p>
              <p>5. Add cron/task scheduler using: <span className="font-mono font-semibold">chaturbo sync</span></p>
            </div>
            <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">CLI install (local repo MVP)</p>
              <p className="mt-1 font-mono">npm run build --workspace chaturbo && npm link --workspace chaturbo</p>
            </div>
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
              <p className="mt-1 font-mono text-sm text-emerald-300">{connectCommands[activeOs]}</p>
            </div>
            <div className="mt-3 rounded-xl bg-slate-100 p-3">
              <p className="text-xs text-slate-600">Hourly automation example</p>
              <p className="mt-1 font-mono text-xs text-slate-700">{cronExamples[activeOs]}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(connectCommands[activeOs]);
                    setCopyMessage("Copied command");
                  } catch {
                    setCopyMessage("Copy failed. Select and copy manually.");
                  }
                  setTimeout(() => setCopyMessage(""), 1800);
                }}
                className="rounded-lg bg-mint px-3 py-2 text-sm font-medium text-white"
              >
                Copy command
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
            <p>1. Make sure OpenClaw has run at least one conversation on this machine.</p>
            <p>2. Re-run with explicit path: <span className="font-mono">chaturbo connect --path ~/.openclaw</span></p>
            <p>3. Use local-only check first: <span className="font-mono">chaturbo connect --local-only</span></p>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Detected workflows" value={String(stats.detected)} />
        <StatCard label="Publish-ready workflows" value={String(stats.ready)} />
        <StatCard label="Needs cleanup" value={String(stats.cleanup)} />
        <StatCard label="Est. monthly earning low/high" value={`$${stats.revenueLow} - $${stats.revenueHigh}`} />
        <StatCard label="Total token cost invested" value={`$${stats.tokenCost.toFixed(2)}`} />
        <StatCard label="Total time spent" value={`${stats.hours.toFixed(1)} h`} />
      </div>
    </div>
  );
}
