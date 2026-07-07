"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "../../components/AuthShell";
import { AppButton, AppLinkButton } from "../../components/AppButton";
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
      eyebrow="Portal login"
      title="Log in to the contractor portal."
      description="Use this account to manage businesses, review missed-call leads, and keep the contractor workflow simple."
      bullets={[
        "Keep the phone workflow simple.",
        "Review new missed-call leads.",
        "No technical setup screens."
      ]}
    >
      <form onSubmit={onSubmit} className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.96)_0%,_rgba(7,12,20,0.96)_100%)] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Sign in</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Portal access</h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">This login is for your roofing, HVAC, plumbing, or service-business team.</p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Email</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">Password</span>
            <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400" />
          </label>
        </div>
        {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        <AppButton disabled={loading} className="mt-6 w-full" variant="primary">
          {loading ? "Signing in..." : "Login"}
        </AppButton>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          New here?{" "}
          <Link href="/register" className="font-semibold text-orange-400">
            Create an account
          </Link>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          <Link href="/" className="font-semibold text-orange-400">
            Back home
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
