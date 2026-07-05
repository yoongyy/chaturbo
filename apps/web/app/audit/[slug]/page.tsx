import Link from "next/link";
import { notFound } from "next/navigation";
import type { Audit, AuditTarget } from "../../../lib/leadRescue";

async function getAudit(slug: string): Promise<{ audit: Audit; target: AuditTarget | null } | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(`${base}/api/rescue/audits/public/${slug}`, { cache: "no-store" });
  if (!response.ok) return null;
  return response.json();
}

export default async function PublicAuditPage({ params }: { params: { slug: string } }) {
  const data = await getAudit(params.slug);
  if (!data) notFound();

  const { audit, target } = data;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(29,122,107,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(233,106,65,0.12),_transparent_30%),linear-gradient(180deg,_#07111b_0%,_#0f1724_22%,_#f6f1e7_22%,_#f6f1e7_100%)] px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[34px] border border-slate-200 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chaturbo Lead Rescue</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">Lead Rescue Audit for {target?.businessName || "This business"}</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600">{audit.summary}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[28px] bg-slate-950 p-6 text-white">
              <h2 className="text-xl font-semibold">Key problems</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {audit.problemsJson.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-ink">What happens when they miss a call</h2>
              <p className="mt-3 text-sm text-slate-600">
                With Chaturbo Lead Rescue, the caller gets a fast text-back, the owner gets a clean job summary, and urgent leads get pushed forward before the customer books elsewhere.
              </p>
              <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-slate-700 shadow-sm">
                <p className="font-semibold text-ink">Suggested next step</p>
                <p className="mt-2">Book setup or reply to the email that sent this audit.</p>
                <p className="mt-2">Call Kenny if you want the demo walked through live.</p>
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Business details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-sm text-slate-600">
              <p>Industry: {target?.industry || "-"}</p>
              <p>City: {target?.city || "-"}</p>
              <p>State: {target?.state || "-"}</p>
              <p>Website: {target?.websiteUrl || "-"}</p>
              <p>Owner: {target?.ownerName || "-"}</p>
              <p>Phone: {target?.phone || "-"}</p>
            </div>
          </section>

          <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink">Demo explanation</h2>
            <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{audit.videoScript}</p>
          </section>

          <section className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white">
              Book setup
            </Link>
            <a href={`mailto:${target?.email || ""}`} className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Reply to email
            </a>
            <a href="tel:+12125550199" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Call Kenny
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
