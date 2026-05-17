"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Badge from "../../components/Badge";
import { apiRequest } from "../../lib/api";
import { Workflow } from "../../lib/types";

export default function PublicWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    apiRequest<{ workflows: Workflow[] }>("/workflows").then((res) => setWorkflows(res.workflows));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Workflow Catalog</h1>
        <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          Go to dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Link href={`/workflows/${workflow._id}`} key={workflow._id} className="card p-4">
            <h2 className="text-lg font-semibold">{workflow.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{workflow.previewContent?.summary || workflow.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{workflow.category}</Badge>
              <Badge>{workflow.priceCredits} credits</Badge>
              <Badge tone="good">Quality {workflow.previewContent?.qualityScore ?? 0}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
