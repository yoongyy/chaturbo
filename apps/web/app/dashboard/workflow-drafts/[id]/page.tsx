"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../../../components/Badge";
import { apiRequest } from "../../../../lib/api";
import { Draft } from "../../../../lib/types";

export default function DraftDetailPage() {
  const MAX_PROBLEM_PREVIEW_CHARS = 1200;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFullProblem, setShowFullProblem] = useState(false);

  function load() {
    setSuccess("");
    apiRequest<{ draft: Draft }>(`/workflow-drafts/${params.id}`, {}, true)
      .then((res) => setDraft(res.draft))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load draft"));
  }

  useEffect(() => {
    load();
  }, [params.id]);

  useEffect(() => {
    setShowFullProblem(false);
  }, [draft?._id]);

  async function action(path: string, method = "POST") {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await apiRequest(path, { method }, true);
      if (method === "DELETE") {
        setSuccess("Draft deleted successfully. Redirecting...");
        setTimeout(() => router.push("/admin/workflow-drafts"), 700);
      } else {
        setSuccess(path.endsWith("/publish") ? "Draft published successfully." : "Draft rejected successfully.");
        load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  }

  if (!draft) {
    return <div className="p-4 text-slate-600">Loading draft...</div>;
  }

  const rawProblem = draft.problem.description || "-";
  const problemTooLong = rawProblem.length > MAX_PROBLEM_PREVIEW_CHARS;
  const shownProblem = showFullProblem ? rawProblem : rawProblem.slice(0, MAX_PROBLEM_PREVIEW_CHARS);

  return (
    <div className="space-y-4">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{draft.title}</h1>
            <p className="text-slate-600">{draft.summary}</p>
          </div>
          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={() => action(`/workflow-drafts/${draft._id}/publish`)}
              className="rounded-lg bg-mint px-4 py-2 text-white"
            >
              {loading ? "Working..." : "Publish"}
            </button>
            <button
              disabled={loading}
              onClick={() => action(`/workflow-drafts/${draft._id}/reject`)}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              {loading ? "Working..." : "Reject"}
            </button>
            <button
              disabled={loading}
              onClick={() => action(`/workflow-drafts/${draft._id}`, "DELETE")}
              className="rounded-lg bg-rose-600 px-4 py-2 text-white"
            >
              {loading ? "Working..." : "Delete"}
            </button>
          </div>
        </div>
        {success ? <p className="mt-3 text-sm text-emerald-700">{success}</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card min-w-0 space-y-3 p-4">
          <h2 className="text-lg font-semibold">Problem</h2>
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
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
            >
              {showFullProblem ? "Show less" : "Show full problem text"}
            </button>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {draft.problem.symptoms.map((symptom) => (
              <Badge key={symptom} tone="warn">{symptom}</Badge>
            ))}
          </div>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-semibold">Solution overview</h2>
          <p>{draft.solution.overview}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {draft.solution.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-semibold">Do not do</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {draft.solution.doNotDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="font-medium">Verification steps</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {draft.solution.verificationSteps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-semibold">Compatibility & estimates</h2>
          <p>Agents: {draft.compatibility.agents.join(", ") || "-"}</p>
          <p>OS: {draft.compatibility.os.join(", ") || "-"}</p>
          <p>Model requirement: {draft.compatibility.modelRequirement}</p>
          <p>Required tools: {draft.compatibility.requiredTools.join(", ") || "-"}</p>
          <p>Estimated time: {draft.estimates.timeSpentHours}h</p>
          <p>Token cost: ${draft.estimates.tokenCostUsd}</p>
          <p>
            Revenue: ${draft.estimates.potentialMonthlyRevenueLow} - ${draft.estimates.potentialMonthlyRevenueHigh}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge>Quality {draft.quality.publishReadinessScore}</Badge>
            <Badge tone={draft.privacy.riskLevel === "high" ? "bad" : draft.privacy.riskLevel === "medium" ? "warn" : "good"}>
              Privacy {draft.privacy.riskLevel}
            </Badge>
          </div>
          {draft.quality.missingFields.length ? (
            <div>
              <h3 className="font-medium">Missing fields</h3>
              <ul className="list-disc pl-5 text-sm text-slate-700">
                {draft.quality.missingFields.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
