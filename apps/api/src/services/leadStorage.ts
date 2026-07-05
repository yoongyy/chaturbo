import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { connectDb } from "../config/db";
import { Lead } from "../models/Lead";

export interface LeadSubmission {
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
  consent: boolean;
}

export interface StoredLead extends LeadSubmission {
  id: string;
  status: "new";
  source: "website_apply_form";
  createdAt: string;
  updatedAt: string;
}

const leadsFilePath = path.resolve(process.cwd(), "data", "leads.json");

function buildStoredLead(input: LeadSubmission): StoredLead {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    status: "new",
    source: "website_apply_form",
    createdAt: now,
    updatedAt: now,
    fullName: input.fullName.trim(),
    companyName: input.companyName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    industry: input.industry.trim(),
    businessLocation: input.businessLocation.trim(),
    websiteOrSocial: input.websiteOrSocial.trim(),
    taskToAutomate: input.taskToAutomate.trim(),
    customerMessageSources: input.customerMessageSources.map((value) => value.trim()).filter(Boolean),
    customerMessageSourceOther: input.customerMessageSourceOther?.trim() || undefined,
    urgency: input.urgency,
    consent: input.consent
  };
}

async function saveLeadToFile(lead: StoredLead): Promise<void> {
  await fs.mkdir(path.dirname(leadsFilePath), { recursive: true });

  let existing: { leads?: StoredLead[] } = {};
  try {
    const raw = await fs.readFile(leadsFilePath, "utf8");
    existing = JSON.parse(raw) as { leads?: StoredLead[] };
  } catch {
    existing = {};
  }

  const leads = [lead, ...(existing.leads || [])];
  await fs.writeFile(leadsFilePath, `${JSON.stringify({ leads }, null, 2)}\n`, "utf8");
}

export async function storeLead(input: LeadSubmission): Promise<{ lead: StoredLead; storage: "mongo" | "file" | "mock" }> {
  const lead = buildStoredLead(input);

  if (process.env.MONGODB_URI || process.env.MONGO_URI) {
    try {
      await connectDb();
      const created = await Lead.create({
        ...lead,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(lead.updatedAt)
      });

      const plain = created.toObject();
      return {
        lead: {
          id: String(plain._id),
          fullName: plain.fullName ?? input.fullName,
          companyName: plain.companyName ?? input.companyName,
          phone: plain.phone ?? input.phone,
          email: plain.email ?? input.email,
          industry: plain.industry ?? input.industry,
          businessLocation: plain.businessLocation ?? input.businessLocation,
          websiteOrSocial: plain.websiteOrSocial ?? input.websiteOrSocial,
          taskToAutomate: plain.taskToAutomate ?? input.taskToAutomate,
          customerMessageSources: plain.customerMessageSources || [],
          customerMessageSourceOther: plain.customerMessageSourceOther ?? input.customerMessageSourceOther,
          urgency: (plain.urgency ?? input.urgency) as "This week" | "This month" | "Just exploring",
          consent: Boolean(plain.consent ?? input.consent),
          status: "new",
          source: "website_apply_form",
          createdAt: new Date(plain.createdAt).toISOString(),
          updatedAt: new Date(plain.updatedAt).toISOString()
        },
        storage: "mongo"
      };
    } catch (error) {
      console.warn("Lead storage in MongoDB failed; using the local fallback instead.", error);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    await saveLeadToFile(lead);
    return { lead, storage: "file" };
  }

  console.warn("Lead submitted without database configuration. Returning a mock success response.");
  return { lead, storage: "mock" };
}
