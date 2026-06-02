"use client";

import { useState, useMemo, useRef } from "react";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function RiskSimulatorPage() {
  const [risk, setRisk] = useState(60);          // 0–100
  const [tenure, setTenure] = useState(6);       // 1–50 years
  const [amount, setAmount] = useState(1000000); // in rupees

  const { expectedReturn, minReturn, maxReturn } = useMemo(() => {
    const base = 6; // conservative base
    const extra = (risk / 100) * 12; // up to +12%
    const mid = base + extra;        // 6–18% p.a.
    return {
      expectedReturn: mid,
      minReturn: mid - 5,
      maxReturn: mid + 5,
    };
  }, [risk]);

  // Build projection data (0..tenure)
  const projection = useMemo(() => {
    const rows = [];
    let base = amount;
    let low = amount;
    let high = amount;

    for (let year = 0; year <= tenure; year++) {
      if (year > 0) {
        base = base * (1 + expectedReturn / 100);
        low = low * (1 + minReturn / 100);
        high = high * (1 + maxReturn / 100);
      }
      rows.push({ year, base, low, high });
    }
    return rows;
  }, [amount, tenure, expectedReturn, minReturn, maxReturn]);

  const last = projection[projection.length - 1];
  const totalGain = last.base - amount;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Controls */}
        <section className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Risk */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Risk Tolerance
              </p>
              <input
                type="range"
                min={0}
                max={100}
                value={risk}
                onChange={(e) => setRisk(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-semibold">
                {risk}% risk score
              </p>
            </div>

            {/* Tenure */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Investment Tenure
              </p>
              <input
                type="range"
                min={1}
                max={50}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 year</span>
                <span>50 years</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-semibold">
                {tenure} years
              </p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Investment Amount
              </p>
              <input
                type="range"
                min={10000}
                max={10000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹10K</span>
                <span>₹100L</span>
              </div>
              <p className="mt-1 text-xs text-emerald-600 font-semibold">
                {formatINR(amount)}
              </p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-4 mt-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3">
              <p className="text-[11px] text-slate-400 mb-1">Risk Profile</p>
              <p className="text-sm font-semibold text-slate-900">
                {risk < 35
                  ? "Conservative"
                  : risk < 70
                  ? "Balanced"
                  : "Aggressive"}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Large / Multi Cap Equity
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-4 py-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Expected Return
              </p>
              <p className="text-lg font-semibold text-emerald-700">
                +{expectedReturn.toFixed(1)}% p.a.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] text-slate-400 mb-1">
                Projected Value
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formatINR(last.base)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
              <p className="text-[11px] text-slate-300 mb-1">Total Gain</p>
              <p className="text-lg font-semibold text-emerald-300">
                +{formatINR(totalGain)}
              </p>
            </div>
          </div>
        </section>

        {/* Graph */}
        <section className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100">
          <GrowthChart projection={projection} />
        </section>
      </div>
    </main>
  );
}

// INTERACTIVE SVG GROWTH CHART
function GrowthChart({ projection }) {
  const svgRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, projection.length - 1)
  );

  const width = 900;
  const height = 260;
  const paddingX = 60;
  const paddingY = 30;

  const maxValue = Math.max(...projection.map((p) => p.high));
  const years = projection.length - 1;

  const xScale = (year) =>
    paddingX + (year / (years || 1)) * (width - paddingX * 2);

  const yScale = (v) =>
    height -
    paddingY -
    (v / (maxValue || 1)) * (height - paddingY * 2);

  const linePath = projection
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p.base)}`)
    .join(" ");

  const upperPath = projection
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p.high)}`)
    .join(" ");
  const lowerPath = projection
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(p.year)} ${yScale(p.low)}`
    )
    .join(" ");

  const bandPath =
    upperPath +
    projection
      .slice()
      .reverse()
      .map(
        (p, i) =>
          ` L ${xScale(p.year)} ${yScale(
            projection[projection.length - 1 - i].low
          )}`
      )
      .join("") +
    " Z";

  const focus = projection[selectedIndex];

  // tooltip X position (kept inside graph)
  let tooltipStyle = {};
  if (svgRef.current && focus) {
    const x = xScale(focus.year) / width; // 0–1
    const leftPercent = Math.min(0.88, Math.max(0.12, x));
    tooltipStyle = { left: `${leftPercent * 100}%` };
  }

  const handleClickIndex = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-3">
        <p className="text-sm font-semibold text-slate-800">
          Projected Growth
        </p>
        <p className="text-[11px] text-slate-400">
          Tap any year to view best / expected / worst values
        </p>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-64 cursor-pointer"
        aria-hidden="true"
      >
        {/* Y grid + labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const y =
            paddingY +
            ((height - paddingY * 2) / 4) * i;
          const value =
            maxValue - (maxValue / 4) * i;
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px]"
              >
                {formatINR(value)}
              </text>
            </g>
          );
        })}

        {/* X axis */}
        <line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* band */}
        <path d={bandPath} fill="#a7f3d055" />

        {/* high & low dashed */}
        <path
          d={upperPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d={lowerPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* main line */}
        <path
          d={linePath}
          fill="none"
          stroke="#059669"
          strokeWidth="3"
        />

        {/* points + labels + click areas */}
        {projection.map((p, i) => (
          <g key={p.year} onClick={() => handleClickIndex(i)}>
            {/* vertical line for selected year */}
            {i === selectedIndex && (
              <line
                x1={xScale(p.year)}
                y1={paddingY}
                x2={xScale(p.year)}
                y2={height - paddingY}
                stroke="#cbd5f5"
                strokeDasharray="4 4"
              />
            )}

            {/* invisible wide hit zone */}
            <rect
              x={
                xScale(p.year) -
                (width - 2 * paddingX) / (years * 2 || 1)
              }
              y={paddingY}
              width={(width - 2 * paddingX) / (years || 1)}
              height={height - 2 * paddingY}
              fill="transparent"
            />

            {/* point */}
            <circle
              cx={xScale(p.year)}
              cy={yScale(p.base)}
              r={i === selectedIndex ? 5 : 4}
              fill={i === selectedIndex ? "#059669" : "#10b981"}
            />

            {/* x‑axis label */}
            <text
              x={xScale(p.year)}
              y={height - paddingY + 16}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {p.year === 0 ? "Year 0" : `Year ${p.year}`}
            </text>
          </g>
        ))}
      </svg>

      {/* floating tooltip card */}
      {focus && (
        <div
          className="absolute top-10 -translate-x-1/2 rounded-2xl bg-white shadow-md border border-slate-200 px-4 py-3 text-xs text-slate-800"
          style={tooltipStyle}
        >
          <p className="font-semibold mb-1">
            Year {focus.year}
          </p>
          <p>{formatINR(focus.high)}</p>
          <p>{formatINR(focus.base)}</p>
          <p>{formatINR(focus.low)}</p>
        </div>
      )}
    </div>
  );
}
