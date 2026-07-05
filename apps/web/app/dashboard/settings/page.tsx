"use client";

import LeadRescueShell from "../../../components/LeadRescueShell";

export default function SettingsPage() {
  return (
    <LeadRescueShell>
      <div className="space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-ink">Help</h1>
          <p className="mt-2 text-sm text-slate-500">Simple instructions for using the dashboard without touching technical setup.</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Daily workflow</h2>
            <ol className="mt-4 space-y-2 text-sm text-slate-600">
              <li>1. Add the business name, owner contact, and service area.</li>
              <li>2. Connect the business phone line.</li>
              <li>3. When a call is missed, check the Lead Inbox.</li>
              <li>4. Open the lead, review the summary, and call or text the customer back.</li>
              <li>5. Mark the lead as contacted or booked when the job moves forward.</li>
            </ol>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">What users should see</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Business name, owner contact, phone line, service area, and lead status.</p>
              <p>Plain-English service descriptions like &quot;Roof repair&quot; or &quot;AC replacement&quot;.</p>
              <p>A short lead summary the owner can understand in seconds.</p>
              <p>Simple buttons like Add Business, Open Lead Inbox, and Log Out.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">What users should not see</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Webhook URLs.</p>
              <p>API hosts and environment variables.</p>
              <p>JSON fields for services or opening hours.</p>
              <p>Technical vendor IDs unless an internal admin truly needs them.</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <h2 className="text-xl font-semibold text-ink">Compliance reminders</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Only text people who called or messaged the business.</p>
              <p>Give the customer a clear way to stop messages.</p>
              <p>Do not use cold SMS blasting.</p>
              <p>Keep the message honest, short, and helpful.</p>
            </div>
          </div>
        </section>
      </div>
    </LeadRescueShell>
  );
}
