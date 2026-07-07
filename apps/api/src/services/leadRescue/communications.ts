import { Resend } from "resend";
import twilio from "twilio";
import { getEnv } from "../../config/env";

let resendClient: Resend | null = null;
let twilioClient: ReturnType<typeof twilio> | null = null;

function getResendClient(): Resend | null {
  const env = getEnv();
  if (!env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

function getTwilioClient(): ReturnType<typeof twilio> | null {
  const env = getEnv();
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) return null;
  if (!twilioClient) {
    twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

export async function makeCall(to: string, twiml: string): Promise<{ ok: boolean; sid?: string; error?: string }> {
  const env = getEnv();
  const client = getTwilioClient();
  const fromNumber = env.TWILIO_DEFAULT_FROM_NUMBER;

  if (!client || !fromNumber) {
    console.log("[mock call]", { to, twiml });
    return { ok: true, sid: "mock-call-sid" };
  }

  try {
    const call = await client.calls.create({
      to,
      from: fromNumber,
      twiml
    });
    return { ok: true, sid: call.sid };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Call failed" };
  }
}

export async function sendSms(to: string, body: string, mediaUrls?: string[]): Promise<{ ok: boolean; sid?: string; error?: string }> {
  const env = getEnv();
  const client = getTwilioClient();
  const fromNumber = env.TWILIO_DEFAULT_FROM_NUMBER;
  const messagingServiceSid = env.TWILIO_MESSAGING_SERVICE_SID;

  if (!client || (!fromNumber && !messagingServiceSid)) {
    console.log("[mock sms]", { to, body, mediaUrls });
    return { ok: true, sid: "mock-sid" };
  }

  try {
    const payload: any = {
      to,
      body
    };

    if (mediaUrls?.length) {
      payload.mediaUrl = mediaUrls;
    }

    if (messagingServiceSid) {
      payload.messagingServiceSid = messagingServiceSid;
    } else if (fromNumber) {
      payload.from = fromNumber;
    }

    const message = await client.messages.create(payload as Parameters<typeof client.messages.create>[0]);
    return { ok: true, sid: message.sid };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "SMS send failed" };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const env = getEnv();
  const client = getResendClient();
  const from = env.FROM_EMAIL;

  if (!client || !from) {
    console.log("[mock email]", { to, subject, text: text || html });
    return { ok: true, id: "mock-email" };
  }

  try {
    const result = await client.emails.send({
      from,
      to,
      subject,
      html,
      text
    });
    return { ok: true, id: result.data?.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Email send failed" };
  }
}

export function validateTwilioSignature(url: string, params: Record<string, string>, signature?: string | string[]): boolean {
  const env = getEnv();
  if (!env.TWILIO_AUTH_TOKEN || !signature || Array.isArray(signature)) return true;
  return twilio.validateRequest(env.TWILIO_AUTH_TOKEN, signature, url, params);
}

export function getVoiceTwiml(message: string, ownerNumber: string, statusCallbackUrl: string): string {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.say({ voice: "alice" }, message);
  if (!ownerNumber) {
    return voiceResponse.toString();
  }
  const dial = voiceResponse.dial({
    action: statusCallbackUrl,
    method: "POST",
    timeout: 20,
    answerOnBridge: true
  });
  dial.number(ownerNumber);
  return voiceResponse.toString();
}

export function getSmsTwiml(message: string): string {
  const smsResponse = new twilio.twiml.MessagingResponse();
  smsResponse.message(message);
  return smsResponse.toString();
}

export function getAppUrl(): string {
  const env = getEnv();
  return env.APP_URL || env.APP_BASE_URL || "http://localhost:3000";
}
