// src/components/risk-simulator/RiskSimulator.jsx
"use client";

import { useState, useMemo } from "react";
import RiskGrowthGraph from "./RiskGrowthGraph.jsx";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function RiskSimulator() {
  const [risk, setRisk] = useState(50);        // 0–100
  const [tenure, setTenure] = useState(5);     // years
  const [amount, setAmount] = useState(100000); // ₹100K

  // expected return from risk slider (example: 4–18% p.a.)
  const expectedReturn = useMemo(
    () => 4 + (risk / 100) * 14,
    [risk]
  );

  const projectedValue = useMemo(() => {
    const r = expectedReturn / 100;
    return amount * Math.pow(1 + r, tenure);
  }, [amount, expectedReturn, tenure]);

  const totalGain = projectedValue - amount;

  const riskLabel =
    risk < 34 ? "Conservative" : risk < 67 ? "Balanced" : "Aggressive";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="border-b border-slate-100 px-8 py-6">
        <p className="text-sm font-semibold tracking-wide text-emerald-600 uppercase">
          Risk–Return Simulator
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Visualize your potential returns
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Adjust risk tolerance, investment horizon, and amount to see how your
          portfolio could grow over time.
        </p>
      </div>

      {/* Controls */}
      <div className="px-8 pt-6 pb-4 border-b border-slate-100">
        {/* Risk tolerance */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-500 text-xs">
                !
              </span>
              <p className="text-sm font-medium text-slate-700">
                Risk Tolerance
              </p>
            </div>
            <p className="text-sm font-semibold text-emerald-600">
              {risk}%
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={risk}
            onChange={(e) => setRisk(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-700">
              Investment Tenure
            </p>
            <p className="text-sm font-semibold text-emerald-600">
              {tenure} {tenure === 1 ? "year" : "years"}
            </p>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>1 year</span>
            <span>10 years</span>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-700">
              Investment Amount
            </p>
            <p className="text-sm font-semibold text-emerald-600">
              {formatCurrency(amount)}
            </p>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>₹10K</span>
            <span>₹10L</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="px-8 pt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase">
            Risk Profile
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">
            {riskLabel}
          </p>
          <p className="mt-1 text-xs text-slate-500">Large Cap Equity</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-500 uppercase">
            Expected Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            +{expectedReturn.toFixed(1)}% p.a.
          </p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-500 uppercase">
              Projected Value
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCurrency(projectedValue)}
            </p>
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-600">
            Total Gain {totalGain >= 0 ? "+" : "-"}
            {formatCurrency(Math.abs(totalGain))}
          </p>
        </div>
      </div>

      {/* Graph */}
      <div className="px-4 md:px-8 pt-4 pb-6">
        <RiskGrowthGraph
          amount={amount}
          rate={expectedReturn}
          years={tenure}
        />
      </div>

      {/* AI-style insight */}
      <div className="border-t border-slate-100 px-8 py-4 bg-slate-50/60">
        <div className="flex gap-3">
          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-500 text-sm">
            ✨
          </span>
          <p className="text-xs text-slate-600">
            Based on your {riskLabel.toLowerCase()} risk profile and{" "}
            {tenure}-year horizon, an equity‑heavy portfolio may be suitable.
            With an expected return of around {expectedReturn.toFixed(1)}% p.a.,
            your investment could grow from {formatCurrency(amount)} to{" "}
            {formatCurrency(projectedValue)} over this period.
          </p>
        </div>
      </div>
    </div>
  );
}
