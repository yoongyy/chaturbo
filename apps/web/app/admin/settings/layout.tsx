"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
