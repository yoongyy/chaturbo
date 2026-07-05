"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../components/LeadRescueShell";
import StatCard from "../../../components/StatCard";
import { apiRequest } from "../../../lib/api";
import type { Business } from "../../../lib/leadRescue";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ businesses: Business[] }>("/api/rescue/businesses", {}, true)
      .then((res) => setBusinesses(res.businesses))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load businesses"));
  }, []);

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink">Businesses</h1>
              <p className="mt-2 text-sm text-slate-500">Create contractor clients and manage their missed-call recovery setup.</p>
            </div>
            <Link href="/dashboard/businesses/new" className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white">
              New business
            </Link>
          </div>
        </section>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total businesses" value={String(businesses.length)} helper="Contractor clients in the system." />
          <StatCard label="Active" value={String(businesses.filter((business) => business.status === "active").length)} helper="Live businesses taking calls." />
          <StatCard label="Demo mode" value={String(businesses.filter((business) => business.demoMode).length)} helper="Businesses configured for sales demos." />
          <StatCard label="Draft" value={String(businesses.filter((business) => business.status === "draft").length)} helper="Setup in progress." />
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Industry</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Twilio Number</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {businesses.map((business) => (
                  <tr key={business.id}>
                    <td className="px-4 py-3 font-medium text-ink">
                      <Link href={`/dashboard/businesses/${business.id}`} className="hover:underline">
                        {business.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{business.industry}</td>
                    <td className="px-4 py-3 text-slate-600">{business.ownerName || "-"}</td>
                    <td className="px-4 py-3 text-slate-600">{business.twilioPhoneNumber || "Not assigned"}</td>
                    <td className="px-4 py-3 text-slate-600">{business.status}</td>
                  </tr>
                ))}
                {!businesses.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No businesses yet. Add Demo Roofing Company or create a new contractor client.
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
