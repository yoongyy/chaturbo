import * as cheerio from "cheerio";

export interface CrawlResult {
  ok: boolean;
  title?: string;
  description?: string;
  websiteText: string;
  phoneNumbers: string[];
  contactHints: string[];
  error?: string;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export async function crawlWebsite(url: string): Promise<CrawlResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "ChaturboLeadRescueBot/1.0 (+https://chaturbo.local)"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        ok: false,
        websiteText: "",
        phoneNumbers: [],
        contactHints: [],
        error: `HTTP ${response.status}`
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = normalizeText($("title").first().text() || "");
    const description =
      normalizeText($('meta[name="description"]').attr("content") || "") ||
      normalizeText($('meta[property="og:description"]').attr("content") || "");

    $("script, style, noscript, svg, iframe").remove();
    const websiteText = normalizeText($("body").text().slice(0, 10000));

    const phoneCandidates = unique(
      `${title} ${description} ${websiteText}`
        .match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/g)
        ?.map((value) => normalizeText(value)) || []
    );

    const contactHints = unique(
      [
        /call now/i.test(websiteText) ? "call now" : "",
        /request a quote/i.test(websiteText) ? "request a quote" : "",
        /book now/i.test(websiteText) ? "book now" : "",
        /contact us/i.test(websiteText) ? "contact us" : "",
        /24\/7/i.test(websiteText) ? "24/7 service" : "",
        /emergency/i.test(websiteText) ? "emergency service" : ""
      ].filter(Boolean)
    );

    return {
      ok: true,
      title,
      description,
      websiteText,
      phoneNumbers: phoneCandidates,
      contactHints
    };
  } catch (error) {
    return {
      ok: false,
      websiteText: "",
      phoneNumbers: [],
      contactHints: [],
      error: error instanceof Error ? error.message : "Failed to crawl website"
    };
  } finally {
    clearTimeout(timeout);
  }
}
