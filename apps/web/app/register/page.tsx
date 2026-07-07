"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "../../components/AuthShell";
import { AppButton } from "../../components/AppButton";
import { apiRequest, normalizeAppRole, setSession } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const data = await apiRequest<{ token: string; user: { email: string; name: string; role: "member" | "owner" | "admin" } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          password: String(form.get("password") || "")
        })
      });
      const role = normalizeAppRole(data.user.role);
      if (role !== "owner") {
        throw new Error("Unexpected account role returned during registration.");
      }
      setSession({
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Portal signup"
      title="Create your contractor portal login."
      description="Set up an account for your team so you can review leads, manage businesses, and keep missed-call recovery simple."
      bullets={[
        "One login for your business.",
        "Manage leads and businesses.",
        "Start with the Pro workflow."
      ]}
    >
      <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,_rgba(15,23,42,0.96)_0%,_rgba(7,12,20,0.96)_100%)] p-8 shadow-[0_24px_80px_rgba(2,6,23,0.35)]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Set up your portal access</h1>
        <p className="mt-2 text-sm text-slate-300">Create a dashboard login for your team.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" placeholder="Name" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500" required />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500" required />
          <input name="password" type="password" placeholder="Password" minLength={8} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500" required />
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <AppButton disabled={loading} className="w-full" variant="primary">
            {loading ? "Creating..." : "Create account"}
          </AppButton>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          <Link href="/login" className="font-semibold text-orange-400">
            Back to login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
