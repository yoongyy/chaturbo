import { Router } from "express";
import mongoose from "mongoose";
import { runDailyPublisher } from "../services/marketing/publisherService";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { sendError } from "../utils/http";
import { sendEmail } from "../services/leadRescue/communications";

const router = Router();

// Expose trigger endpoint. Secured with auth and admin middleware.
router.post("/publish-daily", requireAuth, requireAdmin, async (req, res) => {
  try {
    const topic = req.body?.topic ? String(req.body.topic) : undefined;
    const result = await runDailyPublisher(topic);
    
    if (!result.success) {
      return sendError(res, 500, result.message);
    }
    
    return res.json({
      ok: true,
      message: result.message,
      post: result.post,
      imagePath: result.imagePath,
      ayrshareResponse: result.ayrshareResponse
    });
  } catch (error) {
    console.error("Daily publisher route error:", error);
    return sendError(res, 500, error instanceof Error ? error.message : "Internal Server Error");
  }
});

// Public: Submit agency white-label partner application
router.post("/agency/apply", async (req, res) => {
  try {
    const { agencyName, email } = req.body as { agencyName?: string; email?: string };
    
    if (!agencyName || !email) {
      return sendError(res, 400, "Agency name and email are required");
    }

    console.log(`[Agency Apply] New application: Name=${agencyName}, Email=${email}`);

    // Save directly to MongoDB collection
    const db = mongoose.connection.db;
    if (db) {
      await db.collection("agencypartners").updateOne(
        { email: email.toLowerCase() },
        { 
          $set: { 
            agencyName, 
            status: "pending", 
            updatedAt: new Date() 
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    }

    // Send email alert to Admin
    const emailResult = await sendEmail(
      process.env.ADMIN_EMAIL || "yoongyy@gmail.com",
      `🚀 New White-label Agency Partner Application: ${agencyName}`,
      `
        <h3>New Agency Partner Application</h3>
        <p><strong>Agency Name:</strong> ${agencyName}</p>
        <p><strong>Work Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Received At:</strong> ${new Date().toISOString()}</p>
      `
    );

    return res.json({
      ok: true,
      message: "Application submitted successfully",
      emailAlertStatus: emailResult.ok ? "sent" : "mocked"
    });
  } catch (error) {
    console.error("Agency apply route error:", error);
    return sendError(res, 500, error instanceof Error ? error.message : "Internal Server Error");
  }
});

export default router;
