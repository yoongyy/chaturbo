"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "../../components/AuthShell";
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
      eyebrow="Owner signup"
      title="Create your contractor portal login."
      description="Set up an account for your team so you can review leads, manage businesses, and keep missed-call recovery simple."
      bullets={[
        "One login for the owner team.",
        "Manage leads and businesses.",
        "Start with the Pro workflow."
      ]}
    >
      <div className="rounded-[30px] border border-orange-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">Create account</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Set up your portal access</h1>
        <p className="mt-2 text-sm text-slate-600">Create a dashboard login for your team.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" placeholder="Name" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm" required />
          <input name="password" type="password" placeholder="Password" minLength={8} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm" required />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-orange-600">
            Back to login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
