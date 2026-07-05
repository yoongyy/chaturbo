import type { OverviewResponse } from "./leadRescue";

const now = new Date().toISOString();

export function getDemoOverview(): OverviewResponse {
  return {
    stats: {
      newLeads: 2,
      missedCallsRescued: 1,
      bookedJobs: 1,
      activeBusinesses: 2,
      auditTargets: 3
    },
    recentLeads: [
      {
        id: "lead_demo_1",
        phone: "+12125550901",
        name: "James",
        source: "missed_call",
        status: "new",
        urgency: "high",
        summary: "Active roof leak after storm.",
        city: "Dallas",
        serviceNeeded: "Roof leak repair",
        preferredCallbackTime: "ASAP",
        hasPhotos: true,
        optedOut: false,
        ownerNotificationStatus: "sent",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "lead_demo_2",
        phone: "+12125550902",
        name: "Angela",
        source: "sms",
        status: "contacted",
        urgency: "medium",
        summary: "AC not cooling upstairs.",
        city: "Houston",
        serviceNeeded: "AC repair",
        preferredCallbackTime: "This afternoon",
        hasPhotos: false,
        optedOut: false,
        ownerNotificationStatus: "sent",
        createdAt: now,
        updatedAt: now
      }
    ],
    recentAudits: [
      {
        id: "audit_target_1",
        slug: "alpha-roofing-dallas",
        businessName: "Alpha Roofing Dallas",
        industry: "roofing",
        websiteUrl: "https://example.com/alpha-roofing",
        city: "Dallas",
        state: "TX",
        ownerName: "Paul Jones",
        email: "paul@example.com",
        phone: "+12125550111",
        googleProfileUrl: "https://google.com",
        reviewCount: 47,
        rating: 4.2,
        notes: "Strong local market fit",
        crawlStatus: "crawled",
        extractedWebsiteText: "Alpha Roofing Dallas offers roof repair, replacement, emergency service, and same-day quotes. Call now for a free estimate.",
        extractedTitle: "Alpha Roofing Dallas",
        extractedDescription: "Roof repair and replacement in Dallas",
        extractedPhoneNumbers: ["+12125550111"],
        status: "contacted",
        createdAt: now,
        updatedAt: now
      }
    ],
    recentBusinesses: [
      {
        id: "business_demo_1",
        slug: "demo-roofing-company",
        name: "Demo Roofing Company",
        industry: "roofing",
        ownerName: "Kenny Tan",
        ownerMobile: "+12125550101",
        ownerEmail: "roofing@example.com",
        websiteUrl: "https://example.com/roofing",
        city: "Dallas",
        state: "TX",
        serviceArea: "Dallas-Fort Worth",
        servicesJson: ["roof repair", "roof replacement", "emergency leak repair"],
        businessHoursJson: { monday: "8am-5pm", tuesday: "8am-5pm" },
        emergencyService: true,
        googleReviewUrl: "https://google.com",
        calendarUrl: "https://cal.com/demo",
        twilioPhoneNumber: "+12125550199",
        aiTone: "professional, concise, helpful",
        notificationMethod: "both",
        status: "active",
        plan: "setup",
        billingStatus: "manual",
        setupFeePaid: false,
        monthlyPrice: 149,
        demoMode: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "business_demo_2",
        slug: "demo-hvac-company",
        name: "Demo HVAC Company",
        industry: "hvac",
        ownerName: "Maya Lee",
        ownerMobile: "+12125550202",
        ownerEmail: "hvac@example.com",
        websiteUrl: "https://example.com/hvac",
        city: "Houston",
        state: "TX",
        serviceArea: "Houston Metro",
        servicesJson: ["AC repair", "AC replacement", "furnace service"],
        businessHoursJson: { monday: "7am-6pm", saturday: "8am-1pm" },
        emergencyService: true,
        googleReviewUrl: "https://google.com",
        calendarUrl: "https://cal.com/demo-hvac",
        twilioPhoneNumber: "+12125550303",
        aiTone: "friendly, fast, confident",
        notificationMethod: "both",
        status: "active",
        plan: "monthly",
        billingStatus: "trial",
        setupFeePaid: true,
        monthlyPrice: 149,
        demoMode: true,
        createdAt: now,
        updatedAt: now
      }
    ],
    checklist: [
      { label: "Create your first business", done: true },
      { label: "Assign a Twilio number", done: true },
      { label: "Add an audit target", done: true },
      { label: "Seed demo data", done: true },
      { label: "Configure webhooks", done: false }
    ]
  };
}
