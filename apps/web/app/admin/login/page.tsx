"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "../../../components/AuthShell";
import { apiRequest, normalizeAppRole, setSession } from "../../../lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Signing in...");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const data = await apiRequest<{ token: string; user: { email: string; name: string; role: "member" | "owner" | "admin" } }>("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const role = normalizeAppRole(data.user.role);
      if (role !== "admin") {
        throw new Error("Use the owner portal for customer accounts.");
      }
      setSession({
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role
      });
      setStatus("Signed in. Redirecting...");
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin login failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Internal admin"
      title="Log in to manage onboarding and internal operations."
      description="This portal is only for your internal team. Use it for audits, setup, and platform controls that customers should never see."
      bullets={[
        "Keep customer workflows separate.",
        "Own audits and setup tasks.",
        "Use only for internal management."
      ]}
    >
      <form onSubmit={onSubmit} className="rounded-[30px] border border-orange-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Admin sign in</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">Internal portal access</h2>
        <p className="mt-2 text-sm text-slate-600">Use the internal admin account to manage the platform.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400" />
          </label>
        </div>
        {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? "Signing in..." : "Log in as admin"}
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Customer or owner login?{" "}
          <Link href="/login" className="font-semibold text-orange-600">
            Use the owner portal
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
