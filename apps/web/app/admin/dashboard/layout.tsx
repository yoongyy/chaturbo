"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
