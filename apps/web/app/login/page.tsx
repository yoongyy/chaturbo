"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest, setToken } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const data = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
        <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border p-3" required />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-xl bg-mint p-3 text-white">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="text-sm text-slate-600">
          Need an account? <Link href="/register" className="text-mint">Register</Link>
        </p>
      </form>
    </main>
  );
}
