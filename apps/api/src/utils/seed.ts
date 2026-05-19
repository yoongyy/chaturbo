import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDb } from "../config/db";
import { User } from "../models/User";
import { WorkflowDraft } from "../models/WorkflowDraft";
import { Workflow } from "../models/Workflow";
import { slugify } from "./slug";

dotenv.config();

async function run() {
  await connectDb();

  const email = "demo@chaturbo.dev";
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name: "Demo User",
      passwordHash: await bcrypt.hash("password123", 10),
      credits: 25
    });
  }

  await WorkflowDraft.deleteMany({ ownerId: user._id });
  await Workflow.deleteMany({ ownerId: user._id });

  const samples = [
    "Fix OpenRouter rate limit fallback",
    "Shopify OAuth callback on Vercel",
    "Telegram signal to MT5 bridge",
    "Local LLM Ollama setup",
    "Vercel + Railway + MongoDB SaaS deploy"
  ];

  const draftDocs = await WorkflowDraft.insertMany(
    samples.map((title, index) => ({
      ownerId: user!._id,
      source: { type: "agent_log", path: "sample-agent-logs", scannedAt: new Date() },
      title,
      category: index % 2 === 0 ? "automation" : "deployment",
      summary: `${title} from sanitized execution logs and troubleshooting notes.`,
      problem: {
        description: `Common failures observed while executing ${title}.`,
        symptoms: ["error responses", "retries", "inconsistent output"]
      },
      solution: {
        overview: `Structured fix path for ${title}.`,
        steps: ["Reproduce issue", "Apply deterministic fix", "Validate run output"],
        doNotDo: [
          "Do not expose API keys",
          "Do not overwrite .env without backup",
          "Do not keep retrying failed API calls forever",
          "Do not run destructive commands without confirmation"
        ],
        commonErrors: [{ error: "Rate limit", fix: "Add queue/backoff" }],
        verificationSteps: [
          "Confirm task completes without repeated error",
          "Confirm required service/API returns expected response",
          "Confirm logs do not expose secrets"
        ]
      },
      compatibility: {
        agents: ["OpenClaw", "Hermes", "Claude CLI", "Gemini CLI"],
        os: ["macOS", "Linux"],
        minRamGb: 8,
        requiredTools: ["terminal", "node"],
        requiredSoftware: { node: ">=18" },
        modelRequirement: "advanced_coding",
        contextLength: 16000
      },
      estimates: {
        timeSpentHours: 2 + index,
        tokenCostUsd: 0.7 + index * 0.4,
        suggestedPriceCredits: 15 + index * 5,
        potentialMonthlyRevenueLow: 60 + index * 25,
        potentialMonthlyRevenueHigh: 250 + index * 45
      },
      privacy: {
        sanitized: true,
        removedItems: ["[REDACTED_API_KEY]"],
        riskLevel: index > 2 ? "medium" : "low"
      },
      quality: {
        publishReadinessScore: 72 + index * 4,
        missingFields: index === 0 ? [] : ["More environment screenshots"],
        reasonWhySellable: "Saves engineering debugging cycles with repeatable fix path."
      },
      status: "draft"
    }))
  );

  const first = draftDocs[0];
  await Workflow.create({
    ownerId: user._id,
    draftId: first._id,
    title: first.title,
    slug: slugify(first.title),
    category: first.category,
    summary: first.summary,
    priceCredits: first.estimates.suggestedPriceCredits,
    fullContent: {
      title: first.title,
      problem: first.problem,
      solution: first.solution,
      compatibility: first.compatibility
    },
    previewContent: {
      title: first.title,
      category: first.category,
      summary: first.summary,
      problemDescription: first.problem.description,
      compatibility: first.compatibility,
      estimates: first.estimates,
      qualityScore: first.quality.publishReadinessScore,
      riskLevel: first.privacy.riskLevel
    },
    compatibility: first.compatibility,
    status: "published"
  });

  await WorkflowDraft.updateOne({ _id: first._id }, { status: "published" });

  console.log("Seed complete. Demo login: demo@chaturbo.dev / password123");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
