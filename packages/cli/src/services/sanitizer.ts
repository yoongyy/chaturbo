interface SanitizeResult {
  sanitizedText: string;
  removedItems: string[];
}

const rules: Array<{ pattern: RegExp; marker: string; item: string }> = [
  { pattern: /sk-[A-Za-z0-9]{20,}/g, marker: "[REDACTED_API_KEY]", item: "openai_key" },
  { pattern: /or-[A-Za-z0-9]{20,}/g, marker: "[REDACTED_API_KEY]", item: "openrouter_key" },
  { pattern: /Bearer\s+[A-Za-z0-9._-]{16,}/gi, marker: "Bearer [REDACTED_TOKEN]", item: "bearer_token" },
  { pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+\b/g, marker: "[REDACTED_TOKEN]", item: "jwt" },
  { pattern: /(password\s*[=:]\s*)([^\s"']+)/gi, marker: "$1[REDACTED_PASSWORD]", item: "password" },
  { pattern: /([A-Z0-9_]+\s*=\s*)([^\n]+)/g, marker: "$1[REDACTED_TOKEN]", item: "env_value" },
  { pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, marker: "[REDACTED_EMAIL]", item: "email" },
  { pattern: /\+?\d[\d\s().-]{7,}\d/g, marker: "[REDACTED_PHONE]", item: "phone" },
  { pattern: /(?:\/Users|\/home|[A-Z]:\\)[^\s"']+/g, marker: "[REDACTED_LOCAL_PATH]", item: "local_path" },
  { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, marker: "[REDACTED_TOKEN]", item: "ip" },
  { pattern: /mongodb(?:\+srv)?:\/\/[^\s"']+/gi, marker: "[REDACTED_DB_URI]", item: "db_uri" },
  { pattern: /https?:\/\/[^\s"']*(?:token|apikey|api_key|auth)=([^\s"']+)/gi, marker: "[REDACTED_TOKEN]", item: "private_url" },
  { pattern: /\bacc(?:ount)?[_-]?id\s*[=:]\s*['"]?[A-Za-z0-9_-]+['"]?/gi, marker: "account_id=[REDACTED_TOKEN]", item: "account_id" }
];

export function sanitizeText(input: string): SanitizeResult {
  let sanitizedText = input;
  const removed = new Set<string>();

  for (const rule of rules) {
    if (rule.pattern.test(sanitizedText)) {
      removed.add(rule.item);
      sanitizedText = sanitizedText.replace(rule.pattern, rule.marker);
    }
  }

  return {
    sanitizedText,
    removedItems: Array.from(removed)
  };
}
