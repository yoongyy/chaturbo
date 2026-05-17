"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "@/components/Badge";
import { apiRequest } from "@/lib/api";
import { Draft } from "@/lib/types";

const statusTones = {
  draft: "default",
  published: "good",
  rejected: "bad"
} as const;

export default function WorkflowDraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const query = status === "all" ? "" : `?status=${status}`;
    apiRequest<{ drafts: Draft[] }>(`/workflow-drafts${query}`, {}, true)
      .then((res) => setDrafts(res.drafts))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load drafts"));
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workflow Drafts</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="all">All status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error ? <div className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</div> : null}

      <div className="space-y-3">
        {drafts.map((draft) => (
          <div key={draft._id} className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">{draft.title}</h2>
              <p className="text-sm text-slate-600">{draft.category}</p>
              <p className="mt-1 text-sm text-slate-600">{draft.summary}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge>{draft.estimates.suggestedPriceCredits} credits</Badge>
              <Badge tone={draft.privacy.riskLevel === "high" ? "bad" : draft.privacy.riskLevel === "medium" ? "warn" : "good"}>
                Privacy {draft.privacy.riskLevel}
              </Badge>
              <Badge>Readiness {draft.quality.publishReadinessScore}</Badge>
              <Badge tone={statusTones[draft.status]}>{draft.status}</Badge>
              <Link href={`/dashboard/workflow-drafts/${draft._id}`} className="rounded-lg bg-mint px-3 py-1.5 text-white">
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
