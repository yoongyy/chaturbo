"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "./BrandMark";

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
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 text-slate-100 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark inverse compact />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive(pathname, item.href) ? "bg-orange-500 text-slate-950 shadow-sm" : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/audit/alpha-roofing-dallas-audit" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/8">
            Example audit
          </Link>
          <Link href="/login" className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 hover:bg-orange-400">
            Log in
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-100 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(pathname, item.href) ? "bg-orange-500 text-slate-950" : "bg-white/5 text-slate-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Link href="/login" className="w-full rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-slate-950" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
