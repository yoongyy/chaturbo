function normalizeBaseUrl(value: string): string {
  return value.replace(/\/$/, "");
}

function getConfiguredApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.API_URL?.trim() || "";
  return configured ? normalizeBaseUrl(configured) : "";
}

function requestHasBody(method: string): boolean {
  return method !== "GET" && method !== "HEAD";
}

function isLoopbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function getExternalApiBaseUrl(request: Request): string | null {
  const configured = getConfiguredApiBaseUrl();
  if (!configured) {
    return null;
  }

  const requestOrigin = new URL(request.url).origin;

  try {
    const configuredUrl = new URL(configured);
    const requestUrl = new URL(requestOrigin);

    if (configuredUrl.origin === requestOrigin) {
      return null;
    }

    if (isLoopbackHost(configuredUrl.hostname) && !isLoopbackHost(requestUrl.hostname)) {
      return null;
    }
  } catch {
    return null;
  }

  return configured;
}

export async function proxyToExternalApi(request: Request, path: string): Promise<Response | null> {
  const baseUrl = getExternalApiBaseUrl(request);
  if (!baseUrl) {
    return null;
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
    redirect: "manual"
  };

  if (requestHasBody(request.method)) {
    init.body = await request.text();
  }

  return fetch(`${baseUrl}${path}`, init);
}
