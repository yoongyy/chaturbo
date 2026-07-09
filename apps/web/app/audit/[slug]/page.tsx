import Link from "next/link";
import { notFound } from "next/navigation";
import clientPromise from "../../../lib/mongodb";

async function getAudit(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const audit = await db.collection("audits").findOne({ slug });
    if (!audit) return null;

    const target = await db.collection("audittargets").findOne({ _id: audit.auditTargetId });

    // Increment view count (fire and forget)
    db.collection("audittargets").updateOne(
      { _id: audit.auditTargetId },
      { $inc: { viewsCount: 1 }, $set: { lastViewedAt: new Date() } }
    ).catch(() => {});

    return {
      audit: {
        ...audit,
        id: audit._id.toString(),
        problemsJson: audit.problemsJson || [],
        recommendationsJson: audit.recommendationsJson || [],
        videoScript: audit.videoScript || "",
        summary: audit.summary || "",
        videoUrl: audit.videoUrl || "",
      },
      target: target ? {
        ...target,
        id: target._id.toString(),
        businessName: target.businessName || "",
        industry: target.industry || "",
        city: target.city || "",
        state: target.state || "",
        websiteUrl: target.websiteUrl || "",
        ownerName: target.ownerName || "",
        phone: target.phone || "",
        email: target.email || "",
      } : null
    };
  } catch {
    return null;
  }
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

          {audit.videoUrl && (
            <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 shadow-[0_20px_50px_rgba(15,23,42,0.15)] relative aspect-video">
              <video
                src={audit.videoUrl}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[28px] bg-slate-950 p-6 text-white">
              <h2 className="text-xl font-semibold">Key problems</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {audit.problemsJson.map((item: string) => (
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
                <p className="mt-2">Reply to the email that sent this audit, or book a quick call below.</p>
                <p className="mt-2">Kenny will set up a free test number for your line — no commitment.</p>
              </div>
            </section>
          </div>

          {!audit.videoUrl && audit.videoScript && (
            <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-ink">What we found</h2>
              <p className="mt-3 text-sm text-slate-600 whitespace-pre-wrap">{audit.videoScript}</p>
            </section>
          )}

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

          <section className="mt-8 flex flex-wrap gap-3">
            <a
              href="mailto:mail@chaturbo.com?subject=I want the free test number"
              className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white"
            >
              Reply YES — Get Free Test Number
            </a>
            <a href="https://chaturbo.com/free-audit" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700">
              Request a Full Audit
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
