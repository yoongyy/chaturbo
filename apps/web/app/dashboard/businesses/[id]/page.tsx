"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import CopyButton from "../../../../components/CopyButton";
import { apiRequest, getUserRole } from "../../../../lib/api";
import { pricingLabelMap } from "../../../../lib/pricing";
import type { Business, CallLog, Lead, Message, PhoneNumber } from "../../../../lib/leadRescue";

type Payload = {
  business: Business;
  leads: Lead[];
  calls: CallLog[];
  messages: Message[];
  phoneNumbers: PhoneNumber[];
};

export default function BusinessDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [canEditBilling, setCanEditBilling] = useState(false);
  const [form, setForm] = useState({
    twilioPhoneNumber: "",
    ownerName: "",
    ownerMobile: "",
    ownerEmail: "",
    websiteUrl: "",
    city: "",
    state: "",
    serviceArea: "",
    plan: "pro" as Business["plan"],
    monthlyPrice: 149,
    setupFeeAmount: 299,
    setupFeeWaived: false,
    foundingCustomer: false,
    leadLimit: 200,
    status: "draft" as Business["status"]
  });
  const [phoneForm, setPhoneForm] = useState({ phoneNumber: "", status: "active" as "active" | "inactive" | "pending" });

  useEffect(() => {
    setCanEditBilling(getUserRole() === "admin");
    apiRequest<Payload>(`/api/rescue/businesses/${params.id}`, {}, true)
      .then((res) => {
        setData(res);
        setForm({
          twilioPhoneNumber: res.business.twilioPhoneNumber || "",
          ownerName: res.business.ownerName || "",
          ownerMobile: res.business.ownerMobile || "",
          ownerEmail: res.business.ownerEmail || "",
          websiteUrl: res.business.websiteUrl || "",
          city: res.business.city || "",
          state: res.business.state || "",
          serviceArea: res.business.serviceArea || "",
          plan: res.business.plan || "pro",
          monthlyPrice: res.business.monthlyPrice || 149,
          setupFeeAmount: res.business.setupFeeAmount || 299,
          setupFeeWaived: res.business.setupFeeWaived || false,
          foundingCustomer: res.business.foundingCustomer || false,
          leadLimit: res.business.leadLimit || 200,
          status: res.business.status
        });
        setPhoneForm((current) => ({ ...current, phoneNumber: res.business.twilioPhoneNumber || "" }));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load business"));
  }, [params.id]);

  async function saveBusiness() {
    if (!data) return;
    setSaving(true);
    setError("");
    try {
      const res = await apiRequest<{ business: Business }>(`/api/rescue/businesses/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify(form)
      }, true);
      setData((current) => (current ? { ...current, business: res.business } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save business");
    } finally {
      setSaving(false);
    }
  }

  async function assignPhone() {
    setAssigning(true);
    setError("");
    try {
      const res = await apiRequest<{ business: Business }>(`/api/rescue/businesses/${params.id}/phone-number`, {
        method: "POST",
        body: JSON.stringify(phoneForm)
      }, true);
      setData((current) => (current ? { ...current, business: res.business } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign phone number");
    } finally {
      setAssigning(false);
    }
  }

  if (!data) {
    return (
      <LeadRescueShell>
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          Loading business...
        </div>
      </LeadRescueShell>
    );
  }

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Business profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">{data.business.name}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {data.business.industry} {data.business.city ? `• ${data.business.city}, ${data.business.state || ""}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/businesses" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">
                Back
              </Link>
              <Link href="/dashboard/leads" className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white">
                View leads
              </Link>
            </div>
          </div>
          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Business settings</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
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
                    value={(form[key as keyof typeof form] as string) || ""}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                  />
                </label>
              ))}

              <div className="rounded-3xl border border-orange-200 bg-orange-50/70 p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">Billing snapshot</h3>
                    <p className="text-sm text-slate-600">Simple contractor-friendly pricing. Admins can adjust the plan and setup flags here.</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                    {canEditBilling ? "Admin edit" : "Read only"}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Plan</span>
                    {canEditBilling ? (
                      <select
                        value={form.plan}
                        onChange={(event) => setForm((current) => ({ ...current, plan: event.target.value as Business["plan"] }))}
                        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                      >
                        {(["starter", "pro", "growth"] as Business["plan"][]).map((plan) => (
                          <option key={plan} value={plan}>
                            {pricingLabelMap[plan]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        {pricingLabelMap[form.plan]}
                      </div>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Monthly price</span>
                    {canEditBilling ? (
                      <input
                        type="number"
                        min="0"
                        value={form.monthlyPrice}
                        onChange={(event) => setForm((current) => ({ ...current, monthlyPrice: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                      />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">${form.monthlyPrice}/month</div>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Setup fee amount</span>
                    {canEditBilling ? (
                      <input
                        type="number"
                        min="0"
                        value={form.setupFeeAmount}
                        onChange={(event) => setForm((current) => ({ ...current, setupFeeAmount: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                      />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        {form.setupFeeWaived ? "Free setup" : `$${form.setupFeeAmount} one-time`}
                      </div>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Lead limit</span>
                    {canEditBilling ? (
                      <input
                        type="number"
                        min="0"
                        value={form.leadLimit}
                        onChange={(event) => setForm((current) => ({ ...current, leadLimit: Number(event.target.value) }))}
                        className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                      />
                    ) : (
                      <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                        Up to {form.leadLimit} rescued leads/month
                      </div>
                    )}
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.setupFeeWaived}
                      onChange={(event) => setForm((current) => ({ ...current, setupFeeWaived: event.target.checked }))}
                      disabled={!canEditBilling}
                    />
                    <span className="text-sm font-medium text-slate-700">Free setup</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.foundingCustomer}
                      onChange={(event) => setForm((current) => ({ ...current, foundingCustomer: event.target.checked }))}
                      disabled={!canEditBilling}
                    />
                    <span className="text-sm font-medium text-slate-700">Founding customer</span>
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Business status</span>
                <select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Business["status"] }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Business line on record</span>
                <input
                  value={form.twilioPhoneNumber}
                  onChange={(event) => setForm((current) => ({ ...current, twilioPhoneNumber: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                />
              </label>

              <button
                type="button"
                onClick={saveBusiness}
                disabled={saving}
                className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save business"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">Business line</h2>
              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Phone number</span>
                  <input
                    value={phoneForm.phoneNumber}
                    onChange={(event) => setPhoneForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Connection status</span>
                  <select
                    value={phoneForm.status}
                    onChange={(event) => setPhoneForm((current) => ({ ...current, status: event.target.value as "active" | "inactive" | "pending" }))}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={assignPhone}
                  disabled={assigning}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  {assigning ? "Saving..." : "Save phone number"}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <h2 className="text-xl font-semibold text-ink">How to test it</h2>
              <ol className="mt-4 space-y-2 text-sm text-slate-600">
                <li>1. Call the business line.</li>
                <li>2. Do not answer the forwarded call on the owner phone.</li>
                <li>3. Wait for the missed-call text-back.</li>
                <li>4. Reply with a job request and watch the inbox update.</li>
              </ol>
              <div className="mt-4">
                <CopyButton text={data.business.twilioPhoneNumber || ""} label="Copy phone number" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Recent leads</h2>
            <div className="mt-4 space-y-3">
              {data.leads.map((lead) => (
                <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="block rounded-2xl border border-slate-200 px-4 py-4 hover:bg-slate-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{lead.phone}</p>
                      <p className="mt-1 text-sm text-slate-500">{lead.summary || lead.serviceNeeded || "Lead activity"}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{lead.status}</span>
                  </div>
                </Link>
              ))}
              {!data.leads.length ? <p className="text-sm text-slate-500">No leads yet.</p> : null}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Recent calls</h2>
            <div className="mt-4 space-y-3">
              {data.calls.map((call) => (
                <div key={call.id} className="rounded-2xl border border-slate-200 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{call.fromNumber}</p>
                      <p className="mt-1 text-sm text-slate-500">{call.status}</p>
                    </div>
                    <span className="text-sm text-slate-500">{new Date(call.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {!data.calls.length ? <p className="text-sm text-slate-500">No calls yet.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
