"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "../../components/BrandMark";

export default function AgencyPage() {
  // Calculator State
  const [clients, setClients] = useState(10);
  const [adSpend, setAdSpend] = useState(2500);
  const [missedRate, setMissedRate] = useState(30); // in %
  const [jobValue, setJobValue] = useState(1200);

  // Form State
  const [email, setEmail] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calculations
  const averageLeadCost = 150; // typical cost per lead for LSA/Google Ads in trades
  const totalLeadsPerMonth = (adSpend / averageLeadCost) * clients;
  const missedLeads = totalLeadsPerMonth * (missedRate / 100);
  
  // Rescue rates: typically Chaturbo recovers 45% of missed call hang-ups
  const rescuedLeads = Math.round(missedLeads * 0.45);
  
  // Assuming a conservative 15% booking/closing rate on rescued SMS leads
  const bookedJobs = Math.round(rescuedLeads * 0.15);
  const recoveredRevenue = bookedJobs * jobValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agencyName) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/marketing/agency/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencyName, email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoNumber = process.env.NEXT_PUBLIC_TWILIO_DEMO_NUMBER || "+1 (806) 696-4818";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark className="w-8 h-8 text-teal-400" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Chaturbo
            </span>
            <span className="bg-slate-900 text-teal-400 border border-teal-900/40 text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider">
              White-label
            </span>
          </Link>
          <Link 
            href="#partner-form"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Become a Partner
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.12),rgba(0,0,0,0))] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6">
            Scale Your Agency's Monthly Recurring Revenue
            <span className="block mt-3 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              With Whitelabel Lead Rescue
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop losing your contractor clients because they miss incoming calls from the expensive Google Ads you run. 
            Resell Chaturbo under your own brand to save those leads and boost campaign ROI instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#calculator"
              className="bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 px-6 py-3.5 rounded-xl font-semibold transition"
            >
              Calculate Saved ROI
            </Link>
            <Link 
              href="#demo-section"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-teal-500/10"
            >
              Test Live Demo Number
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-section" className="py-16 border-y border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold bg-teal-950/60 px-3.5 py-1.5 rounded-full border border-teal-900/30">
            Interactive Sandbox
          </span>
          <h2 className="text-3xl font-bold mt-6 mb-4">Test the Missed Call Text-back Instantly</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Experience the system exactly like your clients' customers would. Call our demo line, let it ring twice, and hang up.
          </p>

          <div className="bg-slate-900/60 border border-slate-850 p-8 rounded-2xl max-w-md mx-auto shadow-2xl backdrop-blur relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block mb-2">
              Call this demo line
            </span>
            <a 
              href={`tel:${demoNumber.replace(/[^0-9+]/g, "")}`}
              className="text-3xl sm:text-4xl font-extrabold text-teal-400 hover:text-teal-300 block mb-6 transition"
            >
              {demoNumber}
            </a>
            <div className="flex flex-col gap-4 text-left border-t border-slate-850 pt-6 text-sm text-slate-400">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-xs text-teal-400 font-bold">1</span>
                <p>Call the number above from your mobile phone.</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-xs text-teal-400 font-bold">2</span>
                <p>Let it ring twice, then hang up (to simulate a busy line).</p>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center text-xs text-teal-400 font-bold">3</span>
                <p>Wait 3 seconds and check your phone for the automated lead-qualification text message!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="calculator" className="py-20 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">ROI Calculator</span>
          <h2 className="text-4xl font-bold mt-4 mb-6 leading-tight">
            See How Much Revenue You Are Letting Leak
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            When you run ads for home services, up to 30% of incoming calls go to voicemail because contractors are on the roof, under a sink, or in meetings. Homeowners don't leave voicemails — they call the next ad on Google.
          </p>

          <div className="space-y-6">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Contractor Clients Managed</span>
                <span className="text-teal-400">{clients} Clients</span>
              </div>
              <input 
                type="range" min="1" max="100" value={clients} 
                onChange={(e) => setClients(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Average Monthly Ad Spend / Client</span>
                <span className="text-teal-400">${adSpend.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="500" max="10000" step="500" value={adSpend} 
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Estimated Missed Call Rate</span>
                <span className="text-teal-400">{missedRate}% Missed Calls</span>
              </div>
              <input 
                type="range" min="10" max="60" value={missedRate} 
                onChange={(e) => setMissedRate(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>

            {/* Slider 4 */}
            <div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Average Contractor Job Value</span>
                <span className="text-teal-400">${jobValue.toLocaleString()}</span>
              </div>
              <input 
                type="range" min="300" max="5000" step="100" value={jobValue} 
                onChange={(e) => setJobValue(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-slate-900 border border-slate-850 p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-8">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-4">Estimated Monthly Savings</span>
            <div className="grid grid-cols-2 gap-6 border-b border-slate-850 pb-6 mb-6">
              <div>
                <span className="text-slate-400 text-xs block mb-1">Total Missed Leads</span>
                <span className="text-2xl font-bold text-slate-100">{Math.round(missedLeads)} / mo</span>
              </div>
              <div>
                <span className="text-slate-400 text-xs block mb-1">Rescued Leads (45%)</span>
                <span className="text-2xl font-bold text-teal-400">+{rescuedLeads} / mo</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Rescued Jobs booked (15% rate)</span>
                <span className="font-semibold text-slate-100">{bookedJobs} Jobs</span>
              </div>
              <div className="flex justify-between border-t border-slate-850/60 pt-4">
                <span className="text-slate-400 text-sm">Additional Client Revenue</span>
                <span className="font-bold text-emerald-400 text-lg">${recoveredRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-850/80">
            <h4 className="text-sm font-bold mb-2">💡 Why this scales your agency:</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rescuing these calls proves your ad campaigns have higher ROI. You can white-label Chaturbo, charge your clients a $199–$499/mo premium SaaS fee, and secure long-term client retention.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">Reseller Benefits</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-12">Built Specifically for Marketing Agencies</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-850/80 p-6 rounded-xl text-left hover:border-slate-800 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold mb-4">🏷️</div>
              <h3 className="text-lg font-bold mb-2">100% White-Label Branding</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Rebrand Chaturbo with your own domain, agency logo, color scheme, and company name. Your clients never see Chaturbo.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-850/80 p-6 rounded-xl text-left hover:border-slate-800 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold mb-4">💬</div>
              <h3 className="text-lg font-bold mb-2">Instant SMS Setup</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Buy and provision local Twilio numbers for your clients in seconds. Configure automated text-back questions dynamically.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-850/80 p-6 rounded-xl text-left hover:border-slate-800 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold mb-4">📈</div>
              <h3 className="text-lg font-bold mb-2">Google Ads & LSA Integration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect leads and conversion data back to Google Analytics or Zapier to showcase higher booking rates on your agency reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership signup Form */}
      <section id="partner-form" className="py-20 px-4 max-w-md mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Apply for Agency White-label</h2>
        <p className="text-slate-400 mb-8 text-sm">
          Get a free Twilio demo number configured for your agency to pitch to clients.
        </p>

        {submitted ? (
          <div className="bg-slate-900 border border-teal-900/30 p-8 rounded-2xl text-center">
            <span className="text-4xl block mb-4">🎉</span>
            <h3 className="text-lg font-bold text-teal-400 mb-2">Application Received!</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Thank you! We will reach out to you at <strong>{email}</strong> in under 24 hours to set up your white-label dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Agency Name
              </label>
              <input 
                type="text" required placeholder="Apex Digital Group"
                value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-400 text-sm transition disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Work Email Address
              </label>
              <input 
                type="email" required placeholder="name@agency.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-400 text-sm transition disabled:opacity-50"
              />
            </div>
            
            {errorMsg && (
              <p className="text-red-400 text-xs font-medium bg-red-950/40 border border-red-900/30 px-3.5 py-2 rounded-lg">
                ⚠️ {errorMsg}
              </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-3.5 rounded-lg text-sm transition shadow-lg shadow-teal-500/10 disabled:opacity-55 flex items-center justify-center gap-2"
            >
              {loading ? "Submitting..." : "Get My White-Label Account"}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Chaturbo. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
