"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/audit/alpha-roofing-dallas-audit", label: "Example Audit" },
  { href: "/login", label: "Login" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/audit") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-2 text-slate-950 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            ⚡
          </span>
          <div className="leading-tight">
            <p className="flex items-center gap-1.5 font-display text-sm font-black uppercase tracking-tighter text-slate-900">
              CHATURBO
              <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-normal text-orange-400">
                AI
              </span>
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Lead Rescue Engine</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive(pathname, item.href) ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/audit/alpha-roofing-dallas-audit" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            Example audit
          </Link>
          <Link href="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:bg-black">
            Log in
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(pathname, item.href) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Link href="/login" className="w-full rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
