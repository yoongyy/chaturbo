import { Router } from "express";
import { z } from "zod";
import { sendError } from "../utils/http";
import { storeLead, type LeadSubmission } from "../services/leadStorage";

const router = Router();

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

router.post("/", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return sendError(res, 400, "Please complete the lead form with valid details.");
  }

  const submission = parsed.data as LeadSubmission;
  const { lead, storage } = await storeLead(submission);

  return res.status(201).json({
    success: true,
    message: "Thank you. We received your application. Chaturbo will contact you soon for a free consultation.",
    storage,
    lead
  });
});

export default router;
