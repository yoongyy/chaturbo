import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-6">
        <div>
          <p className="text-lg font-semibold text-ink">Chaturbo</p>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Your AI agent already solved valuable problems. Chaturbo helps you convert them into reusable workflow assets.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Raw conversations stay local. Only sanitized workflow drafts are uploaded after your approval.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">Product</p>
            <Link href="/" className="block text-slate-600 hover:text-slate-900">Home</Link>
            <Link href="/workflows" className="block text-slate-600 hover:text-slate-900">Workflow Catalog</Link>
            <Link href="/dashboard" className="block text-slate-600 hover:text-slate-900">Owner Dashboard</Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">Account</p>
            <Link href="/login" className="block text-slate-600 hover:text-slate-900">Login</Link>
            <Link href="/register" className="block text-slate-600 hover:text-slate-900">Register</Link>
            <a href="https://api.chaturbo.com/health" className="block text-slate-600 hover:text-slate-900">API Health</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Chaturbo. MVP portal.
      </div>
    </footer>
  );
}
