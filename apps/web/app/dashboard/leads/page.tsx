"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../components/LeadRescueShell";
import StatCard from "../../../components/StatCard";
import { apiRequest } from "../../../lib/api";
import type { Lead } from "../../../lib/leadRescue";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ leads: Lead[] }>("/api/rescue/leads", {}, true)
      .then((res) => setLeads(res.leads))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load leads"));
  }, []);

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-ink">Lead Inbox</h1>
          <p className="mt-2 text-sm text-slate-500">Manage missed-call rescues, SMS replies, and manual leads.</p>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total leads" value={String(leads.length)} helper="All recent lead records." />
          <StatCard label="New" value={String(leads.filter((lead) => lead.status === "new").length)} helper="Requires follow-up." />
          <StatCard label="Booked" value={String(leads.filter((lead) => lead.status === "booked").length)} helper="Jobs marked booked." />
          <StatCard label="Opted out" value={String(leads.filter((lead) => lead.optedOut).length)} helper="STOP requests and opt-outs." />
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-4 py-3 font-medium text-ink">
                      <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline">
                        {lead.phone}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{lead.source.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.status}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.urgency || "medium"}</td>
                    <td className="px-4 py-3 text-slate-600">{lead.summary || lead.serviceNeeded || "-"}</td>
                  </tr>
                ))}
                {!leads.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No leads yet. Call the demo number or send a test SMS to populate the inbox.
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
