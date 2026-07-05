"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../components/LeadRescueShell";
import StatCard from "../../../components/StatCard";
import { apiRequest } from "../../../lib/api";
import type { AuditTarget, Business, Lead } from "../../../lib/leadRescue";

type AdminSnapshot = {
  businesses: Business[];
  leads: Lead[];
  targets: AuditTarget[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminSnapshot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest<{ businesses: Business[] }>("/api/rescue/businesses", {}, true),
      apiRequest<{ leads: Lead[] }>("/api/rescue/leads", {}, true),
      apiRequest<{ targets: AuditTarget[] }>("/api/rescue/audits/targets", {}, true)
    ])
      .then(([businesses, leads, targets]) =>
        setData({
          businesses: businesses.businesses,
          leads: leads.leads,
          targets: targets.targets
        })
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load admin dashboard"));
  }, []);

  const businesses = data?.businesses || [];
  const leads = data?.leads || [];
  const targets = data?.targets || [];

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[32px] border border-slate-800 bg-slate-950 px-6 py-7 text-white shadow-[0_24px_90px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Internal admin</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">Manage onboarding, quality, and internal operations.</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300">
                This area is for your team. Keep customer-facing owners in the simple business and lead workflow. Use this side for audits, internal setup, and operational checks.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300 lg:w-[320px]">
              <p className="font-semibold text-white">Admin rules</p>
              <ol className="mt-3 space-y-2">
                <li>1. Owners should not see technical setup.</li>
                <li>2. Audits and internal controls stay with admin.</li>
                <li>3. Businesses and lead quality should be reviewed here before rollout.</li>
              </ol>
            </div>
          </div>
        </section>

        {error ? <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Businesses" value={String(businesses.length)} helper="All customer accounts in the system." />
          <StatCard label="Open Leads" value={String(leads.filter((lead) => lead.status === "new").length)} helper="New or untouched leads across all businesses." />
          <StatCard label="Audit Targets" value={String(targets.length)} helper="Internal outreach or pre-sales targets." />
          <StatCard label="Needs Setup" value={String(businesses.filter((business) => business.status === "draft").length)} helper="Accounts that are not live yet." />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Admin actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/dashboard/businesses" className="rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
                Review businesses
              </Link>
              <Link href="/dashboard/leads" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Review lead inbox
              </Link>
              <Link href="/admin/audits" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Manage audits
              </Link>
              <Link href="/admin/settings" className="rounded-2xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                Internal help
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Readiness checks</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Owner portal is simple enough for basic pilot use.</p>
              <p>Admin tools still need stricter server-side authorization before real production rollout.</p>
              <p>Phone, SMS, and onboarding flows still need final validation with real customer data.</p>
              <p>Use this admin side for internal control, not customer-facing daily use.</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
