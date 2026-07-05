"use client";

import BrandMark from "./BrandMark";

export default function AppFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-900 bg-slate-950 py-16 text-slate-200">
      <div className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <BrandMark inverse compact />
            <p className="max-w-sm text-xs leading-relaxed text-slate-400 sm:text-sm">
              The high-converting, lightning-fast missed call lead rescue engine designed exclusively for US trade contractors. Don't let marketing dollars slip to local rivals.
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm md:col-span-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">Territories We License</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <span>🏠 Roofing Pros</span>
              <span>❄️ HVAC Technicians</span>
              <span>💧 Plumbers</span>
              <span>⚡ Electricians</span>
              <span>🛠️ Solar Installers</span>
              <span>🏗️ General Contractors</span>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">Contact Chaturbo</h4>
            <p className="text-slate-400">
              Questions? Speak to an optimization expert:
              <br />
              <a href="mailto:hello@chaturbo.com" className="font-mono font-bold text-white transition-colors hover:text-orange-500">
                hello@chaturbo.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-900 pt-6 text-center text-[11px] uppercase tracking-widest text-slate-600">
        © {new Date().getFullYear()} Chaturbo Lead Rescue
      </div>
    </footer>
  );
}
