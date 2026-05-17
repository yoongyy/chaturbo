"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../../components/Badge";
import { apiRequest } from "../../../lib/api";
import { Workflow } from "../../../lib/types";

export default function PublicWorkflowDetailPage() {
  const MAX_PROBLEM_PREVIEW_CHARS = 1000;
  const params = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [showFullProblem, setShowFullProblem] = useState(false);

  useEffect(() => {
    apiRequest<{ workflow: Workflow }>(`/workflows/${params.id}`).then((res) => setWorkflow(res.workflow));
  }, [params.id]);

  useEffect(() => {
    setShowFullProblem(false);
  }, [workflow?._id]);

  if (!workflow) return <main className="p-6">Loading workflow...</main>;

  const preview = workflow.previewContent;
  const rawProblem = preview?.problemDescription || "Problem description available after publish validation.";
  const problemTooLong = rawProblem.length > MAX_PROBLEM_PREVIEW_CHARS;
  const shownProblem = showFullProblem ? rawProblem : rawProblem.slice(0, MAX_PROBLEM_PREVIEW_CHARS);

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

      <div className="card min-w-0 space-y-3 p-6">
        <h2 className="text-xl font-semibold">Problem</h2>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {shownProblem}
            {!showFullProblem && problemTooLong ? "..." : ""}
          </p>
        </div>
        {problemTooLong ? (
          <button
            type="button"
            onClick={() => setShowFullProblem((value) => !value)}
            className="w-fit rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
          >
            {showFullProblem ? "Show less" : "Show full problem text"}
          </button>
        ) : null}
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
        Public preview view. Full workflow content is intentionally hidden.
      </div>
    </main>
  );
}
