"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function AdminAuditsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
