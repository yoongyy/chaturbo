import { resolveApiBaseUrl } from "./apiBaseUrl";

const API_URL = resolveApiBaseUrl();
const REQUEST_TIMEOUT_MS = 15000;
const TOKEN_STORAGE_KEY = "chaturbo_token";
const SESSION_STORAGE_KEY = "chaturbo_session";

export type AppRole = "owner" | "admin";

export type AuthSession = {
  token: string;
  role: AppRole;
  email: string;
  name: string;
};

function getHostedAppRequestPath(path: string): string | null {
  if (path.startsWith("/api/")) {
    return path;
  }

  if (path.startsWith("/auth/")) {
    return `/api${path}`;
  }

  return null;
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    if (!parsed.token || !parsed.role || !parsed.email || !parsed.name) {
      return null;
    }
    return parsed as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function getUserRole(): AppRole | "" {
  return getSession()?.role || "";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const apiUrl = resolveApiBaseUrl();
  const isBrowser = typeof window !== "undefined";
  const isLocalHost = isBrowser && ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const hostedAppPath = isBrowser && !isLocalHost ? getHostedAppRequestPath(path) : null;
  const requestPath = hostedAppPath || path;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${hostedAppPath ? "" : apiUrl}${requestPath}`, {
      ...options,
      headers,
      cache: "no-store",
      signal: controller.signal
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw new Error("Network error. Check your connection and API URL.");
  } finally {
    clearTimeout(timeout);
  }

  const text = await response.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }
  }

  if (!response.ok) {
    const payload = data as { error?: string };
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return (data as T) ?? ({} as T);
}

export { API_URL };
