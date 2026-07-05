"use client";

import LeadRescueShell from "../../../components/LeadRescueShell";
import CopyButton from "../../../components/CopyButton";

const webhookPaths = [
  "/api/twilio/voice/incoming",
  "/api/twilio/voice/status",
  "/api/twilio/sms/incoming"
];

export default function SettingsPage() {
  const appUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-ink">Settings</h1>
          <p className="mt-2 text-sm text-slate-500">Demo instructions, webhook URLs, and billing placeholders.</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Demo instructions</h2>
            <ol className="mt-4 space-y-2 text-sm text-slate-600">
              <li>1. Create or open the Demo Roofing Company.</li>
              <li>2. Assign a Twilio number to the business.</li>
              <li>3. Set ngrok or your public URL as the webhook destination.</li>
              <li>4. Call the number and let the owner miss the forwarded call.</li>
              <li>5. Reply to the text and watch the lead appear in the inbox.</li>
            </ol>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Webhook URLs</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {webhookPaths.map((path) => (
                <div key={path} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="font-mono text-xs text-slate-700">{`${appUrl}${path}`}</span>
                  <CopyButton text={`${appUrl}${path}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Billing placeholders</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Setup: $500-$997 one-time</p>
              <p>Monthly: $149/month</p>
              <p>Agency wholesale: $49/month per business</p>
              <p>Manual billing is fine for MVP; mark payment status in each business record.</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Compliance reminders</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Only text people who called or messaged the business.</p>
              <p>Include STOP/UNSTOP handling in the first message.</p>
              <p>Do not use cold SMS blasting.</p>
              <p>Use truthful messaging and applicable email rules for outreach.</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
