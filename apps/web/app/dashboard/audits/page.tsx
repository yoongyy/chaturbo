"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../components/LeadRescueShell";
import StatCard from "../../../components/StatCard";
import { apiRequest } from "../../../lib/api";
import type { AuditTarget } from "../../../lib/leadRescue";

export default function AuditsPage() {
  const [targets, setTargets] = useState<AuditTarget[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ targets: AuditTarget[] }>("/api/rescue/audits/targets", {}, true)
      .then((res) => setTargets(res.targets))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load audits"));
  }, []);

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink">Audits</h1>
              <p className="mt-2 text-sm text-slate-500">Generate personalized lead-rescue audits and outreach assets.</p>
            </div>
            <Link href="/dashboard/audits/new" className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white">
              New audit target
            </Link>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Targets" value={String(targets.length)} helper="Contractor prospects added manually or by CSV paste." />
          <StatCard label="Crawled" value={String(targets.filter((target) => target.crawlStatus === "crawled").length)} helper="Sites with extracted homepage text." />
          <StatCard label="Contacted" value={String(targets.filter((target) => target.status === "contacted").length)} helper="Prospects already reached out to." />
          <StatCard label="Converted" value={String(targets.filter((target) => target.status === "converted").length)} helper="Targets converted into businesses." />
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Crawl</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {targets.map((target) => (
                  <tr key={target.id}>
                    <td className="px-4 py-3 font-medium text-ink">{target.businessName}</td>
                    <td className="px-4 py-3 text-slate-600">{target.industry}</td>
                    <td className="px-4 py-3 text-slate-600">{target.crawlStatus}</td>
                    <td className="px-4 py-3 text-slate-600">{target.status}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/audits/${target.id}`} className="font-semibold text-mint">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
                {!targets.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No targets yet. Add a roofing, HVAC, or plumbing prospect to generate an audit.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
