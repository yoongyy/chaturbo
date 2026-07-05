"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserRole } from "../lib/api";
import LogoutButton from "./LogoutButton";

const ownerItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/businesses", label: "Businesses" },
  { href: "/dashboard/leads", label: "Lead Inbox" },
  { href: "/dashboard/settings", label: "Help" }
];

const adminItems = [
  { href: "/admin/dashboard", label: "Admin Home" },
  { href: "/dashboard/businesses", label: "Businesses" },
  { href: "/dashboard/leads", label: "Lead Inbox" },
  { href: "/dashboard/audits", label: "Audits" },
  { href: "/dashboard/settings", label: "Settings" }
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function LeadRescueSidebar() {
  const pathname = usePathname();
  const role = getUserRole();
  const items = role === "admin" ? adminItems : ownerItems;
  const title = role === "admin" ? "Admin Portal" : "Chaturbo Lead Rescue";
  const subtitle = role === "admin" ? "Internal team only" : "Recover missed calls before competitors do";
  const helperTitle = role === "admin" ? "Admin tools" : "Simple setup";
  const helperText =
    role === "admin"
      ? "Use this side only for internal setup, audits, and operational management. Keep owners out of these tools."
      : "Add the business, connect the phone number, and start catching missed calls. Technical setup should stay out of the owner's way.";

  return (
    <aside className="flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-950/95 p-5 text-slate-100 shadow-[0_20px_80px_rgba(2,6,23,0.5)]">
      <div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/90 text-sm font-bold text-white">
          CR
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold tracking-[0.18em] text-white">{title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{subtitle}</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive(pathname, item.href)
                ? "bg-white text-slate-950"
                : "text-slate-300 hover:bg-white/8 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">{helperTitle}</p>
          <p className="mt-2">{helperText}</p>
        </div>
        <LogoutButton className="w-full rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12" />
      </div>
    </aside>
  );
}
