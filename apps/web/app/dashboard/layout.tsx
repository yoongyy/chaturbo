"use client";

import AuthGuard from "../../components/AuthGuard";
import NavBar from "../../components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <NavBar />
        {children}
      </div>
    </AuthGuard>
  );
}
