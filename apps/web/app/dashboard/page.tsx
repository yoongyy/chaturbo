"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../components/LeadRescueShell";
import StatCard from "../../components/StatCard";
import { apiRequest } from "../../lib/api";
import type { OverviewResponse } from "../../lib/leadRescue";

const demoSteps = [
  "Create or open Demo Roofing Company.",
  "Assign a Twilio number in the business record.",
  "Call the number and let the forwarded call miss.",
  "Wait for the automated SMS and reply with a job request.",
  "Watch the lead summary appear in the inbox."
];

export default function DashboardPage() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<OverviewResponse>("/api/rescue/overview", {}, true)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[32px] border border-slate-800 bg-slate-950 px-6 py-7 text-white shadow-[0_24px_90px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Lead rescue command center</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">
                Recover missed calls before customers call your competitor.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                Manage contractor businesses, forward calls to owners, text back missed calls, qualify inbound leads, and generate personalized audits that close setup deals.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 lg:w-[320px]">
              <p className="font-semibold text-white">Sales demo flow</p>
              <ol className="mt-3 space-y-2">
                {demoSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="New Leads" value={String(data?.stats.newLeads ?? 0)} helper="Missed calls and SMS replies waiting in the inbox." />
          <StatCard label="Missed Calls Rescued" value={String(data?.stats.missedCallsRescued ?? 0)} helper="Forwarded calls that ended in a text-back." />
          <StatCard label="Booked Jobs" value={String(data?.stats.bookedJobs ?? 0)} helper="Leads marked booked or won by the team." />
          <StatCard label="Active Businesses" value={String(data?.stats.activeBusinesses ?? 0)} helper="Contractor clients currently live." />
          <StatCard label="Audit Targets" value={String(data?.stats.auditTargets ?? 0)} helper="Prospects ready for lead-rescue audits." />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-ink">Recent Leads</h2>
                <p className="mt-1 text-sm text-slate-500">Missed-call rescues, SMS replies, and manually added leads.</p>
              </div>
              <Link href="/dashboard/leads" className="text-sm font-semibold text-mint">
                View inbox
              </Link>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Urgency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(data?.recentLeads || []).map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-4 py-3 font-medium text-ink">
                        <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline">
                          {lead.phone}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{lead.source.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.status}</td>
                      <td className="px-4 py-3 text-slate-600">{lead.urgency || "medium"}</td>
                    </tr>
                  ))}
                  {!data?.recentLeads?.length ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        No leads yet. Once the demo number misses a call, the lead will show here.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Setup checklist</h2>
              <div className="mt-4 space-y-3">
                {(data?.checklist || []).map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.done ? "bg-emerald-500" : "bg-slate-300"} text-[10px] text-white`}>
                      {item.done ? "✓" : "•"}
                    </span>
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Quick actions</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/dashboard/businesses/new" className="rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
                  Create business
                </Link>
                <Link href="/dashboard/audits/new" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                  Add audit target
                </Link>
                <Link href="/dashboard/settings" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                  Demo instructions
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-coral/25 bg-coral/10 p-6 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.22em] text-coral">Demo business</p>
              <p className="mt-2 text-lg font-semibold text-ink">Demo Roofing Company</p>
              <p className="mt-2">
                Use this business to show the live missed-call flow: call the number, don&apos;t answer the forwarded call, wait for the SMS, then reply with a job request.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">Recent Audit Targets</h2>
                <p className="mt-1 text-sm text-slate-500">Prospects ready for a personalized audit and outreach sequence.</p>
              </div>
              <Link href="/dashboard/audits" className="text-sm font-semibold text-mint">
                View audits
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {(data?.recentAudits || []).map((target) => (
                <div key={target.id} className="rounded-2xl border border-slate-200 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{target.businessName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {target.industry} {target.city ? `• ${target.city}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{target.status}</span>
                  </div>
                </div>
              ))}
              {!data?.recentAudits?.length ? (
                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                  No audit targets yet. Add a contractor prospect to generate a personalized audit.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Recent Businesses</h2>
            <div className="mt-5 space-y-3">
              {(data?.recentBusinesses || []).map((business) => (
                <Link
                  key={business.id}
                  href={`/dashboard/businesses/${business.id}`}
                  className="block rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-mint/40 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{business.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {business.industry} {business.city ? `• ${business.city}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {business.status}
                    </span>
                  </div>
                </Link>
              ))}
              {!data?.recentBusinesses?.length ? (
                <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                  No businesses yet. Add your first contractor client from the Businesses page.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
