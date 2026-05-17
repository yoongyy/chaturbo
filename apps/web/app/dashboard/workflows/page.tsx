"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/Badge";
import { apiRequest } from "@/lib/api";
import { Workflow } from "@/lib/types";

export default function DashboardWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ workflows: Workflow[] }>("/workflows")
      .then((res) => setWorkflows(res.workflows))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load workflows"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Published Workflows</h1>
      {error ? <div className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {workflows.map((workflow) => (
          <div key={workflow._id} className="card p-4">
            <h2 className="text-lg font-semibold">{workflow.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{workflow.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{workflow.priceCredits} credits</Badge>
              <Badge>{workflow.category}</Badge>
              <Badge tone="good">Published</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Stats: {workflow.stats.purchases} purchases, {workflow.stats.successfulRuns} successful runs
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
