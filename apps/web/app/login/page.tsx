"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(29,122,107,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(233,106,65,0.12),_transparent_28%),linear-gradient(180deg,_#08111a_0%,_#f6f1e7_48%,_#f6f1e7_100%)] px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[34px] bg-slate-950 px-8 py-10 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)]">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chaturbo Lead Rescue</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Log in to the business owner portal</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Use the dashboard to manage businesses, review missed-call leads, and follow up with customers quickly.
          </p>
        </section>

        <form onSubmit={onSubmit} className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-semibold text-ink">Owner sign in</h2>
          <p className="mt-2 text-sm text-slate-500">This login is for the roofing, HVAC, plumbing, or service-business owner team.</p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input name="password" type="password" required className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-mint" />
            </label>
          </div>
          {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          <button disabled={loading} className="mt-6 w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
          <p className="mt-2 text-sm text-slate-500">
            <Link href="/" className="font-semibold text-mint">
              Back home
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
