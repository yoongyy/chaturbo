import fs from "fs";
import path from "path";
import { generateMarketingContent, GeneratedPost } from "./openRouterService";
import { generateMarketingCard } from "./imageGenerator";
import { getEnv } from "../../config/env";

export interface PublishResult {
  success: boolean;
  message: string;
  post?: GeneratedPost;
  imagePath?: string;
  ayrshareResponse?: any;
}

const MARKETING_TOPICS = [
  "Why 62% of contractor calls go unanswered",
  "How fast lead response times increase conversion rates by 391%",
  "The cost of missing after-hours HVAC and plumbing calls",
  "AI qualification vs manual lead capture for home service businesses",
  "How Chaturbo lead rescue works in under 3 seconds",
  "Closing roofing jobs on weekends without answering the phone"
];

export async function runDailyPublisher(forcedTopic?: string): Promise<PublishResult> {
  const env = getEnv();
  const topic = forcedTopic || MARKETING_TOPICS[Math.floor(Math.random() * MARKETING_TOPICS.length)];

  console.log(`[SAM-Publisher] Starting publication process for topic: "${topic}"`);

  // Step 1: Generate copy & stats via OpenRouter
  const post = await generateMarketingContent(topic);
  console.log(`[SAM-Publisher] Content generated. Stat: ${post.statisticValue} - ${post.statisticTitle}`);

  // Step 2: Set up target output path in Next.js public folder for easy preview
  const uploadsDir = path.join(__dirname, "../../../../web/public/uploads/social");
  const filename = `post-${Date.now()}.png`;
  const outputPath = path.join(uploadsDir, filename);

  // Step 3: Render card using Playwright
  try {
    await generateMarketingCard(post.statisticTitle, post.statisticValue, outputPath);
    console.log(`[SAM-Publisher] Card rendered and saved to: ${outputPath}`);
  } catch (err) {
    console.error("[SAM-Publisher] Failed to render image card:", err);
    return {
      success: false,
      message: `Failed to render visual card: ${err instanceof Error ? err.message : String(err)}`,
      post
    };
  }

  const relativeUrl = `/uploads/social/${filename}`;

  // Step 4: Dispatch to Ayrshare if API key is provided
  if (env.AYRSHARE_API_KEY) {
    console.log("[SAM-Publisher] Ayrshare API key detected. Attempting to publish...");
    
    // Note: Ayrshare requires a public URL for media.
    // If running in development/localhost, we can log that local path is not fetchable by Ayrshare.
    const isLocal = env.APP_URL?.includes("localhost") || env.APP_URL?.includes("127.0.0.1");
    const mediaUrl = isLocal 
      ? "https://chaturbo.com/images/hero-dashboard-preview.png" // Mock public image URL for local testing
      : `${env.APP_URL}${relativeUrl}`;

    try {
      const response = await fetch("https://api.ayrshare.com/api/post", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.AYRSHARE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post: `${post.caption}\n\n${post.hashtags}`,
          platforms: ["instagram", "twitter", "facebook", "linkedin"],
          mediaUrls: [mediaUrl]
        })
      });

      const resData = await response.json();
      if (!response.ok || resData.status === "error") {
        throw new Error(resData.message || JSON.stringify(resData));
      }

      console.log("[SAM-Publisher] Published successfully via Ayrshare!");
      return {
        success: true,
        message: "Successfully generated and published to social media channels.",
        post,
        imagePath: outputPath,
        ayrshareResponse: resData
      };
    } catch (apiErr) {
      console.error("[SAM-Publisher] Ayrshare API dispatch failed:", apiErr);
      return {
        success: true,
        message: `Content generated and card rendered locally, but Ayrshare upload failed: ${apiErr instanceof Error ? apiErr.message : String(apiErr)}`,
        post,
        imagePath: outputPath
      };
    }
  }

  console.log("[SAM-Publisher] No Ayrshare API key detected. Running in Dry Run / Local Preview mode.");
  return {
    success: true,
    message: `Dry Run successful. Post generated and card rendered locally at ${relativeUrl}. Configure AYRSHARE_API_KEY in .env to post live.`,
    post,
    imagePath: outputPath
  };
}
