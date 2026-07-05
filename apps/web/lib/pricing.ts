export type PricingPlanId = "starter" | "pro" | "growth";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: number;
  bestFor: string;
  badge?: string;
  cta: string;
  features: string[];
};

export const foundingOffer = {
  headline: "Founding Offer: Free setup for the first 10 contractors. After that, setup is $299.",
  body: "Keep your existing number. When you miss a call, Chaturbo texts the customer instantly and captures the job before they call your competitor."
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 79,
    bestFor: "Solo contractors who want missed-call recovery.",
    cta: "Start with Free Setup",
    features: [
      "Keep your existing phone number",
      "Conditional call forwarding setup",
      "Private Chaturbo recovery line",
      "Instant missed-call text-back",
      "Basic AI lead qualification",
      "Lead summary by SMS/email",
      "Up to 50 rescued leads/month"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    bestFor: "Growing contractors who want follow-up automation.",
    badge: "Most Popular",
    cta: "Claim Free Setup",
    features: [
      "Everything in Starter",
      "Up to 200 rescued leads/month",
      "AI follow-up messages",
      "Job urgency detection",
      "Photo/MMS collection",
      "Lead inbox dashboard",
      "Google review request message",
      "Priority setup support"
    ]
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    bestFor: "Contractors running ads or handling higher lead volume.",
    cta: "Book Growth Setup",
    features: [
      "Everything in Pro",
      "Up to 600 rescued leads/month",
      "Website chat widget",
      "Advanced lead summary",
      "Monthly lead rescue report",
      "Multiple team notification numbers",
      "Custom AI assistant tone",
      "Agency and white-label ready support"
    ]
  }
];

export const setupFeeHighlights = [
  "First 10 customers: Free setup",
  "Standard setup: $299 one-time",
  "Setup includes call forwarding guidance, private recovery line configuration, AI text-back setup, and a live missed-call test."
];

export const pricingFaqs = [
  {
    q: "Do I need to change my phone number?",
    a: "No. Chaturbo uses conditional call forwarding, so you keep your existing number."
  },
  {
    q: "What happens when I answer the call?",
    a: "Nothing changes. Chaturbo only activates when you miss the call."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly plans are cancel-anytime."
  },
  {
    q: "What if setup does not work?",
    a: "If we cannot get your missed-call test working, you do not pay the setup fee."
  }
];

export const defaultBusinessBilling = {
  plan: "pro" as const,
  monthlyPrice: 149,
  setupFeeAmount: 299,
  setupFeeWaived: false,
  foundingCustomer: false,
  leadLimit: 200,
  setupFeePaid: false
};

export const pricingLabelMap: Record<PricingPlanId, string> = {
  starter: "Starter",
  pro: "Pro",
  growth: "Growth"
};
