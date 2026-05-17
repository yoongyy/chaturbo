import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-12">
      <div className="card p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-mint">Chaturbo MVP</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
          Your AI agent already solved valuable problems.
          <br />
          Chaturbo helps you turn them into reusable workflow assets.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-slate-600">
          Raw conversations stay local. Only sanitized workflow drafts are uploaded after your approval.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="rounded-xl bg-mint px-5 py-3 text-white">
            Create account
          </Link>
          <Link href="/login" className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700">
            Login
          </Link>
          <Link href="/workflows" className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700">
            Browse workflows
          </Link>
        </div>
      </div>
    </main>
  );
}
