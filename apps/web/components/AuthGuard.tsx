"use client";

import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { AppRole, getSession } from "../lib/api";

function getRequiredRole(pathname: string): AppRole | null {
  if (pathname.startsWith("/admin")) {
    return "admin";
  }

  if (
    pathname.startsWith("/dashboard/audits") ||
    pathname.startsWith("/dashboard/settings") ||
    pathname.startsWith("/dashboard/workflows") ||
    pathname.startsWith("/dashboard/workflow-drafts")
  ) {
    return "admin";
  }

  if (pathname.startsWith("/dashboard")) {
    return "owner";
  }

  return null;
}

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    const requiredRole = getRequiredRole(pathname);

    if (!session?.token || !session.role) {
      router.replace(requiredRole === "admin" ? "/admin/login" : "/login");
      return;
    }

    const roleMismatch =
      requiredRole === "admin"
        ? session.role !== "admin"
        : requiredRole === "owner"
          ? session.role !== "owner" && session.role !== "admin"
          : false;

    if (roleMismatch) {
      router.replace(session.role === "admin" ? "/admin/dashboard" : "/dashboard");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return <div className="p-6 text-slate-600">Checking authentication...</div>;
  return <>{children}</>;
}
