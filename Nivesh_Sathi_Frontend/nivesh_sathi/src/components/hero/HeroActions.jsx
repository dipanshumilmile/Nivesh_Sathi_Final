import Link from "next/link";

export default function HeroActions() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <Link
        href="/ai-recommendation"
        className="rounded-lg bg-emerald-500 px-6 py-3 text-white font-medium hover:bg-emerald-600 transition"
      >
        Get AI Recommendations →
      </Link>

      <Link
        href="/fund-analytics"
        className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Explore Funds 📊
      </Link>
    </div>
  );
}
