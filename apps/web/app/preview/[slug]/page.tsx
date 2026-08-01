"use client";

import Link from "next/link";
import { useState } from "react";

export default function LeadPreviewSitePage({ params }: { params: { slug: string } }) {
  const [claimed, setClaimed] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Formatter for slug to business name
  const formattedName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const isAuto = params.slug.includes("auto") || params.slug.includes("repair");
  const isRoofing = params.slug.includes("roof");
  const tradeName = isRoofing ? "Roofing" : isAuto ? "Auto Repair" : "Plumbing & Mechanical";

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookingSuccess(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── TOP AGENCY BUY BANNER ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-orange-500/30 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono font-bold text-orange-400 uppercase tracking-wide">Live Preview</span>
            <span className="hidden text-slate-300 sm:inline">| Custom Mobile Site for <strong>{formattedName}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">$499 One-Time Setup</span>
            <button
              onClick={() => setClaimed(true)}
              className="rounded-xl bg-orange-500 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-all hover:scale-105"
            >
              {claimed ? "✅ Claiming Site..." : "Claim This Website ($499)"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── CLAIM MODAL ───────────────────────────────────────────────────────── */}
      {claimed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-orange-500/40 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white">Claim {formattedName} Website</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              We will attach your domain, hook up your phone line for 3-second automated missed-call text-back, and publish it live within 24 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Our onboarding manager will call your line to confirm domain transfer.");
                setClaimed(false);
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Your Name / Title</label>
                <input
                  required
                  type="text"
                  placeholder="Owner Name"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Direct Cell Phone</label>
                <input
                  required
                  type="tel"
                  placeholder="(214) 555-0199"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Domain Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. motorcityrepair.com"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimed(false)}
                  className="w-1/2 rounded-xl border border-slate-700 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-xl bg-orange-500 py-3 text-xs font-black text-slate-950 hover:bg-orange-400"
                >
                  Proceed ($499)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <header className="relative border-b border-slate-900 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400">
            <span>⭐ 4.9 Rating on Google</span>
            <span>•</span>
            <span>831 Verified Reviews</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            {formattedName}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Top-Rated {tradeName} Specialists. Fast Diagnostics, Honest Pricing, & Guaranteed Satisfaction.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#booking-section"
              className="rounded-2xl bg-orange-500 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-orange-500/20 hover:bg-orange-400 transition-all hover:scale-105"
            >
              Book Appointment Online
            </a>
            <a
              href="tel:2145550199"
              className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              📞 Call Business Line
            </a>
          </div>
        </div>
      </header>

      {/* ─── SERVICES ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-black text-white sm:text-3xl">Our Specialised Services</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl mb-3">🛠️</div>
            <h3 className="text-lg font-bold text-white">Full System Inspection</h3>
            <p className="mt-2 text-xs text-slate-400">Comprehensive multi-point digital diagnostic with full transparent reporting.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-white">Emergency Repairs</h3>
            <p className="mt-2 text-xs text-slate-400">Fast turnaround service to get you back on the road safely.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-lg font-bold text-white">Guaranteed Warranty</h3>
            <p className="mt-2 text-xs text-slate-400">All parts & labor backed by our 100% satisfaction guarantee.</p>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS SHOWCASE ──────────────────────────────────────────────────── */}
      <section className="border-t border-b border-slate-900 bg-slate-900/40 px-4 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Trusted by Over 800+ Local Customers</h2>
          <p className="mt-2 text-xs text-slate-400">Google Verified Customer Reviews</p>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                "Best shop in the area! Took care of my issue in 2 hours when other shops quoted me 3 days. Super honest owner!"
              </p>
              <p className="mt-4 text-xs font-bold text-slate-400">— Verified Google Reviewer</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                "Extremely professional service. Fair prices and great communication. Will recommend to all my friends!"
              </p>
              <p className="mt-4 text-xs font-bold text-slate-400">— Local Business Client</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ONLINE BOOKING SECTION (INTEGRATED CHATURBO) ──────────────────────── */}
      <section id="booking-section" className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
          <h2 className="text-center text-xl font-black text-white sm:text-2xl">Book An Appointment Online</h2>
          <p className="mt-1 text-center text-xs text-slate-400">Instant confirmation · 24/7 Automated Scheduling</p>

          {bookingSuccess ? (
            <div className="mt-6 rounded-2xl bg-green-500/10 border border-green-500/30 p-6 text-center text-green-300">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-bold text-base">Booking Requested!</h3>
              <p className="mt-1 text-xs text-slate-300">
                We received your request for <strong>{bookingName}</strong>. Our team will text you a confirmation shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Your Name</label>
                <input
                  required
                  type="text"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="e.g. Michael Smith"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Phone Number (For Text Confirmation)</label>
                <input
                  required
                  type="tel"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  placeholder="(214) 555-0199"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Service Required</label>
                <input
                  required
                  type="text"
                  value={bookingService}
                  onChange={(e) => setBookingService(e.target.value)}
                  placeholder="e.g. Diagnostic, Maintenance, Quote"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-4 text-xs font-black text-slate-950 hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
              >
                Submit Online Booking
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} {formattedName}. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-slate-700">Pre-built preview demo site hosted by Chaturbo Agency Platform.</p>
      </footer>
    </div>
  );
}
