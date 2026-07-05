import { NextResponse } from "next/server";
import { z } from "zod";
import { createApplicationLead } from "../../../lib/demoDataStore";

const leadSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    companyName: z.string().trim().min(2).max(160),
    phone: z.string().trim().min(5).max(40),
    email: z.string().trim().email().max(160),
    industry: z.string().trim().min(2).max(120),
    businessLocation: z.string().trim().min(2).max(120),
    websiteOrSocial: z.string().trim().min(2).max(300),
    taskToAutomate: z.string().trim().min(10).max(2000),
    customerMessageSources: z.array(z.string().trim().min(1)).min(1),
    customerMessageSourceOther: z.string().trim().max(120).optional(),
    urgency: z.enum(["This week", "This month", "Just exploring"]),
    consent: z.literal(true)
  })
  .superRefine((value, ctx) => {
    if (value.customerMessageSources.includes("Other") && !value.customerMessageSourceOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please describe the other message source.",
        path: ["customerMessageSourceOther"]
      });
    }
  });

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the lead form with valid details." }, { status: 400 });
  }

  const lead = createApplicationLead(parsed.data);

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
