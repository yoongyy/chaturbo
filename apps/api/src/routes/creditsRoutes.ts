import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";
import { sendError } from "../utils/http";
import { getEnv } from "../config/env";
import { CreditTransaction } from "../models/CreditTransaction";
import { PayoutRequest } from "../models/PayoutRequest";

const router = Router();
const USD_PER_CREDIT = 0.1;

router.use(requireAuth);

function getStripeClient() {
  const env = getEnv();
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

router.get("/balance", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("credits creditsPurchased creditsEarned ownerUid email");
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  return res.json({
    ownerUid: owner.ownerUid,
    email: owner.email,
    credits: owner.credits,
    creditsPurchased: owner.creditsPurchased,
    creditsEarned: owner.creditsEarned
  });
});

const topupSchema = z.object({
  credits: z.number().int().min(1).max(100000),
  note: z.string().max(120).optional()
});

router.post("/topup", async (req: AuthenticatedRequest, res) => {
  const parsed = topupSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid top-up payload");
  }

  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  owner.credits += parsed.data.credits;
  owner.creditsPurchased += parsed.data.credits;
  await owner.save();

  await CreditTransaction.create({
    ownerId: owner._id,
    type: "topup",
    source: "manual",
    amount: parsed.data.credits,
    metadata: { note: parsed.data.note || "manual_topup" }
  });

  return res.status(201).json({
    toppedUp: true,
    addedCredits: parsed.data.credits,
    credits: owner.credits,
    creditsPurchased: owner.creditsPurchased,
    creditsEarned: owner.creditsEarned,
    note: parsed.data.note || null
  });
});

const checkoutSchema = z.object({
  credits: z.number().int().min(10).max(100000),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

router.post("/checkout-session", async (req: AuthenticatedRequest, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid checkout payload");
  }

  const owner = await User.findById(req.user?.userId).select("_id email ownerUid");
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return sendError(res, 500, "Stripe is not configured");
  }

  const env = getEnv();
  const appBaseUrl = env.APP_BASE_URL || req.header("origin") || "http://localhost:3000";
  const successUrl = parsed.data.successUrl || `${appBaseUrl}/dashboard?topup=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = parsed.data.cancelUrl || `${appBaseUrl}/dashboard?topup=cancelled`;
  const amountUsd = Number((parsed.data.credits * USD_PER_CREDIT).toFixed(2));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Chaturbo Credits (${parsed.data.credits})`,
            description: "Top up credits for workflow purchases"
          },
          unit_amount: Math.round(amountUsd * 100)
        },
        quantity: 1
      }
    ],
    metadata: {
      userId: String(owner._id),
      ownerUid: owner.ownerUid,
      credits: String(parsed.data.credits)
    },
    customer_email: owner.email
  });

  return res.status(201).json({
    sessionId: session.id,
    url: session.url
  });
});

const confirmSchema = z.object({
  sessionId: z.string().min(1)
});

router.post("/checkout-confirm", async (req: AuthenticatedRequest, res) => {
  const parsed = confirmSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid checkout confirm payload");
  }

  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return sendError(res, 500, "Stripe is not configured");
  }

  const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
  if (!session) {
    return sendError(res, 404, "Checkout session not found");
  }

  const metaOwnerId = session.metadata?.userId;
  const metaCredits = Number(session.metadata?.credits || "0");

  if (String(owner._id) !== metaOwnerId) {
    return sendError(res, 403, "Checkout session does not belong to current user");
  }

  if (session.payment_status !== "paid") {
    return sendError(res, 400, "Checkout payment is not completed");
  }

  const existingTransaction = await CreditTransaction.findOne({ stripeSessionId: session.id });
  if (existingTransaction) {
    return res.json({
      alreadyProcessed: true,
      credits: owner.credits,
      creditsPurchased: owner.creditsPurchased,
      creditsEarned: owner.creditsEarned
    });
  }

  if (!Number.isFinite(metaCredits) || metaCredits <= 0) {
    return sendError(res, 400, "Invalid credits metadata in checkout session");
  }

  owner.credits += metaCredits;
  owner.creditsPurchased += metaCredits;
  await owner.save();

  await CreditTransaction.create({
    ownerId: owner._id,
    type: "topup",
    source: "stripe_checkout",
    amount: metaCredits,
    stripeSessionId: session.id,
    metadata: {
      checkoutSessionId: session.id,
      amountTotal: session.amount_total
    }
  });

  return res.status(201).json({
    processed: true,
    addedCredits: metaCredits,
    credits: owner.credits,
    creditsPurchased: owner.creditsPurchased,
    creditsEarned: owner.creditsEarned
  });
});

const payoutSchema = z.object({
  credits: z.number().int().min(10),
  destinationHint: z.string().max(120).optional(),
  note: z.string().max(240).optional()
});

router.post("/payout-request", async (req: AuthenticatedRequest, res) => {
  const parsed = payoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, "Invalid payout payload");
  }

  const owner = await User.findById(req.user?.userId);
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  if (owner.creditsEarned < parsed.data.credits) {
    return sendError(res, 400, "Insufficient earned credits for payout request");
  }

  owner.creditsEarned -= parsed.data.credits;
  owner.credits -= parsed.data.credits;
  await owner.save();

  const usdAmount = Number((parsed.data.credits * USD_PER_CREDIT).toFixed(2));
  const payout = await PayoutRequest.create({
    ownerId: owner._id,
    credits: parsed.data.credits,
    usdAmount,
    method: "stripe",
    destinationHint: parsed.data.destinationHint,
    note: parsed.data.note,
    status: "pending"
  });

  await CreditTransaction.create({
    ownerId: owner._id,
    type: "payout_debit",
    source: "manual",
    amount: -parsed.data.credits,
    metadata: { payoutRequestId: payout._id }
  });

  return res.status(201).json({
    payoutRequest: {
      id: payout._id,
      credits: payout.credits,
      usdAmount: payout.usdAmount,
      status: payout.status,
      createdAt: payout.createdAt
    },
    credits: owner.credits,
    creditsPurchased: owner.creditsPurchased,
    creditsEarned: owner.creditsEarned
  });
});

router.get("/payout-requests", async (req: AuthenticatedRequest, res) => {
  const owner = await User.findById(req.user?.userId).select("_id");
  if (!owner) {
    return sendError(res, 404, "User not found");
  }

  const requests = await PayoutRequest.find({ ownerId: owner._id }).sort({ createdAt: -1 });
  return res.json({ requests });
});

export default router;
