"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest, setSession } from "../../lib/api";

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
      const data = await apiRequest<{ token: string; user: { email: string; name: string; role: "owner" } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          password: String(form.get("password") || "")
        })
      });
      setSession({
        token: data.token,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#08111a_0%,_#f6f1e7_48%,_#f6f1e7_100%)] px-4 py-8">
      <div className="mx-auto max-w-md rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-semibold text-ink">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Create a dashboard login for your team.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" placeholder="Name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" required />
          <input name="password" type="password" placeholder="Password" minLength={8} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" required />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          <Link href="/login" className="font-semibold text-mint">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
