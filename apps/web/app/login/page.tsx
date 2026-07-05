"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "../../components/AuthShell";
import { apiRequest, normalizeAppRole, setSession } from "../../lib/api";

export default function LoginPage() {
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
      const data = await apiRequest<{ token: string; user: { email: string; name: string; role: "member" | "owner" | "admin" } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      const role = normalizeAppRole(data.user.role);
      if (role !== "owner") {
        throw new Error("This account belongs in the internal portal.");
      }
      setSession({
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role
      });
      setStatus("Signed in. Redirecting...");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Owner login"
      title="Log in to the contractor portal."
      description="Use this account to manage businesses, review missed-call leads, and keep the owner workflow simple."
      bullets={[
        "Keep the phone workflow simple.",
        "Review new missed-call leads.",
        "No technical setup screens."
      ]}
    >
      <form onSubmit={onSubmit} className="rounded-[30px] border border-orange-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Sign in</p>
        <h2 className="mt-3 text-2xl font-semibold text-ink">Owner portal access</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">This login is for the roofing, HVAC, plumbing, or service-business owner team.</p>
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
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-[#f6f1e7] px-4 py-3 text-sm text-slate-700">
          New here?{" "}
          <Link href="/register" className="font-semibold text-orange-600">
            Create an owner account
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          <Link href="/" className="font-semibold text-orange-600">
            Back home
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
