// src/components/fund-analytics/FundCard.jsx
import Link from "next/link";
import { MoveUpRight } from "lucide-react";
export default function FundCard({ fund, classNames }) {
  const riskLabel = fund.risk_level || "Unknown";

  const riskColor =
    riskLabel === "High"
      ? "bg-rose-50 text-rose-500"
      : riskLabel === "Medium"
      ? "bg-amber-50 text-amber-500"
      : riskLabel === "Low"
      ? "bg-emerald-50 text-emerald-500"
      : "bg-slate-100 text-slate-500";

  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
      {/* Title + risk */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 leading-snug">
            {fund.scheme_name}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{fund.amc_name}</p>
        </div>
        <span
          className={classNames(
            "rounded-full px-3 py-1 text-[11px] font-medium",
            riskColor
          )}
        >
          {riskLabel}
        </span>
      </div>

      {/* Categories */}
      <div className="mb-3 flex flex-wrap gap-2">
        {fund.category && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
            {fund.category}
          </span>
        )}
        {fund.sub_category && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
            {fund.sub_category}
          </span>
        )}
      </div>

      {/* Returns */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <ReturnPill label="1Y" value={fund.returns_1yr} />
        <ReturnPill label="3Y" value={fund.returns_3yr} />
        <ReturnPill label="5Y" value={fund.returns_5yr} />
      </div>

      {/* Metrics */}
      <div className="mb-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-500">
        <Metric label="Expense" value={fund.expense_ratio} />
        <Metric label="Fund size (Cr)" value={fund.fund_size_cr} />
        <Metric label="Sharpe" value={fund.sharpe} />
        <Metric label="Alpha" value={fund.alpha} />
      </div>

      {/* Manager + rating */}
      <div className="mt-auto flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate">
          Manager:{" "}
          <span className="font-semibold text-slate-800">
            {fund.fund_manager}
          </span>
        </span>
        {fund.rating && (
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
            ★ {fund.rating}
          </span>
        )}
      </div>

      {/* View details link */}
      <Link
        href={`/funds/${fund.id}`}
        className=" flex mt-3 block w-full rounded-2xl border border-slate-200 bg-slate-900/90 px-26 py-2 text-center text-xs font-medium text-white hover:bg-slate-900"
      >
        View Details <MoveUpRight size={20} color="#009966" strokeWidth={2.25} />

      </Link>
    </article>
  );
}

function ReturnPill({ label, value }) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : value.toString().includes("%")
      ? value
      : `${value}%`;

  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-600">
        {display}
      </p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <span>
      {label}:{" "}
      <span className="font-semibold text-slate-800">
        {value || "—"}
      </span>
    </span>
  );
}
