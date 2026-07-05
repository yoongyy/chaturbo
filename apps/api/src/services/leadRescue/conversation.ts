import type { IBusiness } from "../../models/Business";
import type { ILead } from "../../models/Lead";

export interface ConversationSnapshot {
  serviceNeeded?: string;
  city?: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  preferredCallbackTime?: string;
  hasPhotos?: boolean;
  questionStage?: "service" | "city" | "urgency" | "callback" | "photo" | "complete";
  turns?: number;
}

const STOP_WORDS = ["STOP", "STOPALL", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"];
const START_WORDS = ["START", "UNSTOP", "RESUME"];

function textIncludesAny(value: string, candidates: string[]): boolean {
  const upper = value.trim().toUpperCase();
  return candidates.some((candidate) => upper === candidate || upper.includes(candidate));
}

export function isStopMessage(body: string): boolean {
  return textIncludesAny(body, STOP_WORDS);
}

export function isStartMessage(body: string): boolean {
  return textIncludesAny(body, START_WORDS);
}

export function updateConversationState(existing: ConversationSnapshot | undefined, body: string, hasPhotos = false): ConversationSnapshot {
  const text = body.trim();
  const state: ConversationSnapshot = {
    serviceNeeded: existing?.serviceNeeded,
    city: existing?.city,
    urgency: existing?.urgency,
    preferredCallbackTime: existing?.preferredCallbackTime,
    hasPhotos: existing?.hasPhotos || hasPhotos,
    turns: (existing?.turns || 0) + 1,
    questionStage: existing?.questionStage || "service"
  };

  const lower = text.toLowerCase();
  const urgencyMatch = lower.match(/\b(emergency|urgent|asap|right away|now)\b/);
  const callbackMatch = lower.match(/\b(today|tomorrow|this morning|this afternoon|evening|after \d{1,2} ?(am|pm)|\d{1,2} ?(am|pm))\b/);
  const cityMatch = text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/);

  if (!state.serviceNeeded && state.questionStage === "service") {
    state.serviceNeeded = text;
    state.questionStage = "city";
    return state;
  }

  if (!state.city && state.questionStage === "city") {
    state.city = cityMatch?.[1] || text;
    state.questionStage = urgencyMatch ? "callback" : "urgency";
    if (urgencyMatch) {
      state.urgency = urgencyMatch[1] === "emergency" ? "emergency" : "high";
    }
    return state;
  }

  if (!state.urgency && state.questionStage === "urgency") {
    state.urgency = urgencyMatch ? "emergency" : /soon|today|now|asap/i.test(text) ? "high" : "medium";
    state.questionStage = "callback";
    return state;
  }

  if (!state.preferredCallbackTime && state.questionStage === "callback") {
    state.preferredCallbackTime = callbackMatch?.[0] || text;
    state.questionStage = "photo";
    return state;
  }

  if (!state.hasPhotos && state.questionStage === "photo" && hasPhotos) {
    state.hasPhotos = true;
  }

  if (state.serviceNeeded && state.city && state.urgency && state.preferredCallbackTime) {
    state.questionStage = "complete";
  }

  return state;
}

export function buildFollowupQuestion(state: ConversationSnapshot): string {
  if (!state.serviceNeeded) return "Sorry to hear that. What service do you need?";
  if (!state.city) return "What city are you in?";
  if (!state.urgency) return "Is this urgent or can it wait?";
  if (!state.preferredCallbackTime) return "When is the best time to call you back?";
  if (!state.hasPhotos) return "Can you send a photo if you have one?";
  return "Thanks. I’ve sent this to the owner.";
}

export function buildLeadSummary(lead: any, business: any): string {
  const urgency = lead.urgency || "medium";
  return [
    `${urgency === "emergency" ? "Urgent" : "New"} ${business.industry} lead`,
    `Phone: ${lead.phone}`,
    lead.city ? `Location: ${lead.city}` : null,
    lead.serviceNeeded ? `Issue: ${lead.serviceNeeded}` : null,
    lead.preferredCallbackTime ? `Callback: ${lead.preferredCallbackTime}` : null,
    lead.hasPhotos ? "Photo: Yes" : "Photo: No",
    `Suggested next step: ${urgency === "emergency" ? "Call immediately" : "Reply and book the job"}`
  ]
    .filter(Boolean)
    .join("\n");
}

export function shouldSendMissedCallSms(lead: any): boolean {
  if (lead.optedOut) return false;
  if (!lead.lastMissedCallSmsAt) return true;
  const elapsed = Date.now() - new Date(lead.lastMissedCallSmsAt).getTime();
  return elapsed > 30 * 60 * 1000;
}

export function isOwnerNotificationAllowed(lead: any): boolean {
  return lead.ownerNotificationStatus !== "sent";
}
