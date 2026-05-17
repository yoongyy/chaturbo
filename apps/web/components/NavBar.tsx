"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/workflow-drafts", label: "Workflow Drafts" },
  { href: "/dashboard/workflows", label: "Published" },
  { href: "/workflows", label: "Marketplace Preview" }
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 ${
                pathname.startsWith(link.href) ? "bg-ink text-white" : "hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
      </div>
    </div>
  );
}
