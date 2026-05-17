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

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const oauthProcessed = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("Signing in...");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      const data = await apiRequest<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      setStatus("Login successful. Redirecting to dashboard...");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setStatus("");
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
    setStatus("Completing Google login...");

    const provider = state as SocialProvider;
    const redirectUri = getRedirectUri("/login");

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
        setStatus("Login successful. Redirecting to dashboard...");
        router.push("/dashboard");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Social login failed");
        setStatus("");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function startSocialLogin(provider: SocialProvider) {
    setError("");
    setStatus(provider === "google" ? "Redirecting to Google..." : "Redirecting...");
    try {
      const redirectUri = getRedirectUri("/login");
      window.location.href = buildOAuthUrl(provider, redirectUri);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social login is unavailable");
      setStatus("");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12 md:py-16">
      <form onSubmit={onSubmit} className="card w-full space-y-4 p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-sm text-slate-600">Access your owner portal and manage workflow drafts.</p>
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
        <p className="text-center text-xs text-slate-500">or use email login</p>
        <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border p-3" required />
        <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border p-3" required />
        {status ? <p className="text-sm text-slate-600">{status}</p> : null}
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
