"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import BrandMark from "../../components/BrandMark";

export default function FreeAuditPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    trade: "",
    phone: "",
    website: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "We could not submit your audit request right now.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to submit the request.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-12 flex flex-col justify-center items-center">
        <section className="w-full max-w-2xl rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-8 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/25 bg-green-500/10 text-green-400">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Request Received</p>
          <h1 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl">We are on it!</h1>
          <p className="mt-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            Thank you, {formData.ownerName}. We have queued your request to audit <strong>{formData.companyName}</strong>. 
            We will scan your site response times, check competitor chat setups, and email your PDF audit report to <strong>{formData.email}</strong> within 24 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-orange-400 transition-colors">
              Return Home
            </Link>
            <Link href="/demo" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Try Interactive Sandbox
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-12 flex flex-col justify-center items-center">
      <div className="mb-8 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark className="h-9 w-auto text-orange-500" />
        </Link>
      </div>

      <section className="w-full max-w-2xl rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400 text-center">Free Report</p>
        <h1 className="font-display mt-3 text-3xl font-black text-center text-white sm:text-4xl">Get Your Free Revenue Leak Audit</h1>
        <p className="mt-4 text-center text-sm leading-relaxed text-slate-300">
          We will analyze your business phone line, search visibility, and compute how much revenue you are losing to local competitors when calls go unanswered.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Company Name</label>
              <input
                required
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Dallas Roofing Pros"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Owner Name</label>
              <input
                required
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Business Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. john@dallasroofing.com"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Trade / Industry</label>
              <input
                required
                type="text"
                value={formData.trade}
                onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                placeholder="e.g. Roofing, Plumbing, HVAC"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Phone Number</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. (214) 555-0199"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 ml-1 block text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Website URL</label>
              <input
                required
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="e.g. https://dallasroofing.com"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-650 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {error ? <p className="text-sm font-semibold text-rose-450 text-center">{error}</p> : null}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-orange-500 py-4 text-sm font-bold text-slate-950 hover:bg-orange-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-orange-500/10"
          >
            {loading ? "Requesting Audit Report..." : "Submit Audit Request"}
          </button>
        </form>
      </section>
    </main>
  );
}
