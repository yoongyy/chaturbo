"use client";

import Link from "next/link";
import { useState } from "react";
import BrandMark from "../components/BrandMark";

export default function NewChaturboHomePage() {
  const [selectedCity, setSelectedCity] = useState("Dallas, TX");
  const [selectedTrade, setSelectedTrade] = useState("Auto Repair");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── NAVIGATION ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 text-orange-500" />
            <span className="text-xl font-black tracking-tight text-white">
              Chaturbo<span className="text-orange-500">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#demo" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-bold text-slate-300 hover:text-white sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/preview/motor-city-auto-repair"
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-all hover:scale-105"
            >
              View Sample Pre-Built Site ($499)
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>AI Website Builder & Booking Engine for Local Businesses</span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
            Turn Your Google Reviews Into A <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">$500/mo Booking Machine.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300 sm:text-xl leading-relaxed">
            Over 68% of top-rated local contractors lose customers because they have <strong className="text-white">zero website</strong> listed on Google. Chaturbo automatically codes a custom 1-page mobile site featuring your Google reviews and 24/7 automated booking in <strong className="text-orange-400">5 minutes</strong>.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/preview/motor-city-auto-repair"
              className="rounded-2xl bg-orange-500 px-8 py-4 text-sm font-black text-slate-950 shadow-2xl shadow-orange-500/30 hover:bg-orange-400 transition-all hover:scale-105"
            >
              See Sample Pre-Built Site ($499) →
            </Link>
            <Link
              href="/free-audit"
              className="rounded-2xl border border-slate-800 bg-slate-900/90 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all"
            >
              Get Free Website Audit
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-slate-900 pt-10 sm:grid-cols-4 text-left">
            <div>
              <div className="text-3xl font-black text-white">$499</div>
              <div className="text-xs text-slate-400 mt-1">Flat Setup Fee</div>
            </div>
            <div>
              <div className="text-3xl font-black text-orange-400">5 Mins</div>
              <div className="text-xs text-slate-400 mt-1">AI Website Build Time</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">4.9 ★</div>
              <div className="text-xs text-slate-400 mt-1">Google Review Showcase</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">24/7</div>
              <div className="text-xs text-slate-400 mt-1">Automated Booking</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE INTERACTIVE DEMO ──────────────────────────────────────────────── */}
      <section id="demo" className="border-t border-slate-900 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-4 text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
            Live Demo Preview
          </div>
          <h2 className="text-3xl font-black text-white sm:text-5xl">
            See What Your Custom Site Looks Like
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto">
            Click below to inspect an actual pre-built website generated for Motor City Auto Repair (Dallas, TX — 831 Google Reviews).
          </p>

          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="rounded-lg bg-slate-950 px-4 py-1 text-xs font-mono text-slate-400 border border-slate-800">
                https://chaturbo.com/preview/motor-city-auto-repair
              </div>
              <Link
                href="/preview/motor-city-auto-repair"
                className="text-xs font-bold text-orange-400 hover:underline"
              >
                Open Full Screen ↗
              </Link>
            </div>

            {/* Embedded Live Preview Container */}
            <div className="p-8 text-left bg-slate-950">
              <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-xs font-bold text-orange-400 mb-4">
                  ⭐ 4.9 Rating on Google · 831 Verified Reviews
                </div>
                <h3 className="text-3xl font-black text-white">Motor City Auto Repair</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Dallas, TX · Full Service Auto Repair & Digital Diagnostics
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/preview/motor-city-auto-repair#booking-section"
                    className="rounded-xl bg-orange-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-orange-400 shadow-lg"
                  >
                    Book Online Now
                  </Link>
                  <a
                    href="tel:2145550199"
                    className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    📞 (214) 555-0199
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl">How We Get You Live In 3 Steps</h2>
            <p className="mt-3 text-sm text-slate-400">Zero tech skills required. We handle 100% of the build.</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-black text-xl border border-orange-500/30">
                1
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">AI Scrapes & Pre-Builds</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Our AI pulls your business details, logo, and 5-star Google reviews directly from your Google Maps listing.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-black text-xl border border-orange-500/30">
                2
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Interactive Booking Widget</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                We integrate a 24/7 online booking form and automated 3-second missed-call text-back system.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 font-black text-xl border border-orange-500/30">
                3
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">Live On Your Domain</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                You pay a flat $499 setup fee. We attach your domain name, link your Google profile, and hand over the keys.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-slate-900 bg-slate-900/20 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-black text-white sm:text-5xl">Simple, Transparent Pricing</h2>
          <p className="mt-3 text-sm text-slate-400">One flat setup fee. Zero hidden costs.</p>

          <div className="mt-12 rounded-3xl border border-orange-500/40 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-orange-500 px-4 py-1 text-xs font-black text-slate-950 uppercase tracking-wide">
              Most Popular
            </div>

            <div className="text-4xl font-black text-white sm:text-6xl">$499</div>
            <p className="text-xs font-bold text-orange-400 mt-1 uppercase tracking-wide">One-Time Setup Fee</p>
            <p className="text-xs text-slate-400 mt-2">+ $49/month for cloud hosting & 24/7 automated text-back booking</p>

            <ul className="my-8 space-y-3 text-left text-xs text-slate-300 max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✓</span> Pre-built custom 1-page mobile website
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✓</span> Direct integration of 5-star Google Reviews
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✓</span> 24/7 Online Appointment Booking Widget
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✓</span> 3-Second Automated Missed-Call Text-Back
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">✓</span> Custom Domain Setup & SSL Security
              </li>
            </ul>

            <Link
              href="/preview/motor-city-auto-repair"
              className="block w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-slate-950 hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20"
            >
              Claim Your Pre-Built Website Now ($499)
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 py-12 text-center text-xs text-slate-600">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandMark className="h-6 w-6 text-orange-500" />
            <span className="font-bold text-slate-300">Chaturbo AI Agency Platform</span>
          </div>

          <p>© {new Date().getFullYear()} Chaturbo Inc. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
