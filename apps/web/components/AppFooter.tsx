import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="mt-12 border-t border-black/5 bg-white/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_0.7fr_0.8fr] md:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Chaturbo</p>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            We build done-for-you AI employees for Malaysian SMEs that handle replies, lead capture, follow-ups, quotations, and admin automation.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
            Free pilot for the first 10 KL/Selangor SMEs
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold text-slate-800">Pages</p>
          <Link href="/" className="block text-slate-600 hover:text-ink">
            Home
          </Link>
          <Link href="/demo" className="block text-slate-600 hover:text-ink">
            Demo
          </Link>
          <Link href="/apply" className="block text-slate-600 hover:text-ink">
            Apply
          </Link>
          <Link href="/contact" className="block text-slate-600 hover:text-ink">
            Contact
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">Contact</p>
            <a href="mailto:hello@chaturbo.com" className="block text-slate-600 hover:text-ink">
              hello@chaturbo.com
            </a>
            <p className="text-slate-600">Kuala Lumpur, Malaysia</p>
            <p className="text-slate-600">WhatsApp: +60 XX XXX XXXX</p>
          </div>
        </div>
      </div>
      <div className="border-t border-black/5 py-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Chaturbo. AI employee agency for SMEs.
      </div>
    </footer>
  );
}
