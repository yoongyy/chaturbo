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
  { href: "/demo", label: "Demo" },
  { href: "/apply", label: "Apply" },
  { href: "/contact", label: "Contact" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white shadow-lg shadow-ink/15">
            C
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-ink">Chaturbo</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">AI agents for SMEs</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                isActive(pathname, item.href) ? "bg-ink text-white shadow-sm" : "text-slate-700 hover:bg-black/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard" className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-slate-700">
            Portal
          </Link>
          <Link href="/apply" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/15">
            Free Setup
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-slate-700 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-black/5 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(pathname, item.href) ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              Portal
            </Link>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href="/apply"
              className="w-full rounded-lg bg-ink px-3 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Free Setup
            </Link>
            <Link
              href="/contact"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-center text-sm font-semibold text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
