import express from "express";
import cors from "cors";
import morgan from "morgan";
import { getEnv } from "./config/env";
import { connectDb } from "./config/db";
import authRoutes from "./routes/authRoutes";
import scanRoutes from "./routes/scanRoutes";
import workflowDraftRoutes from "./routes/workflowDraftRoutes";
import workflowRoutes from "./routes/workflowRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser requests may omit Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.use((_req, res, next) => {
  try {
    getEnv();
    return next();
  } catch (error) {
    console.error("Environment configuration error", error);
    return res.status(500).json({ error: "Invalid server environment configuration" });
  }
});

// Serverless-safe DB bootstrap: connect lazily per invocation and fail gracefully.
app.use(async (_req, res, next) => {
  try {
    await connectDb();
    return next();
  } catch (error) {
    console.error("Database connection failed", error);
    return res.status(500).json({ error: "Database unavailable" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "chaturbo-api" });
});

app.use("/auth", authRoutes);
app.use("/scan", scanRoutes);
app.use("/workflow-drafts", workflowDraftRoutes);
app.use("/workflows", workflowRoutes);

app.use(errorHandler);

export default app;
