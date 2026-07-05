"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { apiRequest } from "../../lib/api";

const messageSourceOptions = [
  "WhatsApp",
  "Facebook",
  "Instagram",
  "Website",
  "Email",
  "Phone Calls",
  "Other"
];

const urgencyOptions = ["This week", "This month", "Just exploring"] as const;

type LeadResponse = {
  message: string;
};

export default function ApplyPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>(["WhatsApp"]);
  const [selectedUrgency, setSelectedUrgency] = useState<(typeof urgencyOptions)[number]>("This month");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sourceOther, setSourceOther] = useState("");

  const otherSelected = useMemo(() => selectedSources.includes("Other"), [selectedSources]);

  function toggleSource(source: string) {
    setSelectedSources((current) =>
      current.includes(source) ? current.filter((item) => item !== source) : [...current, source]
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      companyName: String(form.get("companyName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      industry: String(form.get("industry") || ""),
      businessLocation: String(form.get("businessLocation") || ""),
      websiteOrSocial: String(form.get("websiteOrSocial") || ""),
      taskToAutomate: String(form.get("taskToAutomate") || ""),
      customerMessageSources: selectedSources,
      customerMessageSourceOther: sourceOther,
      urgency: selectedUrgency,
      consent: Boolean(form.get("consent"))
    };

    try {
      await apiRequest<LeadResponse>("/api/leads", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit the application.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
        <section className="mx-auto max-w-3xl rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Application received</p>
          <h1 className="font-display mt-3 text-4xl font-black text-white">Thank you. We received your application.</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Chaturbo will contact you soon for a free consultation. We’ll review the workflow you want to automate and suggest the best starting pilot.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/apply" className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950">
              Start Another Audit
            </Link>
            <Link href="/apply" className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white">
              Apply Free Setup
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
      <section className="mx-auto max-w-5xl rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] px-6 py-8 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:px-8 md:py-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Apply</p>
        <h1 className="font-display mt-3 text-4xl font-black md:text-5xl">Apply for Free Setup</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Tell us what repetitive task is slowing your team down. We’ll use the application to design your first pilot and reach out for a consultation.
        </p>
      </section>

      <section className="mx-auto mt-6 max-w-5xl rounded-[34px] border border-orange-200 bg-[#f6f1e7] p-6 shadow-[0_18px_50px_rgba(18,46,54,0.08)] md:p-8">
        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Full name</span>
              <input name="fullName" required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Company name</span>
              <input name="companyName" required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Phone / WhatsApp number</span>
              <input name="phone" required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input name="email" type="email" required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Industry</span>
              <input
                name="industry"
                list="industry-options"
                placeholder="e.g. clinic, accounting, renovation"
                required
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint"
              />
              <datalist id="industry-options">
                <option value="Accounting & bookkeeping firms" />
                <option value="Clinics, dental, aesthetic, wellness centres" />
                <option value="Renovation, contractor, cleaning, pest control" />
                <option value="Tuition and training centres" />
                <option value="Property agents and agencies" />
                <option value="Car dealers and service businesses" />
              </datalist>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Business location</span>
              <input name="businessLocation" placeholder="Kuala Lumpur, Selangor, etc." required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Website / Facebook page / Instagram page</span>
            <input name="websiteOrSocial" placeholder="https://..." required className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">What task do you want AI to automate?</span>
            <textarea
              name="taskToAutomate"
              rows={5}
              required
              placeholder="Tell us the repetitive task, workflow, or bottleneck you want to solve first."
              className="rounded-3xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint"
            />
          </label>

          <div className="grid gap-3">
            <span className="text-sm font-semibold text-slate-700">Where do your customer messages come from?</span>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {messageSourceOptions.map((source) => (
                <label
                  key={source}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    selectedSources.includes(source) ? "border-mint bg-[#eef9f5]" : "border-black/10 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="h-4 w-4 rounded border-black/20 text-mint focus:ring-mint"
                  />
                  <span className="text-sm text-slate-700">{source}</span>
                </label>
              ))}
            </div>
            {otherSelected ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Other message source</span>
                <input
                  value={sourceOther}
                  onChange={(event) => setSourceOther(event.target.value)}
                  placeholder="Tell us where else leads come from"
                  className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-mint"
                />
              </label>
            ) : null}
          </div>

          <div className="grid gap-3">
            <span className="text-sm font-semibold text-slate-700">How urgent is this?</span>
            <div className="flex flex-wrap gap-3">
              {urgencyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedUrgency(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                    selectedUrgency === option ? "border-ink bg-ink text-white" : "border-black/10 bg-white text-slate-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
            <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 rounded border-black/20 text-mint focus:ring-mint" />
            <span className="text-sm text-slate-700">I agree to be contacted by Chaturbo about AI agent setup.</span>
          </label>

          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              disabled={loading}
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ink/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Apply for Free Setup"}
            </button>
            <Link href="/apply" className="rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
              Start Another Audit
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
