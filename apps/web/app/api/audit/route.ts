import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";

type AuditSubmission = {
  companyName: string;
  ownerName: string;
  email: string;
  trade: string;
  phone: string;
  website: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "\"":
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function parseAuditSubmission(body: unknown): AuditSubmission | null {
  const payload = body as Record<string, unknown>;
  const companyName = asString(payload.companyName);
  const ownerName = asString(payload.ownerName);
  const email = asString(payload.email);
  const trade = asString(payload.trade);
  const phone = asString(payload.phone);
  const website = asString(payload.website);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (companyName.length < 2 || ownerName.length < 2 || trade.length < 2 || phone.length < 5 || website.length < 5 || !emailOk) {
    return null;
  }

  return {
    companyName,
    ownerName,
    email,
    trade,
    phone,
    website
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid audit payload." }, { status: 400 });
  }

  const submission = parseAuditSubmission(body);
  if (!submission) {
    return NextResponse.json({ error: "Please complete the audit form with valid details." }, { status: 400 });
  }

  const client = getResendClient();
  if (!client) {
    return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
  }

  const from = process.env.FROM_EMAIL?.trim() || "Chaturbo Lead Rescue <mail@chaturbo.com>";
  const subject = `New Missed-Call Audit: ${submission.companyName}`;
  const text = [
    "New audit request received.",
    `Company: ${submission.companyName}`,
    `Owner: ${submission.ownerName}`,
    `Email: ${submission.email}`,
    `Trade: ${submission.trade}`,
    `Phone: ${submission.phone}`,
    `Website: ${submission.website}`
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px">
      <div style="max-width:640px;margin:0 auto;background:#111827;border:1px solid #334155;border-radius:20px;padding:24px">
        <p style="margin:0 0 16px;color:#fb923c;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:12px">New Missed-Call Audit</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;color:#ffffff">Audit form submission</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7">
          <tr><td style="padding:6px 0;color:#94a3b8;width:140px">Company</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.companyName)}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Owner</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.ownerName)}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Email</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.email)}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Trade</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.trade)}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Phone</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.phone)}</td></tr>
          <tr><td style="padding:6px 0;color:#94a3b8">Website</td><td style="padding:6px 0;color:#ffffff">${escapeHtml(submission.website)}</td></tr>
        </table>
      </div>
    </div>
  `;

  const result = await client.emails.send({
    from,
    to: "mail@chaturbo.com",
    replyTo: submission.email,
    subject,
    text,
    html
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message || "Failed to send audit email." }, { status: 400 });
  }

  return NextResponse.json({ success: true, id: result.data?.id });
}
