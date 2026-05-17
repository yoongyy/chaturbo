"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../../components/Badge";
import { apiRequest } from "../../../lib/api";
import { Workflow } from "../../../lib/types";

export default function PublicWorkflowDetailPage() {
  const params = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    apiRequest<{ workflow: Workflow }>(`/workflows/${params.id}`).then((res) => setWorkflow(res.workflow));
  }, [params.id]);

  if (!workflow) return <main className="p-6">Loading workflow...</main>;

  const preview = workflow.previewContent;

  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <Link href="/workflows" className="text-sm text-slate-600">
        Back to workflows
      </Link>

      <div className="card p-6">
        <h1 className="text-3xl font-semibold">{workflow.title}</h1>
        <p className="mt-2 text-slate-600">{preview?.summary || workflow.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>{workflow.priceCredits} credits</Badge>
          <Badge>{workflow.category}</Badge>
          <Badge tone={preview?.riskLevel === "high" ? "bad" : preview?.riskLevel === "medium" ? "warn" : "good"}>
            Risk {preview?.riskLevel || "low"}
          </Badge>
        </div>
      </div>

      <div className="card space-y-3 p-6">
        <h2 className="text-xl font-semibold">Problem</h2>
        <p>{preview?.problemDescription || "Problem description available after publish validation."}</p>
        <h2 className="text-xl font-semibold">Compatibility</h2>
        <p>Model requirement: {preview?.compatibility?.modelRequirement || "intermediate"}</p>
        <p>Required tools: {preview?.compatibility?.requiredTools?.join(", ") || "-"}</p>
        <p>Agents: {preview?.compatibility?.agents?.join(", ") || "-"}</p>
        <h2 className="text-xl font-semibold">Quality and estimates</h2>
        <p>Quality score: {preview?.qualityScore ?? 0}</p>
        <p>
          Estimated revenue range: ${preview?.estimates?.potentialMonthlyRevenueLow ?? 0} -
          ${preview?.estimates?.potentialMonthlyRevenueHigh ?? 0}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Preview-only view for MVP. Full workflow content is intentionally hidden.
      </div>
    </main>
  );
}
