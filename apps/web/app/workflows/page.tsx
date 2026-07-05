"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../components/Badge";
import BrandMark from "../../components/BrandMark";
import { apiRequest } from "../../lib/api";
import { PaginationMeta, Workflow } from "../../lib/types";

const PAGE_SIZE = 12;

export default function PublicWorkflowsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    const pageFromUrl = Math.max(1, Number(url.searchParams.get("page") || "1") || 1);
    setCurrentPage(pageFromUrl);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    apiRequest<{ workflows: Workflow[]; pagination: PaginationMeta }>(`/workflows?page=${currentPage}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setWorkflows(res.workflows);
        setPagination(res.pagination);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load workflows"))
      .finally(() => setLoading(false));
  }, [currentPage]);

  function goToPage(page: number) {
    const targetPage = Math.max(1, page);
    setCurrentPage(targetPage);
    router.push(`${pathname}?page=${targetPage}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
          <BrandMark inverse />
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">Workflow catalog</p>
              <h1 className="mt-3 text-3xl font-black text-white">Workflow Catalog</h1>
            </div>
            <Link href="/dashboard" className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/8">
              Go to dashboard
            </Link>
          </div>
        </section>

        {loading ? <div className="rounded-2xl border border-orange-200 bg-[#f6f1e7] p-4 text-sm text-slate-600">Loading workflows...</div> : null}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

        {!loading && !error ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <Link
                  href={`/workflows/${workflow._id}`}
                  key={workflow._id}
                  className="rounded-[28px] border border-orange-200 bg-[#f6f1e7] p-4 shadow-[0_18px_50px_rgba(18,46,54,0.08)]"
                >
                  <h2 className="text-lg font-semibold text-ink">{workflow.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{workflow.previewContent?.summary || workflow.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{workflow.category}</Badge>
                    <Badge>{workflow.priceCredits} credits</Badge>
                    <Badge tone="good">Quality {workflow.previewContent?.qualityScore ?? 0}</Badge>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-[#f6f1e7] p-3">
              <p className="text-sm text-slate-600">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total workflows)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage || loading}
                  onClick={() => goToPage(pagination.page - 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => goToPage(pagination.page + 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
