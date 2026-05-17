"use client";

import AuthGuard from "../../components/AuthGuard";
import NavBar from "../../components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </AuthGuard>
  );
}
