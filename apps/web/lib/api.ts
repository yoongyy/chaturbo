import { resolveApiBaseUrl } from "./apiBaseUrl";

const API_URL = resolveApiBaseUrl();
const REQUEST_TIMEOUT_MS = 15000;

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("chaturbo_token") || "";
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("chaturbo_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("chaturbo_token");
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const apiUrl = resolveApiBaseUrl();
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
    response = await fetch(`${apiUrl}${path}`, {
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
