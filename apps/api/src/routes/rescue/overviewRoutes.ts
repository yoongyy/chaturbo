import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { AuditTarget } from "../../models/AuditTarget";
import { Business } from "../../models/Business";
import { Lead } from "../../models/Lead";
import { CallLog } from "../../models/CallLog";
import { serializeDoc } from "../../services/leadRescue/utils";

const router = Router();

router.use(requireAuth);

router.get("/", async (_req, res) => {
  const [newLeads, missedCalls, bookedJobs, activeBusinesses, auditTargets, recentLeads, recentAudits, recentBusinesses] =
    await Promise.all([
      Lead.countDocuments({ status: "new" }),
      CallLog.countDocuments({ status: { $in: ["no-answer", "busy", "failed", "canceled"] } }),
      Lead.countDocuments({ status: "booked" }),
      Business.countDocuments({ status: "active" }),
      AuditTarget.countDocuments(),
      Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
      AuditTarget.find().sort({ createdAt: -1 }).limit(5).lean(),
      Business.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

  return res.json({
    stats: {
      newLeads,
      missedCallsRescued: missedCalls,
      bookedJobs,
      activeBusinesses,
      auditTargets
    },
    recentLeads: recentLeads.map((lead) => serializeDoc(lead)),
    recentAudits: recentAudits.map((audit) => serializeDoc(audit)),
    recentBusinesses: recentBusinesses.map((business) => serializeDoc(business)),
    hasAssignedTwilioNumber: Boolean(await Business.exists({ twilioPhoneNumber: { $exists: true, $ne: "" } })),
    checklist: [
      { label: "Create your first business", done: activeBusinesses > 0 },
      { label: "Assign a Twilio number", done: Boolean(await Business.exists({ twilioPhoneNumber: { $exists: true, $ne: "" } })) },
      { label: "Add an audit target", done: auditTargets > 0 },
      { label: "Seed demo data", done: recentLeads.length > 0 },
      { label: "Configure webhooks", done: false }
    ]
  });
});

export default router;
