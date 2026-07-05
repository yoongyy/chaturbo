import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { AuditTarget } from "../../models/AuditTarget";
import { Business } from "../../models/Business";
import { Lead } from "../../models/Lead";
import { CallLog } from "../../models/CallLog";
import { serializeDoc } from "../../services/leadRescue/utils";
import { AuthenticatedRequest } from "../../types";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthenticatedRequest, res) => {
  const isAdmin = req.user?.role === "admin";
  const businessScope = isAdmin ? {} : { ownerId: req.user?.userId };
  const auditScope = isAdmin ? {} : { ownerId: req.user?.userId };
  const businesses = await Business.find(businessScope).select("_id twilioPhoneNumber").sort({ createdAt: -1 }).lean();
  const businessIds = businesses.map((business) => business._id);
  const leadScope = isAdmin ? {} : { businessId: { $in: businessIds } };
  const callScope = isAdmin ? {} : { businessId: { $in: businessIds } };

  const [newLeads, missedCalls, bookedJobs, activeBusinesses, auditTargets, recentLeads, recentAudits, recentBusinesses] =
    await Promise.all([
      Lead.countDocuments({ ...leadScope, status: "new" }),
      CallLog.countDocuments({ ...callScope, status: { $in: ["no-answer", "busy", "failed", "canceled"] } }),
      Lead.countDocuments({ ...leadScope, status: "booked" }),
      Business.countDocuments({ ...businessScope, status: "active" }),
      AuditTarget.countDocuments(auditScope),
      Lead.find(leadScope).sort({ createdAt: -1 }).limit(5).lean(),
      AuditTarget.find(auditScope).sort({ createdAt: -1 }).limit(5).lean(),
      Business.find(businessScope).sort({ createdAt: -1 }).limit(5).lean()
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
    hasAssignedTwilioNumber: businesses.some((business) => Boolean(business.twilioPhoneNumber)),
    checklist: isAdmin
      ? [
          { label: "Create or import a business", done: recentBusinesses.length > 0 },
          { label: "Review the lead pipeline", done: recentLeads.length > 0 },
          { label: "Add an audit target", done: auditTargets > 0 },
          { label: "Confirm the phone flow is connected", done: businesses.some((business) => Boolean(business.twilioPhoneNumber)) },
          { label: "Finish internal webhook setup", done: false }
        ]
      : [
          { label: "Create your first business", done: recentBusinesses.length > 0 },
          { label: "Assign a business phone line", done: businesses.some((business) => Boolean(business.twilioPhoneNumber)) },
          { label: "Receive your first lead", done: recentLeads.length > 0 },
          { label: "Mark a lead as contacted", done: recentLeads.some((lead) => lead.status === "contacted" || lead.status === "booked" || lead.status === "won") },
          { label: "Go live with missed-call follow-up", done: activeBusinesses > 0 }
        ]
  });
});

export default router;
