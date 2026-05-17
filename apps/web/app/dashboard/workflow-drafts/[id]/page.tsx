"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../../../components/Badge";
import { apiRequest } from "../../../../lib/api";
import { Draft } from "../../../../lib/types";

export default function DraftDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function load() {
    apiRequest<{ draft: Draft }>(`/workflow-drafts/${params.id}`, {}, true)
      .then((res) => setDraft(res.draft))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load draft"));
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function action(path: string, method = "POST") {
    setLoading(true);
    setError("");
    try {
      await apiRequest(path, { method }, true);
      if (method === "DELETE") {
        router.push("/dashboard/workflow-drafts");
      } else {
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
              Publish
            </button>
            <button
              disabled={loading}
              onClick={() => action(`/workflow-drafts/${draft._id}/reject`)}
              className="rounded-lg border border-slate-300 px-4 py-2"
            >
              Reject
            </button>
            <button
              disabled={loading}
              onClick={() => action(`/workflow-drafts/${draft._id}`, "DELETE")}
              className="rounded-lg bg-rose-600 px-4 py-2 text-white"
            >
              Delete
            </button>
          </div>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3 p-4">
          <h2 className="text-lg font-semibold">Problem</h2>
          <p>{draft.problem.description}</p>
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
