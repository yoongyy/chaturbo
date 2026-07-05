const LOCAL_API_URL = "http://localhost:4000";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/$/, "");
}

export function resolveApiBaseUrl(requestOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return normalizeBaseUrl(configured);
  }

  if (requestOrigin) {
    return normalizeBaseUrl(requestOrigin);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname, host } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return LOCAL_API_URL;
    }
    return normalizeBaseUrl(`${protocol}//${host}`);
  }

  return LOCAL_API_URL;
}
