import type { Types } from "mongoose";

export function normalizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "").replace(/^00/, "+");
}

export function toId(value: Types.ObjectId | string | undefined | null): string {
  return value ? String(value) : "";
}

export function serializeDoc(doc: any) {
  const { _id, id, ...rest } = doc || {};
  return {
    id: String(id || _id || ""),
    ...rest,
    createdAt: doc?.createdAt ? new Date(doc.createdAt as string).toISOString() : undefined,
    updatedAt: doc?.updatedAt ? new Date(doc.updatedAt as string).toISOString() : undefined
  };
}

export function safeJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") {
    return (value as T) ?? fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
