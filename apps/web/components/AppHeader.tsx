"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearToken, getToken } from "../lib/api";

interface NavItem {
  href: string;
  label: string;
}

const publicNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/workflows", label: "Workflows" }
];

const authedNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/workflow-drafts", label: "Drafts" },
  { href: "/dashboard/workflows", label: "Published" },
  { href: "/workflows", label: "Marketplace" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getToken()));
    setMenuOpen(false);
    setReady(true);
  }, [pathname]);

  const nav = useMemo(() => (authed ? authedNav : publicNav), [authed]);

  function logout() {
    clearToken();
    setAuthed(false);
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">C</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">Chaturbo</p>
            <p className="text-[11px] text-slate-500">AI Workflow Monetization</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                isActive(pathname, item.href) ? "bg-ink text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!ready ? null : authed ? (
            <button onClick={logout} className="rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                Login
              </Link>
              <Link href="/register" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
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
          </div>

          <div className="mt-3 flex gap-2">
            {authed ? (
              <button onClick={logout} className="w-full rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white">
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full rounded-lg bg-ink px-3 py-2 text-center text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
