"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest, setToken } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const name = String(form.get("name") || "");
    const password = String(form.get("password") || "");

    try {
      const data = await apiRequest<{ token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, name, password })
      });
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input name="name" placeholder="Name" className="w-full rounded-xl border p-3" required />
        <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
        <input
          name="password"
          placeholder="Password"
          type="password"
          minLength={8}
          className="w-full rounded-xl border p-3"
          required
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-xl bg-mint p-3 text-white">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="text-sm text-slate-600">
          Have an account? <Link href="/login" className="text-mint">Login</Link>
        </p>
      </form>
    </main>
  );
}
