"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { apiRequest, setToken } from "../../lib/api";
import {
  buildOAuthUrl,
  GOOGLE_CLIENT_ID,
  getRedirectUri,
  SocialProvider
} from "../../lib/socialOAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const oauthProcessed = useRef(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (!code || !state || oauthProcessed.current) {
      return;
    }

    if (state !== "google" && state !== "facebook") {
      return;
    }

    oauthProcessed.current = true;
    setLoading(true);
    setError("");

    const provider = state as SocialProvider;
    const redirectUri = getRedirectUri("/register");

    apiRequest<{ token: string }>("/auth/oauth/callback", {
      method: "POST",
      body: JSON.stringify({
        provider,
        code,
        redirectUri,
        clientId: provider === "google" ? GOOGLE_CLIENT_ID : undefined
      })
    })
      .then((data) => {
        setToken(data.token);
        router.push("/dashboard");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Social login failed");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function startSocialLogin(provider: SocialProvider) {
    setError("");
    try {
      const redirectUri = getRedirectUri("/register");
      window.location.href = buildOAuthUrl(provider, redirectUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social login is unavailable");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => startSocialLogin("google")}
            disabled={!GOOGLE_CLIENT_ID}
            className="rounded-xl border border-slate-300 p-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue with Google
          </button>
        </div>
        <p className="text-center text-xs text-slate-500">or create account with email</p>
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
