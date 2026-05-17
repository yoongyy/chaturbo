import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { connectDb } from "./config/db";
import authRoutes from "./routes/authRoutes";
import scanRoutes from "./routes/scanRoutes";
import workflowDraftRoutes from "./routes/workflowDraftRoutes";
import workflowRoutes from "./routes/workflowRoutes";
import { errorHandler } from "./middleware/errorHandler";

async function bootstrap() {
  await connectDb();

  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "chaturbo-api" });
  });

  app.use("/auth", authRoutes);
  app.use("/scan", scanRoutes);
  app.use("/workflow-drafts", workflowDraftRoutes);
  app.use("/workflows", workflowRoutes);

  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
