import { Router } from "express";
import { runDailyPublisher } from "../services/marketing/publisherService";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { sendError } from "../utils/http";

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

export default router;
