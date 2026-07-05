"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import { apiRequest } from "../../../../lib/api";
import type { BusinessIndustry, BusinessNotificationMethod, BusinessPlan, BillingStatus } from "../../../../lib/leadRescue";

const industries: BusinessIndustry[] = ["roofing", "hvac", "plumbing", "electrical", "landscaping", "cleaning", "other"];

export default function NewBusinessPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "Demo Roofing Company",
    industry: "roofing" as BusinessIndustry,
    ownerName: "Demo Owner",
    ownerMobile: "+12125550101",
    ownerEmail: "owner@example.com",
    websiteUrl: "https://example.com",
    city: "Dallas",
    state: "TX",
    serviceArea: "Dallas-Fort Worth",
    servicesJson: JSON.stringify(["roof repair", "roof replacement", "emergency leak repair"], null, 2),
    businessHoursJson: JSON.stringify({ monday: "8am-5pm", tuesday: "8am-5pm" }, null, 2),
    emergencyService: true,
    googleReviewUrl: "https://google.com",
    calendarUrl: "",
    twilioPhoneNumber: "",
    aiTone: "professional, concise, helpful",
    notificationMethod: "both" as BusinessNotificationMethod,
    status: "draft" as "draft" | "active" | "paused",
    plan: "setup" as BusinessPlan,
    billingStatus: "manual" as BillingStatus,
    setupFeePaid: false,
    monthlyPrice: 149,
    demoMode: true
  });

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        ownerEmail: form.ownerEmail || "",
        websiteUrl: form.websiteUrl || "",
        googleReviewUrl: form.googleReviewUrl || "",
        calendarUrl: form.calendarUrl || "",
        servicesJson: JSON.parse(form.servicesJson),
        businessHoursJson: JSON.parse(form.businessHoursJson)
      };
      const res = await apiRequest<{ business: { id: string } }>("/api/rescue/businesses", {
        method: "POST",
        body: JSON.stringify(payload)
      }, true);
      router.push(`/dashboard/businesses/${res.business.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business");
    } finally {
      setSaving(false);
    }
  }

  return (
    <LeadRescueShell>
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-semibold text-ink">New Business</h1>
        <p className="mt-2 text-sm text-slate-500">Create a contractor client and configure missed-call recovery.</p>
        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[
            ["name", "Business name"],
            ["ownerName", "Owner name"],
            ["ownerMobile", "Owner mobile"],
            ["ownerEmail", "Owner email"],
            ["websiteUrl", "Website URL"],
            ["city", "City"],
            ["state", "State"],
            ["serviceArea", "Service area"],
            ["googleReviewUrl", "Google review link"],
            ["calendarUrl", "Calendar link"]
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input
                value={String((form as Record<string, unknown>)[key])}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
              />
            </label>
          ))}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Industry</span>
            <select
              value={form.industry}
              onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value as BusinessIndustry }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            >
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Notification method</span>
            <select
              value={form.notificationMethod}
              onChange={(event) => setForm((current) => ({ ...current, notificationMethod: event.target.value as BusinessNotificationMethod }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            >
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as "draft" | "active" | "paused" }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Plan</span>
            <select
              value={form.plan}
              onChange={(event) => setForm((current) => ({ ...current, plan: event.target.value as BusinessPlan }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            >
              <option value="setup">Setup</option>
              <option value="monthly">Monthly</option>
              <option value="agency">Agency</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Billing status</span>
            <select
              value={form.billingStatus}
              onChange={(event) => setForm((current) => ({ ...current, billingStatus: event.target.value as BillingStatus }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            >
              <option value="manual">Manual</option>
              <option value="trial">Trial</option>
              <option value="unpaid">Unpaid</option>
              <option value="active">Active</option>
              <option value="past_due">Past due</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Monthly price</span>
            <input
              type="number"
              value={form.monthlyPrice}
              onChange={(event) => setForm((current) => ({ ...current, monthlyPrice: Number(event.target.value) }))}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              checked={form.emergencyService}
              onChange={(event) => setForm((current) => ({ ...current, emergencyService: event.target.checked }))}
            />
            <span className="text-sm font-medium text-slate-700">Emergency service offered</span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              checked={form.setupFeePaid}
              onChange={(event) => setForm((current) => ({ ...current, setupFeePaid: event.target.checked }))}
            />
            <span className="text-sm font-medium text-slate-700">Setup fee paid</span>
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Services offered JSON</span>
            <textarea
              value={form.servicesJson}
              onChange={(event) => setForm((current) => ({ ...current, servicesJson: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Business hours JSON</span>
            <textarea
              value={form.businessHoursJson}
              onChange={(event) => setForm((current) => ({ ...current, businessHoursJson: event.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create business"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </LeadRescueShell>
  );
}
