import BrandMark from "../../components/BrandMark";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(229,106,65,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(29,122,107,0.12),_transparent_26%),linear-gradient(180deg,_#08111a_0%,_#0e1724_36%,_#f6f1e7_36%,_#f6f1e7_100%)] px-4 py-6">
      <section className="mx-auto max-w-3xl rounded-[34px] border border-slate-800 bg-[linear-gradient(180deg,_rgba(15,23,42,0.98)_0%,_rgba(7,12,20,0.96)_100%)] p-6 text-white shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8">
        <BrandMark inverse />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-orange-400">Privacy</p>
        <h1 className="font-display mt-3 text-4xl font-black text-white">Privacy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Placeholder privacy policy for the MVP. Add your final data handling and compliance copy before launch.
        </p>
      </section>
    </main>
  );
}
