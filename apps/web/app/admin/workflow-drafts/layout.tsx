"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function AdminWorkflowDraftsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
