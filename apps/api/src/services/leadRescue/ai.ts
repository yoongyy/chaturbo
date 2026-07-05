import OpenAI from "openai";
import { getEnv } from "../../config/env";
import type { IBusiness } from "../../models/Business";
import type { IAuditTarget } from "../../models/AuditTarget";
import type { ILead } from "../../models/Lead";
import { buildFollowupQuestion, buildLeadSummary, type ConversationSnapshot } from "./conversation";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const env = getEnv();
  if (!env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function fallbackAudit(target: IAuditTarget, websiteText: string) {
  const body = websiteText.toLowerCase();
  const problems = [
    body.includes("call") ? null : "Phone number and call CTA are not prominent enough.",
    body.includes("quote") ? null : "No obvious fast quote path.",
    body.includes("24/7") || body.includes("emergency") ? null : "Emergency response messaging is weak.",
    body.includes("review") ? null : "Review request flow is not obvious.",
    body.includes("chat") ? null : "No obvious website chat or instant response path.",
    body.includes("missed call") ? null : "No visible missed-call recovery or text-back workflow."
  ].filter(Boolean) as string[];

  const recommendations = [
    "Add a visible call-now CTA above the fold.",
    "Add a missed-call text-back flow.",
    "Route urgent leads to instant SMS follow-up.",
    "Make service area and emergency messaging clearer."
  ];

  const summary = `${target.businessName} looks like a good lead-rescue opportunity for ${target.industry}. The site can capture more jobs with faster response and a clearer call path.`;

  return {
    summary,
    problems,
    recommendations,
    coldEmail: `Subject: Quick lead rescue idea for ${target.businessName}\n\nHi ${target.ownerName || target.businessName},\n\nI took a quick look at ${target.businessName}. I noticed a few places where calls and quote requests may be slipping through the cracks.\n\nI help ${target.industry} companies recover missed calls and text back leads before they call a competitor.\n\nIf helpful, I can show you a short audit.\n\n- Chaturbo Lead Rescue`,
    followupEmail1: `Subject: Re: ${target.businessName} lead rescue audit\n\nJust bumping this to the top of your inbox.\n\nI can show you how missed calls, slow follow-up, and weak after-hours coverage may be costing ${target.businessName} jobs.\n\nReply with a good time and I’ll send the audit.`,
    followupEmail2: `Subject: Last note on ${target.businessName}\n\nOne last note: if your team misses calls after hours, that lead is usually gone within minutes.\n\nI built a missed-call recovery system for contractors so the caller gets a fast text-back and the owner gets a clean job summary.\n\nHappy to send the demo.`,
    callScript: `Hi ${target.ownerName || "there"}, this is Kenny from Chaturbo Lead Rescue. I recorded a quick audit for ${target.businessName} showing where leads may be leaking. I help contractors recover missed calls with instant text-back and AI qualification. Could I send you the audit link?`,
    facebookMessage: `Hi ${target.ownerName || target.businessName} - I put together a short lead rescue audit for ${target.businessName}. It shows where calls may be slipping away and how to recover them faster. Want me to send it over?`,
    contactFormMessage: `Hi, I created a lead rescue audit for ${target.businessName}. It highlights missed-call and fast-follow-up opportunities. If you want, I can send the link.`,
    videoScript: `Intro: "Hi ${target.ownerName || "there"}, I made a quick audit for ${target.businessName}."\nBody: "A few things stood out: ${problems.slice(0, 3).join(" ")}"\nClose: "I can set up a missed-call recovery system so new leads get a fast text-back and your owner gets a clean summary. Reply and I’ll send the demo."`,
    publicPageHtml: `<section><h1>Lead Rescue Audit for ${target.businessName}</h1><p>${summary}</p><ul>${problems
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul></section>`
  };
}

function fallbackSmsReply(conversation: ConversationSnapshot, business: IBusiness) {
  const question = buildFollowupQuestion(conversation);
  return {
    reply: `${question} Reply with a short answer.`,
    state: conversation
  };
}

export async function generateAudit(target: IAuditTarget, websiteText: string) {
  const client = getOpenAIClient();
  if (!client) return fallbackAudit(target, websiteText);

  const prompt = `
You are writing a practical contractor lead-rescue audit for ${target.businessName} in the ${target.industry} market.
Website text:
${websiteText || "No website text available."}

Return JSON with keys:
summary, problems, recommendations, coldEmail, followupEmail1, followupEmail2, callScript, facebookMessage, contactFormMessage, videoScript, publicPageHtml
Keep it concrete, short, and sales-friendly.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4
  });

  const content = response.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content) as ReturnType<typeof fallbackAudit>;
  } catch {
    return fallbackAudit(target, websiteText);
  }
}

export async function generateSmsReply(
  conversation: ConversationSnapshot,
  business: any,
  lead: ILead
): Promise<{ reply: string; state: ConversationSnapshot }> {
  const client = getOpenAIClient();
  if (!client) {
    return fallbackSmsReply(conversation, business);
  }

  const prompt = `
You are a contractor office text-back assistant for ${business.name}.
Tone: ${business.aiTone || "professional, concise, helpful"}.

Lead phone: ${lead.phone}
Current captured info:
- serviceNeeded: ${conversation.serviceNeeded || ""}
- city: ${conversation.city || ""}
- urgency: ${conversation.urgency || ""}
- preferredCallbackTime: ${conversation.preferredCallbackTime || ""}
- hasPhotos: ${conversation.hasPhotos ? "yes" : "no"}
- questionStage: ${conversation.questionStage || ""}

Ask one short question at a time, no more than 22 words.
If enough info is captured, say you will send the summary to the owner and keep it short.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const reply = response.choices[0]?.message?.content?.trim() || buildFollowupQuestion(conversation);
  return { reply, state: conversation };
}

export async function summarizeLead(conversation: ConversationSnapshot, business: any, lead: ILead): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    return buildLeadSummary(lead, business);
  }

  const prompt = `
Summarize this contractor lead in 3-5 bullets. Keep it clean and actionable.
Business: ${business.name}
Phone: ${lead.phone}
Captured info: ${JSON.stringify(conversation)}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  return response.choices[0]?.message?.content?.trim() || buildLeadSummary(lead, business);
}

export async function classifyLeadUrgency(conversation: ConversationSnapshot): Promise<"low" | "medium" | "high" | "emergency"> {
  if (conversation.urgency) return conversation.urgency;
  if (conversation.serviceNeeded?.toLowerCase().includes("leak")) return "high";
  return "medium";
}

export async function generateOutreachMessages(target: IAuditTarget, audit: ReturnType<typeof fallbackAudit>) {
  return {
    coldEmail: audit.coldEmail,
    followupEmail1: audit.followupEmail1,
    followupEmail2: audit.followupEmail2,
    callScript: audit.callScript,
    facebookMessage: audit.facebookMessage,
    contactFormMessage: audit.contactFormMessage,
    videoScript: audit.videoScript
  };
}
