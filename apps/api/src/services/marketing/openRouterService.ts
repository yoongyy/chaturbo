import OpenAI from "openai";
import { getEnv } from "../../config/env";

let openRouterClient: OpenAI | null = null;

export function getOpenRouterClient(): OpenAI | null {
  const env = getEnv();
  const apiKey = env.OPENROUTER_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) return null;

  if (!openRouterClient) {
    if (env.OPENROUTER_API_KEY) {
      openRouterClient = new OpenAI({
        apiKey: env.OPENROUTER_API_KEY,
        baseURL: env.OPENROUTER_BASE_URL,
        defaultHeaders: {
          "HTTP-Referer": "https://chaturbo.com",
          "X-Title": "Chaturbo Marketing Automation"
        }
      });
    } else {
      // Fallback to direct OpenAI client
      openRouterClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
  }
  return openRouterClient;
}

export function getMarketingModel(): string {
  const env = getEnv();
  if (env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  }
  return "gpt-4o-mini";
}

export interface GeneratedPost {
  caption: string;
  hashtags: string;
  imagePrompt: string;
  statisticTitle: string;
  statisticValue: string;
}

export async function generateMarketingContent(topic: string): Promise<GeneratedPost> {
  const client = getOpenRouterClient();
  const model = getMarketingModel();

  if (!client) {
    // Return high-quality mock fallback if no keys configured
    return {
      caption: "🚨 USA Contractors: Are you leaving money on the table? Over 62% of inbound phone calls to roofing and HVAC businesses go unanswered. Homeowners don't wait—they call the next competitor. With Chaturbo, recover missed calls instantly with automatic qualified text-back response.",
      hashtags: "#contractor #roofing #hvac #plumbing #leadrescue #chaturbo",
      imagePrompt: "Professional vector graphic illustrating a missed phone call converting into a secured booking, dark slate background, high contrast teal and orange accents, corporate design style.",
      statisticTitle: "Calls Unanswered",
      statisticValue: "62%"
    };
  }

  const prompt = `
You are a senior B2B SaaS copywriter for Chaturbo.com (AI missed call lead rescue SaaS for USA contractors).
Generate a social media post targeting USA contractors (Roofing, HVAC, Plumbing, Landscaping, Electrical, etc.) on the topic: "${topic}".

Generate a JSON object with EXACTLY these keys:
- caption: engaging, problem-solving, sales-focused text copy for social media (under 90 words). Focus on the pain of losing leads and the solution of Chaturbo's instant qualified text-back.
- hashtags: 4-6 highly relevant hashtags starting with #.
- imagePrompt: a detailed descriptive prompt for a text-to-image generator (like Stable Diffusion or Midjourney) to generate a clean, modern graphic for this post.
- statisticTitle: a short 2-4 word title for a stat card (e.g. "Unanswered Calls" or "Response Time").
- statisticValue: a short value or percentage (e.g. "62%" or "3 Seconds").

Return ONLY raw JSON. No markdown backticks or wrappers.
`;

  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices[0]?.message?.content?.trim() || "";
    // Clean potential markdown wrap
    const cleaned = text.replace(/^```json/, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned) as GeneratedPost;
  } catch (error) {
    console.error("Failed to generate marketing content via AI, using fallback.", error);
    return {
      caption: `🚨 USA Contractors: Let's talk about ${topic}. Most contractors miss up to 50% of their incoming calls while on jobs. Chaturbo is here to solve that with instant SMS follow-up and lead qualification in 3 seconds.`,
      hashtags: "#contractors #leadgeneration #missedcalls #chaturbo",
      imagePrompt: "Clean, high-tech graphic representing instant lead qualification, smartphone with notifications, vector style.",
      statisticTitle: "Lead Response",
      statisticValue: "<3s"
    };
  }
}
