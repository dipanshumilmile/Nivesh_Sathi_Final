
export default function GlossaryCard({ term, definition }) {
  return (
    <article className="rounded-2xl bg-white border border-slate-100 px-5 py-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{term}</h3>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
        {definition}
      </p>
    </article>
  );
}
