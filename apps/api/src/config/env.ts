import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  MONGO_URI: z.string().optional(),
  JWT_SECRET: z.string().default("dev-secret-chaturbo-lead-rescue"),
  NEXTAUTH_SECRET: z.string().optional(),
  APP_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  APP_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_MESSAGING_SERVICE_SID: z.string().optional(),
  TWILIO_DEFAULT_FROM_NUMBER: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  HEYGEN_API_KEY: z.string().optional(),
  TAVUS_API_KEY: z.string().optional()
});

type Env = z.infer<typeof schema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = schema.safeParse({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    MONGODB_URI: process.env.MONGODB_URI ?? process.env.MONGO_URI,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    APP_URL: process.env.APP_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    APP_BASE_URL: process.env.APP_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_MESSAGING_SERVICE_SID: process.env.TWILIO_MESSAGING_SERVICE_SID,
    TWILIO_DEFAULT_FROM_NUMBER: process.env.TWILIO_DEFAULT_FROM_NUMBER,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    HEYGEN_API_KEY: process.env.HEYGEN_API_KEY,
    TAVUS_API_KEY: process.env.TAVUS_API_KEY
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment variables: ${JSON.stringify(fieldErrors)}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
