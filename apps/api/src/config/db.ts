import mongoose from "mongoose";
import dns from "dns";

try {
  // Configure standard Google DNS servers globally to resolve Atlas SRV records
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("Failed to set DNS servers globally", e);
}

let connected = false;
let connectionAttempted = false;

export async function connectDb(): Promise<void> {
  if (connected) {
    return;
  }

  const rawUri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL;
  const mongoUri = (rawUri && !rawUri.includes("<user>")) ? rawUri : (process.env.MONGO_URI || "");
  console.log(`[connectDb] rawUri: ${rawUri ? rawUri.replace(/:([^@]+)@/, ":****@") : "undefined"}, mongoUri: ${mongoUri ? mongoUri.replace(/:([^@]+)@/, ":****@") : "undefined"}`);
  if (!mongoUri) {
    console.warn("[connectDb] No connection URI resolved.");
    return;
  }

  if (connectionAttempted) {
    return;
  }

  connectionAttempted = true;

  await mongoose.connect(mongoUri);
  connected = true;
  console.log("MongoDB connected");
}
