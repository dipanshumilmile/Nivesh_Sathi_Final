export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <header className="mb-6">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
