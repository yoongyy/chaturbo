"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Badge from "../../components/Badge";
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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Workflow Catalog</h1>
        <Link href="/dashboard" className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          Go to dashboard
        </Link>
      </div>

      {loading ? <div className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">Loading workflows...</div> : null}
      {error ? <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <Link href={`/workflows/${workflow._id}`} key={workflow._id} className="card p-4">
                <h2 className="text-lg font-semibold">{workflow.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{workflow.previewContent?.summary || workflow.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{workflow.category}</Badge>
                  <Badge>{workflow.priceCredits} credits</Badge>
                  <Badge tone="good">Quality {workflow.previewContent?.qualityScore ?? 0}</Badge>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
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
    </main>
  );
}
