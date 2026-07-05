import { createHmac, randomBytes } from "crypto";

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function signSegment(segment: string, secret: string): string {
  return createHmac("sha256", secret).update(segment).digest("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signJwt(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: randomBytes(8).toString("hex")
    })
  );
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  return `${unsignedToken}.${signSegment(unsignedToken, secret)}`;
}

export function verifyJwt(token: string, secret: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = signSegment(unsignedToken, secret);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const header = JSON.parse(decodeBase64Url(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return null;
    }

    return JSON.parse(decodeBase64Url(encodedPayload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}
