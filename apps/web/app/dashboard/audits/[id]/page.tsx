"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import CopyButton from "../../../../components/CopyButton";
import { apiRequest } from "../../../../lib/api";
import type { Audit, AuditTarget, Business } from "../../../../lib/leadRescue";

type Payload = { target: AuditTarget; audits: Audit[] };

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Payload | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"crawl" | "generate" | "convert" | "">("");

  useEffect(() => {
    apiRequest<Payload>(`/api/rescue/audits/targets/${params.id}`, {}, true)
      .then((res) => {
        setData(res);
        setSelectedAudit(res.audits[0] || null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load audit"));
  }, [params.id]);

  async function crawl() {
    setBusy("crawl");
    setError("");
    try {
      const res = await apiRequest<{ target: AuditTarget }>(`/api/rescue/audits/targets/${params.id}/crawl`, {
        method: "POST"
      }, true);
      const refreshed = await apiRequest<Payload>(`/api/rescue/audits/targets/${params.id}`, {}, true);
      setData(refreshed);
      setSelectedAudit(refreshed.audits[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to crawl target");
    } finally {
      setBusy("");
    }
  }

  async function generate() {
    setBusy("generate");
    setError("");
    try {
      await apiRequest(`/api/rescue/audits/targets/${params.id}/generate`, {
        method: "POST"
      }, true);
      const refreshed = await apiRequest<Payload>(`/api/rescue/audits/targets/${params.id}`, {}, true);
      setData(refreshed);
      setSelectedAudit(refreshed.audits[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate audit");
    } finally {
      setBusy("");
    }
  }

  async function convert() {
    setBusy("convert");
    setError("");
    try {
      await apiRequest<{ business: Business }>(`/api/rescue/audits/targets/${params.id}/convert`, {
        method: "POST"
      }, true);
      const refreshed = await apiRequest<Payload>(`/api/rescue/audits/targets/${params.id}`, {}, true);
      setData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert target");
    } finally {
      setBusy("");
    }
  }

  if (!data) {
    return (
      <LeadRescueShell>
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          Loading audit target...
        </div>
      </LeadRescueShell>
    );
  }

  const audit = selectedAudit;

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Audit detail</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">{data.target.businessName}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {data.target.industry} {data.target.city ? `• ${data.target.city}, ${data.target.state || ""}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={crawl} disabled={busy === "crawl"} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50">
                {busy === "crawl" ? "Crawling..." : "Crawl website"}
              </button>
              <button onClick={generate} disabled={busy === "generate"} className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {busy === "generate" ? "Generating..." : "Generate audit"}
              </button>
              <button onClick={convert} disabled={busy === "convert"} className="rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {busy === "convert" ? "Converting..." : "Convert to business"}
              </button>
            </div>
          </div>
          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Target info</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Website: {data.target.websiteUrl || "-"}</p>
                <p>Owner: {data.target.ownerName || "-"}</p>
                <p>Email: {data.target.email || "-"}</p>
                <p>Phone: {data.target.phone || "-"}</p>
                <p>Review count: {data.target.reviewCount ?? "-"}</p>
                <p>Rating: {data.target.rating ?? "-"}</p>
                <p>Crawl: {data.target.crawlStatus}</p>
              </div>
              <div className="mt-4">
                <CopyButton text={data.target.websiteUrl || ""} label="Copy website" />
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Generated versions</h2>
              <div className="mt-4 space-y-2">
                {data.audits.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedAudit(item)}
                    className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                      audit?.id === item.id ? "border-mint bg-mint/5 text-ink" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </button>
                ))}
                {!data.audits.length ? <p className="text-sm text-slate-500">No generated audits yet.</p> : null}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Lead rescue audit</h2>
              {audit ? (
                <div className="mt-4 space-y-5 text-sm text-slate-700">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Summary</p>
                    <p className="mt-2">{audit.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Problems found</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      {audit.problemsJson.map((problem) => (
                        <li key={problem}>{problem}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Recommendations</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      {audit.recommendationsJson.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <CopyButton text={audit.coldEmail} label="Copy cold email" />
                    <CopyButton text={audit.followupEmail1} label="Copy follow-up 1" />
                    <CopyButton text={audit.followupEmail2} label="Copy follow-up 2" />
                    <CopyButton text={audit.callScript} label="Copy call script" />
                    <CopyButton text={audit.facebookMessage} label="Copy Facebook message" />
                    <CopyButton text={audit.contactFormMessage} label="Copy form message" />
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Video script</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{audit.videoScript}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Public audit URL</p>
                    <Link href={`/audit/${audit.slug}`} className="mt-2 block font-semibold text-mint">
                      /audit/{audit.slug}
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Generate an audit to see the summary, problems, and outreach assets.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
