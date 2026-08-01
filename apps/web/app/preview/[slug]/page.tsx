"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfessionalMotoristLandingPage({ params }: { params: { slug: string } }) {
  const [claimed, setClaimed] = useState(false);
  const [selectedService, setSelectedService] = useState("diagnostic");
  const [vehicleMake, setVehicleMake] = useState("Ford");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00 AM");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Format business name from slug
  const formattedName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const SERVICES = [
    {
      id: "diagnostic",
      title: "Computerized Digital Diagnostics",
      icon: "💻",
      price: "$89 - $149",
      time: "45 Mins",
      desc: "Full dealer-level ECU scan, error code troubleshooting, and transparent digital inspection report sent to your phone."
    },
    {
      id: "brakes",
      title: "Precision Brake & Rotor Service",
      icon: "🛑",
      price: "$199 - $349",
      time: "90 Mins",
      desc: "Premium ceramic brake pad replacement, rotor resurfacing, line bleed, and 24-month safety guarantee."
    },
    {
      id: "engine",
      title: "Engine Performance & Timing",
      icon: "⚙️",
      price: "$299 - $799",
      time: "2-4 Hours",
      desc: "Fuel injection flush, spark plug replacement, timing belt service, and horsepower restoration."
    },
    {
      id: "hvac",
      title: "A/C & Climate Control Overhaul",
      icon: "❄️",
      price: "$129 - $299",
      time: "60 Mins",
      desc: "Freon R134a/R1234yf recharge, leak detection dye test, compressor diagnostics, and cabin air sanitization."
    },
    {
      id: "transmission",
      title: "Transmission & Drivetrain Service",
      icon: "🔄",
      price: "$249 - $599",
      time: "2 Hours",
      desc: "Synthetic fluid exchange, pan gasket replacement, filter clean, and road test evaluation."
    },
    {
      id: "maintenance",
      title: "Full Synthetic Oil & Filter Package",
      icon: "🛢️",
      price: "$69 - $99",
      time: "30 Mins",
      desc: "Up to 5 qts Mobil1 synthetic oil, OEM filter, tire pressure adjust, and 30-point safety check."
    }
  ];

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBookingSuccess(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* ─── TOP AGENCY BUY BANNER ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-orange-500/40 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="font-mono font-black text-orange-400 uppercase tracking-widest">Pre-Built Site Demo</span>
            <span className="hidden text-slate-300 sm:inline">
              | Built for <strong>{formattedName}</strong> (831 Google Reviews)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              <strong className="text-white">$499</strong> Setup + Domain Included
            </span>
            <button
              onClick={() => setClaimed(true)}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-amber-400 transition-all hover:scale-105"
            >
              {claimed ? "✅ Claiming Site..." : "Claim This Website ($499)"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── CLAIM MODAL ───────────────────────────────────────────────────────── */}
      {claimed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-orange-500/40 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-black text-white">Claim {formattedName} Website</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              We attach your domain, hook up your direct phone line for 3-second automated missed-call text-back, and publish it live within 24 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! Our onboarding team will call your direct line to finalize domain attachment.");
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

      {/* ─── HEADER & NAVIGATION ────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-xl shadow-lg shadow-orange-500/20">
              🏎️
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">{formattedName}</span>
              <span className="block text-[11px] font-mono text-slate-400">Dallas, TX · Master Automotive Care</span>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Services & Pricing
            </a>
            <a href="#estimator" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Instant Estimator
            </a>
            <a href="#reviews" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Google Reviews (4.9 ★)
            </a>
            <a href="#booking" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">
              Online Booking
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:2145550199"
              className="hidden items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/20 sm:flex"
            >
              <span>📞</span> (214) 555-0199
            </a>
            <a
              href="#booking"
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition-all hover:scale-105"
            >
              Book Service
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION WITH IMAGE OVERLAY ────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Image with Dark Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/auto_repair_hero.jpg"
            alt="Motor City Auto Repair Workshop"
            fill
            priority
            className="object-cover opacity-25 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Column: Hero Headline & Badges */}
            <div className="lg:col-span-7 text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-400 backdrop-blur-md">
                <span>⭐ 4.9 Star Rating on Google</span>
                <span>•</span>
                <span>831 Verified Reviews</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Dealer-Quality Repair. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                  Honest Local Prices.
                </span>
              </h1>

              <p className="mt-6 text-base text-slate-300 sm:text-lg leading-relaxed max-w-2xl">
                Dallas’s most trusted motor vehicle service center. Certified master mechanics, 24-month warranties on all repairs, and 30-second online scheduling.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking"
                  className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 transition-all hover:scale-105"
                >
                  ⚡ Book Appointment Online
                </a>
                <a
                  href="tel:2145550199"
                  className="rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-sm font-bold text-white hover:bg-slate-800 transition-all backdrop-blur-md"
                >
                  📞 Call Hotline: (214) 555-0199
                </a>
              </div>

              {/* Key Highlights */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-8">
                <div>
                  <div className="text-xl font-black text-white">ASE Certified</div>
                  <div className="text-[11px] text-slate-400">Master Technicians</div>
                </div>
                <div>
                  <div className="text-xl font-black text-orange-400">24-Month</div>
                  <div className="text-[11px] text-slate-400">Parts & Labor Warranty</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">Same-Day</div>
                  <div className="text-[11px] text-slate-400">Service Turnaround</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Service Estimator Form */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-orange-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-black text-white">Instant Service Estimator</h3>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-bold text-green-400 border border-green-500/30">
                    Live Diagnostics
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Select Vehicle Make</label>
                    <select
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Ford">Ford / Lincoln</option>
                      <option value="Chevrolet">Chevrolet / GMC / Cadillac</option>
                      <option value="Toyota">Toyota / Lexus</option>
                      <option value="Honda">Honda / Acura</option>
                      <option value="BMW">BMW / Mercedes / Audi</option>
                      <option value="RAM">RAM / Dodge / Jeep</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Select Service Needed</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Estimate Card */}
                  {(() => {
                    const active = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
                    return (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Estimated Cost:</span>
                          <span className="text-base font-black text-orange-400">{active.price}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">Estimated Duration:</span>
                          <span className="text-xs font-mono text-white">{active.time}</span>
                        </div>
                        <p className="mt-3 text-[11px] leading-relaxed text-slate-400">{active.desc}</p>
                      </div>
                    );
                  })()}

                  <a
                    href="#booking"
                    className="block w-full text-center rounded-xl bg-orange-500 py-3.5 text-xs font-black text-slate-950 hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Lock In This Price & Schedule →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID SECTION ─────────────────────────────────────────────── */}
      <section id="services" className="border-t border-slate-900 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white sm:text-5xl">Our Specialty Motor Services</h2>
            <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
              Every service includes a complimentary 30-point digital inspection and written warranty.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className="group rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 hover:border-orange-500/50 hover:bg-slate-900 transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl group-hover:bg-orange-500 group-hover:text-slate-950 transition-all">
                  {s.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{s.desc}</p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs">
                  <span className="font-mono font-bold text-orange-400">{s.price}</span>
                  <span className="text-slate-500 font-mono">⏱️ {s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GOOGLE REVIEWS SHOWCASE ────────────────────────────────────────────── */}
      <section id="reviews" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 mb-3">
                ⭐ Google Verified Reviews
              </div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">What Dallas Drivers Say About Us</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">4.9 / 5.0</div>
              <div className="text-xs text-slate-400">Based on 831 Google Maps Reviews</div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs leading-relaxed text-slate-300">
                "Brought my Ford F-150 in after another shop quoted me $2,400 for a transmission issue. Motor City diagnosed a faulty sensor in 45 minutes and fixed it for $280! Honest mechanics exist."
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">
                  RM
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Robert M.</div>
                  <div className="text-[10px] text-slate-500">Dallas, TX · Google Verified</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs leading-relaxed text-slate-300">
                "Fastest AC recharge in town. Booked online at 8 AM, dropped off my Honda Civic at 9 AM, picked it up freezing cold by lunch. Super easy online scheduling."
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">
                  SK
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sarah K.</div>
                  <div className="text-[10px] text-slate-500">Dallas, TX · Google Verified</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs leading-relaxed text-slate-300">
                "They sent a complete digital inspection report with photos to my cell phone before starting any work. No surprise charges. Best auto shop in North Texas!"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 text-xs font-bold text-orange-400">
                  DJ
                </div>
                <div>
                  <div className="text-xs font-bold text-white">David J.</div>
                  <div className="text-[10px] text-slate-500">Dallas, TX · Google Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ONLINE BOOKING SECTION ────────────────────────────────────────────── */}
      <section id="booking" className="border-t border-slate-900 bg-slate-900/30 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="rounded-3xl border border-orange-500/30 bg-slate-900 p-8 sm:p-12 shadow-2xl relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 mb-3">
                🟢 24/7 Live Scheduling System
              </div>
              <h2 className="text-2xl font-black text-white sm:text-4xl">Book Your Service Online</h2>
              <p className="mt-2 text-xs text-slate-400">Instant confirmation sent to your phone line via SMS.</p>
            </div>

            {bookingSuccess ? (
              <div className="mt-8 rounded-2xl bg-green-500/10 border border-green-500/30 p-8 text-center text-green-300">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-black text-xl">Appointment Request Received!</h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  We have reserved your slot for <strong>{customerName}</strong> on <strong>{bookingDate || "Tomorrow"}</strong> at <strong>{bookingTime}</strong>. A text confirmation has been dispatched to <strong>{customerPhone}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Your Name</label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Cell Phone (For SMS Confirmation)</label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(214) 555-0199"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Preferred Date</label>
                    <input
                      required
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-400 uppercase">Preferred Time</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-xs font-black text-slate-950 hover:from-orange-400 hover:to-amber-400 transition-all shadow-xl shadow-orange-500/20 mt-4"
                >
                  Confirm & Schedule Online Appointment →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 py-12 text-center text-xs text-slate-600">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="font-bold text-slate-300 text-sm">{formattedName}</div>
            <div className="text-slate-500 text-xs">1234 Commerce St, Dallas, TX 75201 · (214) 555-0199</div>
          </div>

          <div className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {formattedName}. All rights reserved.
            <div className="text-[10px] text-slate-700">Pre-built preview site powered by Chaturbo Agency Engine.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
