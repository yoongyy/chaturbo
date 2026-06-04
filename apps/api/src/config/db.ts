import mongoose from "mongoose";

let connected = false;
let connectionAttempted = false;

export async function connectDb(): Promise<void> {
  if (connected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
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
