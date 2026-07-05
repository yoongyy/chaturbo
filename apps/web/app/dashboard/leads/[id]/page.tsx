"use client";

import { useEffect, useState } from "react";
import LeadRescueShell from "../../../../components/LeadRescueShell";
import CopyButton from "../../../../components/CopyButton";
import { apiRequest } from "../../../../lib/api";
import type { Business, Lead, Message } from "../../../../lib/leadRescue";

type Payload = {
  lead: Lead;
  business: Business | null;
  messages: Message[];
};

const statuses: Lead["status"][] = ["new", "contacted", "booked", "won", "lost", "spam"];

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Lead["status"]>("new");
  const [urgency, setUrgency] = useState<Lead["urgency"]>("medium");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    apiRequest<Payload>(`/api/rescue/leads/${params.id}`, {}, true)
      .then((res) => {
        setData(res);
        setStatus(res.lead.status);
        setUrgency(res.lead.urgency || "medium");
        setNotes(res.lead.notes || "");
        setSummary(res.lead.summary || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load lead"));
  }, [params.id]);

  async function saveLead() {
    setSaving(true);
    setError("");
    try {
      const res = await apiRequest<{ lead: Lead }>(`/api/rescue/leads/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, urgency, notes, summary })
      }, true);
      setData((current) => (current ? { ...current, lead: res.lead } : current));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lead");
    } finally {
      setSaving(false);
    }
  }

  async function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    setError("");
    try {
      await apiRequest(`/api/rescue/leads/${params.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ body: reply, to: data?.lead.phone })
      }, true);
      setReply("");
      const refreshed = await apiRequest<Payload>(`/api/rescue/leads/${params.id}`, {}, true);
      setData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  }

  if (!data) {
    return (
      <LeadRescueShell>
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          Loading lead...
        </div>
      </LeadRescueShell>
    );
  }

  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Lead detail</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">{data.lead.phone}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {data.business?.name || "No business linked"} {data.lead.source ? `• ${data.lead.source.replace(/_/g, " ")}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={saveLead} disabled={saving} className="rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save status"}
              </button>
              <CopyButton text={data.lead.summary || ""} label="Copy summary" />
            </div>
          </div>
          {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Summary and controls</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value as Lead["status"])} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm">
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Urgency</span>
                <select
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value as Lead["urgency"])}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="emergency">emergency</option>
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Summary</span>
                <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Notes</span>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm" />
              </label>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Manual reply</h2>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={6}
              placeholder="Text a short reply to the customer..."
              className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm"
            />
            <button
              type="button"
              onClick={sendReply}
              disabled={sending}
              className="mt-3 rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send SMS reply"}
            </button>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-ink">Lead details</p>
              <p className="mt-2">City: {data.lead.city || "-"}</p>
              <p className="mt-1">Service: {data.lead.serviceNeeded || "-"}</p>
              <p className="mt-1">Callback: {data.lead.preferredCallbackTime || "-"}</p>
              <p className="mt-1">Photos: {data.lead.hasPhotos ? "Yes" : "No"}</p>
              <p className="mt-1">Opted out: {data.lead.optedOut ? "Yes" : "No"}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Conversation</h2>
            <div className="mt-4 space-y-3">
              {data.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    message.direction === "inbound" ? "bg-slate-100 text-slate-800" : "bg-ink text-white"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] opacity-70">{message.direction} {message.channel}</p>
                  <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
                  {message.mediaUrlsJson?.length ? <p className="mt-2 text-xs opacity-80">{message.mediaUrlsJson.length} media attachments</p> : null}
                </div>
              ))}
              {!data.messages.length ? <p className="text-sm text-slate-500">No messages yet.</p> : null}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Timeline</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Created: {new Date(data.lead.createdAt).toLocaleString()}</p>
              <p>Last message: {data.lead.lastMessageAt ? new Date(data.lead.lastMessageAt).toLocaleString() : "-"}</p>
              <p>Call status: {data.lead.callStatus || "-"}</p>
              <p>Owner notification: {data.lead.ownerNotificationStatus || "pending"}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-ink">Business summary</p>
              <p className="mt-2">{data.business?.name || "No business linked"}</p>
              <p className="mt-1">{data.business?.ownerMobile || "No owner number"}</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
