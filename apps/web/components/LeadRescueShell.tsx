import type { PropsWithChildren } from "react";
import LeadRescueSidebar from "./LeadRescueSidebar";
import LogoutButton from "./LogoutButton";

export default function LeadRescueShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_30%),linear-gradient(180deg,_#08111a_0%,_#0d1724_42%,_#f6f1e7_42%,_#f6f1e7_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <div className="hidden w-[290px] shrink-0 lg:block">
          <div className="sticky top-4 h-[calc(100vh-2rem)]">
            <LeadRescueSidebar />
          </div>
        </div>

        <main className="min-w-0 flex-1 pb-10 pt-1">
          <div className="mb-4 rounded-[28px] border border-white/10 bg-slate-950 px-5 py-4 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] lg:hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Chaturbo Lead Rescue</p>
                <p className="mt-1 text-lg font-semibold">Simple missed-call follow-up</p>
              </div>
              <LogoutButton className="rounded-2xl border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white" />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
