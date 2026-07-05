"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandMark from "./BrandMark";
import { getUserRole } from "../lib/api";
import LogoutButton from "./LogoutButton";

export default function AppFooter() {
  const pathname = usePathname();
  const role = getUserRole();

  if (pathname === "/") {
    return null;
  }

  const isAppRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  return (
    <footer className="mt-12 border-t border-white/10 bg-[linear-gradient(180deg,_rgba(7,12,20,0.98)_0%,_rgba(2,6,23,0.98)_100%)] text-slate-200">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_0.7fr_0.8fr] md:px-6">
        <div>
          <BrandMark inverse compact />
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            The high-converting missed call lead rescue engine for US trade contractors.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-slate-950">
            Built to help contractors book more jobs
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-white">Pages</p>
          {isAppRoute ? (
            <>
              <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="block text-slate-400 hover:text-white">
                Dashboard
              </Link>
              <Link href="/dashboard/businesses" className="block text-slate-400 hover:text-white">
                Businesses
              </Link>
              <Link href="/dashboard/leads" className="block text-slate-400 hover:text-white">
                Lead inbox
              </Link>
              <Link href="/dashboard/help" className="block text-slate-400 hover:text-white">
                Help
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="block text-slate-400 hover:text-white">
                Home
              </Link>
              <Link href="/pricing" className="block text-slate-400 hover:text-white">
                Pricing
              </Link>
              <Link href="/audit/alpha-roofing-dallas-audit" className="block text-slate-400 hover:text-white">
                Example audit
              </Link>
              <Link href="/login" className="block text-slate-400 hover:text-white">
                Login
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-white">Contact</p>
            <a href="mailto:hello@chaturbo.com" className="block text-slate-400 hover:text-white">
              hello@chaturbo.com
            </a>
            <p className="text-slate-400">Remote, US contractor market</p>
            <p className="text-slate-400">Missed-call demo and setup help</p>
          </div>

          {isAppRoute ? (
            <div className="space-y-2">
              <p className="font-semibold text-white">Account</p>
              <LogoutButton className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/12" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Chaturbo Lead Rescue.
      </div>
    </footer>
  );
}
