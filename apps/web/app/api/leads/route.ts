import { NextResponse } from "next/server";
import { createApplicationLead } from "../../../lib/demoDataStore";

type LeadPayload = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  industry: string;
  businessLocation: string;
  websiteOrSocial: string;
  taskToAutomate: string;
  customerMessageSources: string[];
  customerMessageSourceOther?: string;
  urgency: "This week" | "This month" | "Just exploring";
  consent: true;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseLeadPayload(body: unknown): LeadPayload | null {
  const payload = body as Record<string, unknown>;
  const fullName = asString(payload.fullName);
  const companyName = asString(payload.companyName);
  const phone = asString(payload.phone);
  const email = asString(payload.email);
  const industry = asString(payload.industry);
  const businessLocation = asString(payload.businessLocation);
  const websiteOrSocial = asString(payload.websiteOrSocial);
  const taskToAutomate = asString(payload.taskToAutomate);
  const customerMessageSourceOther = asString(payload.customerMessageSourceOther);
  const customerMessageSources = Array.isArray(payload.customerMessageSources)
    ? payload.customerMessageSources.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const urgency = payload.urgency;
  const consent = payload.consent === true;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const urgencyOk = urgency === "This week" || urgency === "This month" || urgency === "Just exploring";
  const hasRequiredFields =
    fullName.length >= 2 &&
    companyName.length >= 2 &&
    phone.length >= 5 &&
    emailOk &&
    industry.length >= 2 &&
    businessLocation.length >= 2 &&
    websiteOrSocial.length >= 2 &&
    taskToAutomate.length >= 10 &&
    customerMessageSources.length > 0 &&
    consent;

  if (!hasRequiredFields) {
    return null;
  }

  if (customerMessageSources.includes("Other") && !customerMessageSourceOther) {
    return null;
  }

  if (!urgencyOk) {
    return null;
  }

  return {
    fullName,
    companyName,
    phone,
    email,
    industry,
    businessLocation,
    websiteOrSocial,
    taskToAutomate,
    customerMessageSources,
    customerMessageSourceOther: customerMessageSourceOther || undefined,
    urgency,
    consent: true
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload = parseLeadPayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Please complete the lead form with valid details." }, { status: 400 });
  }

  const lead = createApplicationLead(payload);

  return NextResponse.json(
    {
      success: true,
      message: "Thank you. We received your application. Chaturbo will contact you soon for a free consultation.",
      storage: "demo",
      lead
    },
    { status: 201 }
  );
}
