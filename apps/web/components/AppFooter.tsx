"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppFooter() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/audit") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white text-slate-800">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_0.7fr_0.8fr] md:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-slate-900">Chaturbo Lead Rescue</p>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Missed-call recovery and AI lead qualification for US local service businesses.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
            Built to help contractors book more jobs
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-slate-900">Pages</p>
          <Link href="/" className="block text-slate-600 hover:text-slate-900">
            Home
          </Link>
          <Link href="/dashboard" className="block text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-slate-900">Contact</p>
            <a href="mailto:hello@chaturbo.com" className="block text-slate-600 hover:text-slate-900">
              hello@chaturbo.com
            </a>
            <p className="text-slate-600">Remote, US contractor market</p>
            <p className="text-slate-600">Demo line: Kenny</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Chaturbo Lead Rescue.
      </div>
    </footer>
  );
}
