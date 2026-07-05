"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import { apiRequest } from "../../../../lib/api";
import type { BusinessIndustry } from "../../../../lib/leadRescue";

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
        plan: "setup",
        billingStatus: "manual",
        setupFeePaid: false,
        monthlyPrice: 149,
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
