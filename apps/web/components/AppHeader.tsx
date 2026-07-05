"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandMark from "./BrandMark";
import LogoutButton from "./LogoutButton";
import { AppLinkButton } from "./AppButton";
import { getUserRole } from "../lib/api";

interface NavItem {
  href: string;
  label: string;
}

const publicNavItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/audit/alpha-roofing-dallas-audit", label: "Example Audit" }
];

const ownerNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/businesses", label: "Businesses" },
  { href: "/dashboard/leads", label: "Lead Inbox" },
  { href: "/dashboard/help", label: "Help" }
];

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Admin Home" },
  { href: "/admin/audits", label: "Audits" },
  { href: "/admin/settings", label: "Settings" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppHeader() {
  const pathname = usePathname();
  const role = getUserRole();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  const isAppRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const navItems = isAppRoute ? (role === "admin" ? adminNavItems : ownerNavItems) : publicNavItems;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.94)_100%)] text-slate-100 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl">
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
          {isAppRoute ? (
            <LogoutButton className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/12" />
          ) : (
            <>
              <AppLinkButton href="/login" variant="ghost" size="sm">
                Log in
              </AppLinkButton>
              <AppLinkButton href="/register" variant="primary" size="sm">
                Create account
              </AppLinkButton>
            </>
          )}
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
            {isAppRoute ? (
              <LogoutButton className="w-full rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-center text-sm font-semibold text-white" />
            ) : (
              <>
                <Link href="/login" className="w-full rounded-lg border border-white/10 px-3 py-2 text-center text-sm font-semibold text-slate-100" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="w-full rounded-lg bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-slate-950" onClick={() => setMenuOpen(false)}>
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
