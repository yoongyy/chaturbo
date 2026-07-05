"use client";

import LeadRescueShell from "../../../components/LeadRescueShell";

export default function AdminSettingsPage() {
  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-ink">Admin Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Internal-only setup, operational rules, and controls that should stay out of the owner portal.</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Admin-only tools</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Audit targets, public audit pages, and outreach copy.</p>
              <p>Webhook URLs, API hosts, vendor IDs, and environment wiring.</p>
              <p>Workflow review, publishing, and internal marketplace controls.</p>
              <p>Platform-wide onboarding checks before a business goes live.</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Owner portal rule</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Owners should only see businesses, leads, simple status, and basic help.</p>
              <p>If the screen needs technical knowledge, it belongs here instead.</p>
              <p>Do not ask owners to edit JSON, inspect webhooks, or manage infrastructure details.</p>
              <p>Keep the customer-facing workflow focused on booking jobs and replying to leads.</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
