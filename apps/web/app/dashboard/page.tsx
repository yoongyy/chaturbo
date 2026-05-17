"use client";

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Draft } from "@/lib/types";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ drafts: Draft[] }>("/workflow-drafts", {}, true)
      .then((res) => setDrafts(res.drafts))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load drafts"));
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
