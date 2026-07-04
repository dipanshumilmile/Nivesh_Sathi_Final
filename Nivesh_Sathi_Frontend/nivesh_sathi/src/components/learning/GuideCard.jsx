import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GuideCard({ icon, title, level, readTime, bullets, href }) {
  return (
    <article className="rounded-3xl bg-white border border-slate-100 shadow-sm px-6 py-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="rounded-full border border-slate-200 px-2 py-0.5">
            {level}
          </span>
          <span className="rounded-full border border-slate-200 px-2 py-0.5">
            {readTime}
          </span>
        </div>
      </div>

      <ul className="mt-1 space-y-1.5 text-sm text-slate-600">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 text-emerald-500">›</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Read guide
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 self-start text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Read guide
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </article>
  );
}
