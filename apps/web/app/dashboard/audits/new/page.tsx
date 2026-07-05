"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import { apiRequest } from "../../../../lib/api";

export default function NewAuditTargetPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    industry: "roofing",
    websiteUrl: "",
    city: "",
    state: "",
    ownerName: "",
    email: "",
    phone: "",
    googleProfileUrl: "",
    reviewCount: "",
    rating: "",
    notes: ""
  });

  async function submit() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        websiteUrl: form.websiteUrl || "",
        email: form.email || "",
        googleProfileUrl: form.googleProfileUrl || "",
        reviewCount: form.reviewCount ? Number(form.reviewCount) : undefined,
        rating: form.rating ? Number(form.rating) : undefined
      };
      const res = await apiRequest<{ target: { id: string } }>("/api/rescue/audits/targets", {
        method: "POST",
        body: JSON.stringify(payload)
      }, true);
      router.push(`/dashboard/audits/${res.target.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create target");
    } finally {
      setSaving(false);
    }
  }

  return (
    <LeadRescueShell>
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-semibold text-ink">New Audit Target</h1>
        <p className="mt-2 text-sm text-slate-500">Add a contractor prospect and generate a personalized audit.</p>
        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[
            ["businessName", "Business name"],
            ["industry", "Industry"],
            ["websiteUrl", "Website URL"],
            ["city", "City"],
            ["state", "State"],
            ["ownerName", "Owner name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["googleProfileUrl", "Google profile URL"],
            ["reviewCount", "Review count"],
            ["rating", "Rating"]
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-sm font-medium text-slate-700">{label}</span>
              <input
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
              />
            </label>
          ))}

          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={submit} disabled={saving} className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Create target"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </button>
        </div>
      </div>
    </LeadRescueShell>
  );
}
