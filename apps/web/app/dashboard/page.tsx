"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../components/LeadRescueShell";
import StatCard from "../../components/StatCard";
import { apiRequest } from "../../lib/api";
import type { OverviewResponse } from "../../lib/leadRescue";

const simpleSteps = [
  "Add the business and owner phone number.",
  "Connect the business phone line.",
  "If the owner misses a call, we text the customer back.",
  "The lead lands in the inbox with a short summary."
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
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Today&apos;s overview</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">See missed calls, new leads, and which businesses need attention.</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                This dashboard should stay simple: add a business, connect the phone line, and check the lead inbox when customers call or text.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 lg:w-[320px]">
              <p className="font-semibold text-white">How it works</p>
              <ol className="mt-3 space-y-2">
                {simpleSteps.map((step, index) => (
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="New Leads" value={String(data?.stats.newLeads ?? 0)} helper="Missed calls and SMS replies waiting in the inbox." />
          <StatCard label="Missed Calls Rescued" value={String(data?.stats.missedCallsRescued ?? 0)} helper="Forwarded calls that ended in a text-back." />
          <StatCard label="Booked Jobs" value={String(data?.stats.bookedJobs ?? 0)} helper="Leads marked booked or won by the team." />
          <StatCard label="Active Businesses" value={String(data?.stats.activeBusinesses ?? 0)} helper="Contractor clients currently live." />
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
              <h2 className="text-xl font-semibold text-ink">Quick setup checklist</h2>
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
                  Add a business
                </Link>
                <Link href="/dashboard/leads" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                  Open lead inbox
                </Link>
                <Link href="/dashboard/help" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                  Get help
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-coral/25 bg-coral/10 p-6 text-sm text-slate-700">
              <p className="text-xs uppercase tracking-[0.22em] text-coral">Need-to-know</p>
              <p className="mt-2 text-lg font-semibold text-ink">Keep the owner workflow simple.</p>
              <p className="mt-2">
                Business owners should only need to answer calls, miss calls, and check new leads. Technical setup should happen behind the scenes.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
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

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Owner-friendly rules</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>1. Do not ask the customer to understand setup screens or technical settings.</p>
              <p>2. Keep business records readable: names, services, phone numbers, and service area.</p>
              <p>3. Use the Lead Inbox as the main place to work each day.</p>
              <p>4. If something needs API keys or webhooks, it belongs in internal admin setup, not here.</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
