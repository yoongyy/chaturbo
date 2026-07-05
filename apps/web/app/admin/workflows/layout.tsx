"use client";

import AuthGuard from "../../../components/AuthGuard";

export default function AdminWorkflowsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
