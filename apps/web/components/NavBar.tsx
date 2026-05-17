"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "../lib/api";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/workflow-drafts", label: "Workflow Drafts" },
  { href: "/dashboard/workflows", label: "Published" },
  { href: "/workflows", label: "Marketplace Preview" }
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-xl font-semibold text-ink">
          Chaturbo
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-700">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 ${pathname.startsWith(link.href) ? "bg-mint text-white" : "hover:bg-slate-100"}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              clearToken();
              router.push("/login");
            }}
            className="rounded-full bg-coral px-3 py-1.5 text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
