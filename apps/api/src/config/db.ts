import mongoose from "mongoose";
import { getEnv } from "./env";

let connected = false;

export async function connectDb(): Promise<void> {
  if (connected) {
    return;
  }

  const env = getEnv();
  await mongoose.connect(env.MONGODB_URI);
  connected = true;
  console.log("MongoDB connected");
}
