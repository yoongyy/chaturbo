"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import { apiRequest } from "../../../../lib/api";
import { defaultBusinessBilling } from "../../../../lib/pricing";
import type { BusinessIndustry, BusinessPlan } from "../../../../lib/leadRescue";

const industries: BusinessIndustry[] = ["roofing", "hvac", "plumbing", "electrical", "landscaping", "cleaning", "other"];

function splitLines(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

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
    servicesText: "Roof repair\nRoof replacement\nEmergency leak repair",
    hoursText: "Mon-Fri 8am-5pm",
    plan: defaultBusinessBilling.plan as BusinessPlan,
    monthlyPrice: defaultBusinessBilling.monthlyPrice,
    setupFeeAmount: defaultBusinessBilling.setupFeeAmount,
    setupFeeWaived: defaultBusinessBilling.setupFeeWaived,
    foundingCustomer: defaultBusinessBilling.foundingCustomer,
    leadLimit: defaultBusinessBilling.leadLimit,
    emergencyService: true,
    demoMode: false
  });

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        industry: form.industry,
        ownerName: form.ownerName,
        ownerMobile: form.ownerMobile,
        ownerEmail: form.ownerEmail || "",
        websiteUrl: form.websiteUrl || "",
        city: form.city,
        state: form.state,
        serviceArea: form.serviceArea,
        servicesJson: splitLines(form.servicesText),
        businessHoursJson: form.hoursText.trim() ? { notes: form.hoursText.trim() } : {},
        emergencyService: form.emergencyService,
        googleReviewUrl: "",
        calendarUrl: "",
        twilioPhoneNumber: "",
        aiTone: "friendly, clear, helpful",
        notificationMethod: "both",
        status: "draft",
        plan: form.plan,
        billingStatus: "manual",
        setupFeePaid: form.setupFeeWaived || form.foundingCustomer,
        monthlyPrice: form.monthlyPrice,
        setupFeeAmount: form.setupFeeAmount,
        setupFeeWaived: form.setupFeeWaived,
        foundingCustomer: form.foundingCustomer,
        leadLimit: form.leadLimit,
        demoMode: form.demoMode
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
        <p className="mt-2 text-sm text-slate-500">Add the basic business details. Keep it simple and readable for the owner.</p>
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
            ["serviceArea", "Service area"]
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
              checked={form.demoMode}
              onChange={(event) => setForm((current) => ({ ...current, demoMode: event.target.checked }))}
            />
            <span className="text-sm font-medium text-slate-700">Use this as a demo business</span>
          </label>

          <div className="rounded-3xl border border-orange-200 bg-orange-50/80 p-5 lg:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Billing defaults</h2>
                <p className="text-sm text-slate-600">New businesses default to the Pro plan at $149/month with a $299 setup fee.</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                Admin controls
              </span>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Plan</span>
                <select
                  value={form.plan}
                  onChange={(event) => setForm((current) => ({ ...current, plan: event.target.value as BusinessPlan }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                >
                  <option value="starter">Starter - $79/month</option>
                  <option value="pro">Pro - $149/month</option>
                  <option value="growth">Growth - $299/month</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Monthly price</span>
                <input
                  type="number"
                  min="0"
                  value={form.monthlyPrice}
                  onChange={(event) => setForm((current) => ({ ...current, monthlyPrice: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Setup fee amount</span>
                <input
                  type="number"
                  min="0"
                  value={form.setupFeeAmount}
                  onChange={(event) => setForm((current) => ({ ...current, setupFeeAmount: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Lead limit</span>
                <input
                  type="number"
                  min="0"
                  value={form.leadLimit}
                  onChange={(event) => setForm((current) => ({ ...current, leadLimit: Number(event.target.value) }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                />
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.setupFeeWaived}
                  onChange={(event) => setForm((current) => ({ ...current, setupFeeWaived: event.target.checked }))}
                />
                <span className="text-sm font-medium text-slate-700">Free setup</span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.foundingCustomer}
                  onChange={(event) => setForm((current) => ({ ...current, foundingCustomer: event.target.checked }))}
                />
                <span className="text-sm font-medium text-slate-700">Founding customer</span>
              </label>
            </div>
          </div>

          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Main services offered</span>
            <textarea
              value={form.servicesText}
              onChange={(event) => setForm((current) => ({ ...current, servicesText: event.target.value }))}
              rows={4}
              placeholder={"Roof repair\nRoof replacement\nEmergency leak repair"}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
            <p className="mt-2 text-xs text-slate-500">Use one line per service, or separate them with commas.</p>
          </label>

          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Business hours</span>
            <textarea
              value={form.hoursText}
              onChange={(event) => setForm((current) => ({ ...current, hoursText: event.target.value }))}
              rows={3}
              placeholder="Mon-Fri 8am-5pm, Sat 9am-1pm"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
            <p className="mt-2 text-xs text-slate-500">Plain English is fine. No special format is needed.</p>
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
