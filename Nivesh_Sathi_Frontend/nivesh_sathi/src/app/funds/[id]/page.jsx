"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FundChat from "../../../components/fund-chat/FundChat";

// =======================
// SVG Performance Chart
// =======================
function PerformanceChart({ fund }) {
  if (!fund) return null;

  const data = [
    { label: "5Y", value: Number(fund.returns_5yr) || 0 },
    { label: "3Y", value: Number(fund.returns_3yr) || 0 },
    { label: "1Y", value: Number(fund.returns_1yr) || 0 },
  ];

  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 20;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const xScale = (i) =>
    paddingX + (i / (data.length - 1 || 1)) * (width - paddingX * 2);
  const yScale = (v) =>
    height -
    paddingY -
    ((v - min) / (max - min || 1)) * (height - paddingY * 2);

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.value)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${xScale(data.length - 1)} ${height - paddingY}` +
    ` L ${xScale(0)} ${height - paddingY} Z`;

  const numTicks = 5;
  const ticks = Array.from({ length: numTicks }, (_, i) => {
    const value = min + (i / (numTicks - 1)) * (max - min);
    return { value, y: yScale(value) };
  });

  return (
    <div className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/60 p-4 md:p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-800">
          Rolling Performance (CAGR)
        </h3>
        <span className="text-[11px] text-slate-400">
          Modelled 1Y / 3Y / 5Y returns
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-60"
        aria-hidden="true"
      >
        {/* Y-axis */}
        <line
          x1={paddingX}
          y1={paddingY}
          x2={paddingX}
          y2={height - paddingY}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
        {/* Y-axis ticks & grid */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={paddingX}
              y1={tick.y}
              x2={width - paddingX}
              y2={tick.y}
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.12"
            />
            <text
              x={paddingX - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-slate-500 text-[10px]"
            >
              {tick.value.toFixed(1)}%
            </text>
          </g>
        ))}

        {/* X-axis */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
        {data.map((d, i) => (
          <text
            key={d.label}
            x={xScale(i)}
            y={height - 4}
            textAnchor="middle"
            className="fill-slate-500 text-[10px]"
          >
            {d.label}
          </text>
        ))}

        {/* Area & line */}
        <path d={areaD} className="fill-emerald-200/60" />
        <path
          d={pathD}
          className="stroke-emerald-600 stroke-[3]"
          fill="none"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={d.label}>
            <circle
              cx={xScale(i)}
              cy={yScale(d.value)}
              r="4"
              className="fill-emerald-600"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

// =======================
// Return Tile
// =======================
function ReturnTile({ label, value }) {
  const display =
    value === null || value === undefined || value === ""
      ? "—"
      : value.toString().includes("%")
      ? value
      : `${value}%`;

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center border border-slate-100">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-emerald-600">{display}</p>
    </div>
  );
}

// =======================
// Detail Row
// =======================
function DetailRow({ label, value }) {
  return (
    <p className="flex justify-between text-xs text-slate-600 py-0.5">
      <span>{label}</span>
      <span className="font-semibold text-slate-900 truncate max-w-[55%] text-right">
        {value || "—"}
      </span>
    </p>
  );
}

// =======================
// Main Fund Details Page
// =======================
export default function FundDetailsPage() {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFund() {
      try {
        const res = await fetch("/api/funds");
        const data = await res.json();
        const allFunds = Array.isArray(data.funds) ? data.funds : [];
        const found = allFunds.find((f) => f.id === id);
        setFund(found || null);
      } catch (e) {
        console.error("Failed to load fund", e);
        setFund(null);
      } finally {
        setLoading(false);
      }
    }
    loadFund();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="h-8 w-40 rounded-full bg-slate-200 animate-pulse mb-4" />
          <div className="h-40 rounded-3xl bg-slate-200/60 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!fund) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="rounded-3xl bg-white border border-slate-200 px-6 py-8 shadow-sm">
            <p className="text-sm text-slate-600 mb-1">
              Fund not found or data unavailable.
            </p>
            <p className="text-xs text-slate-400">
              Please go back to the recommendations page and choose another
              scheme.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const returns = [
    Number(fund.returns_1yr) || 0,
    Number(fund.returns_3yr) || 0,
    Number(fund.returns_5yr) || 0,
  ];
  const avgReturn =
    returns.reduce((sum, v) => sum + v, 0) / (returns.length || 1);
  const bestHorizon = ["1 Year", "3 Years", "5 Years"][
    returns.indexOf(Math.max(...returns))
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-wide uppercase text-emerald-600 mb-1">
              Fund Overview
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              {fund.scheme_name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {fund.amc_name} • {fund.category} •{" "}
              {fund.risk_level ? `${fund.risk_level} risk` : "Risk data NA"}
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
              <span className="text-[11px] font-medium text-emerald-700">
                Live fund snapshot
              </span>
            </div>
            <div>
              <p className="text-[11px] uppercase text-slate-400">Fund Size</p>
              <p className="text-lg font-semibold text-slate-900">
                {fund.fund_size_cr} Cr
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* LEFT column - performance + AI analysis under graph */}
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Performance Snapshot
              </h2>
              <span className="text-[11px] text-slate-400">
                Returns are trailing and may vary
              </span>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-3">
              <ReturnTile label="1 Year" value={fund.returns_1yr} />
              <ReturnTile label="3 Years" value={fund.returns_3yr} />
              <ReturnTile label="5 Years" value={fund.returns_5yr} />
            </div>

            <PerformanceChart fund={fund} />

            {/* AI Fund Analysis moved here under the graph */}
            <div className="mt-6 rounded-3xl bg-slate-50/60 p-5 border border-slate-100">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Fund Analysis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Across 1, 3 and 5 years, this scheme delivered an average return
                of{" "}
                <span className="font-semibold text-emerald-600">
                  {avgReturn.toFixed(1)}%
                </span>
                , with the strongest performance over{" "}
                <span className="font-semibold text-slate-900">
                  {bestHorizon}
                </span>
                . A Sharpe ratio of{" "}
                <span className="font-semibold">{fund.sharpe}</span> and alpha
                of{" "}
                <span className="font-semibold">{fund.alpha}</span> suggest
                better risk-adjusted performance versus its benchmark. This may
                suit investors comfortable with{" "}
                {fund.risk_level?.toLowerCase() || "moderate"} risk and a{" "}
                <span className="font-semibold">multi‑year horizon</span>.
              </p>
            </div>
          </section>

          {/* RIGHT column - facts + AI assistant */}
          <section className="space-y-4">
            {/* Fund Facts */}
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Fund Facts
              </h3>
              <div className="space-y-1.5">
                <DetailRow label="AMC" value={fund.amc_name} />
                <DetailRow label="Category" value={fund.category} />
                <DetailRow label="Sub Category" value={fund.sub_category} />
                <DetailRow label="Fund Age (years)" value={fund.fund_age_yr} />
                <DetailRow label="Fund Manager" value={fund.fund_manager} />
                <DetailRow
                  label="Expense Ratio"
                  value={
                    fund.expense_ratio !== undefined
                      ? `${fund.expense_ratio}%`
                      : null
                  }
                />
                <DetailRow label="Sharpe" value={fund.sharpe} />
                <DetailRow label="Alpha" value={fund.alpha} />
                <DetailRow label="Beta" value={fund.beta} />
              </div>
            </div>

            {/* AI Assistant */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50/60 p-5 shadow-sm border border-slate-100">
              <h3 className="mb-2 text-sm font-semibold text-slate-900 ">
                Ask AI about this fund
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Use the assistant to ask questions about risks, suitability, and
                how this scheme fits into your overall investment plan.
              </p>
              <FundChat fund={fund} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
