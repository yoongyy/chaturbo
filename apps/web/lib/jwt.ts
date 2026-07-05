import { createHmac, randomBytes } from "crypto";

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function signSegment(segment: string, secret: string): string {
  return createHmac("sha256", secret).update(segment).digest("base64url");
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
