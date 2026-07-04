"use client";
import { useEffect, useMemo, useState } from "react";

export default function CompareFundsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fund1Id, setFund1Id] = useState("");
  const [fund2Id, setFund2Id] = useState("");

  useEffect(() => {
    async function loadFunds() {
      try {
        const res = await fetch("/api/funds");
        if (!res.ok) throw new Error("Failed to load funds");
        const data = await res.json();
        setFunds(data.funds || []);
      } catch (e) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadFunds();
  }, []);

  const fund1 = useMemo(() => funds.find((f) => f.id === fund1Id), [fund1Id, funds]);
  const fund2 = useMemo(() => funds.find((f) => f.id === fund2Id), [fund2Id, funds]);
  const canCompare = !!fund1 && !!fund2;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-xl border border-emerald-200/50">
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 mb-1">Compare Funds</h1>
              <p className="text-sm text-slate-600">Loading funds...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 shadow-xl border border-red-100">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-4">Compare Funds</h1>
            <p className="text-lg text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Fund Comparison
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select two mutual funds to compare performance, risk metrics, and key attributes side by side.
          </p>
        </div>

        {/* Fund Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <FundSelector 
            funds={funds} 
            value={fund1Id} 
            onChange={setFund1Id}
            label="Fund 1"
            placeholder="Select first fund"
          />
          <FundSelector 
            funds={funds} 
            value={fund2Id} 
            onChange={setFund2Id}
            label="Fund 2"
            placeholder="Select second fund"
          />
        </div>

        {/* Empty State */}
        {!canCompare && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-16 shadow-xl border border-emerald-200/50 text-center hover:shadow-2xl transition-all duration-300">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">Select Two Funds</h2>
            <p className="text-lg text-slate-600 max-w-lg mx-auto">
              Choose funds from the dropdowns above to view detailed comparison.
            </p>
          </div>
        )}

        {/* Comparison Results */}
        {canCompare && fund1 && fund2 && (
          <div className="space-y-8">
            {/* Fund Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FundCard fund={fund1} label="Fund 1" />
              <FundCard fund={fund2} label="Fund 2" />
            </section>

            {/* Comparison Tables */}
            <ComparisonTable title="Returns" fund1={fund1} fund2={fund2} metrics={returnsMetrics} />
            <ComparisonTable title="Risk Metrics" fund1={fund1} fund2={fund2} metrics={riskMetrics} />
            <ComparisonTable title="Fund Details" fund1={fund1} fund2={fund2} metrics={fundMetrics} />
          </div>
        )}
      </div>
    </main>
  );
}

function FundSelector({ funds, value, onChange, label, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 text-sm bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-md hover:shadow-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {funds.map((fund, idx) => (
          <option key={`${fund.id}-${idx}`} value={fund.id}>
            {fund.scheme_name}
          </option>
        ))}
      </select>
    </div>
  );
}

function FundCard({ fund, label }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {label}
      </p>
      <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight">
        {fund.scheme_name}
      </h3>
      <RiskBadge level={fund.risk_level} />
      <p className="text-sm text-slate-600 mt-2">{fund.amc_name}</p>
      <p className="text-sm text-slate-500 mt-1">
        {fund.category} • {fund.sub_category}
      </p>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">1Y Return</span>
          <span className="text-lg font-bold text-emerald-600">{fund.returns_1yr || '—'}%</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({ title, fund1, fund2, metrics }) {
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="text-left py-3 pl-0 font-semibold text-slate-700 text-sm">Metric</th>
              <th className="text-right py-3 pr-4 font-semibold text-slate-700 text-sm">{fund1.scheme_name}</th>
              <th className="w-12 py-3 text-center"></th>
              <th className="text-right py-3 pr-0 font-semibold text-slate-700 text-sm">{fund2.scheme_name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {metrics.map(({ label, key, format }) => (
              <ComparisonRow 
                key={key} 
                label={label} 
                left={fund1[key]} 
                right={fund2[key]} 
                format={format}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ComparisonRow({ label, left, right, format = (v) => v || '—' }) {
  const leftVal = format ? format(left) : left || '—';
  const rightVal = format ? format(right) : right || '—';
  const leftNum = parseFloat(left) || 0;
  const rightNum = parseFloat(right) || 0;
  const winner = leftNum > rightNum ? 'left' : rightNum > leftNum ? 'right' : 'tie';

  return (
    <tr className="hover:bg-slate-50/50 transition-colors h-12">
      <td className="py-3 pl-0 font-medium text-sm text-slate-700">{label}</td>
      <td className={`py-3 pr-4 text-right font-semibold text-sm ${winner === 'left' ? 'text-emerald-600' : 'text-slate-900'}`}>
        {leftVal}
      </td>
      <td className="py-3 px-2 text-center text-xs">
        {winner !== 'tie' && '★'}
      </td>
      <td className={`py-3 pr-0 text-right font-semibold text-sm ${winner === 'right' ? 'text-emerald-600' : 'text-slate-900'}`}>
        {rightVal}
      </td>
    </tr>
  );
}

// Metrics configs
const returnsMetrics = [
  { label: "1 Year Return", key: "returns_1yr", format: (v) => `${parseFloat(v || 0).toFixed(1)}%` },
  { label: "3 Year Return", key: "returns_3yr", format: (v) => `${parseFloat(v || 0).toFixed(1)}%` },
  { label: "5 Year Return", key: "returns_5yr", format: (v) => `${parseFloat(v || 0).toFixed(1)}%` },
];

const riskMetrics = [
  { label: "Sharpe Ratio", key: "sharpe" },
  { label: "Alpha", key: "alpha" },
  { label: "Beta", key: "beta" },
  { label: "Standard Deviation", key: "sd" },
];

const fundMetrics = [
  { label: "Expense Ratio", key: "expense_ratio", format: (v) => `${parseFloat(v || 0).toFixed(2)}%` },
  { label: "AUM (₹ Cr)", key: "fund_size_cr" },
  { label: "Fund Manager", key: "fund_manager" },
  { label: "AMC", key: "amc_name" },
  { label: "Category", key: "category" },
];

function RiskBadge({ level }) {
  const colors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
    Unknown: 'bg-slate-100 text-slate-800 border-slate-200'
  };
  
  const colorClass = colors[level] || colors.Unknown;
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${colorClass}`}>
      {level} Risk
    </span>
  );
}
