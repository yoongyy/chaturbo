import mongoose from "mongoose";
import { env } from "./env";

let connected = false;

export async function connectDb(): Promise<void> {
  if (connected) {
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  connected = true;
  console.log("MongoDB connected");
}
