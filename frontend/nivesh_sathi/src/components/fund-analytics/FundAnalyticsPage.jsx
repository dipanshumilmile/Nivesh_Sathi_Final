// src/components/fund-analytics/FundAnalyticsPage.jsx
"use client";

import { useEffect, useState } from "react";
import FundCard from "./FundCard.jsx";
import { Search } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PAGE_SIZE = 20;

export default function FundAnalyticsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // new filter states
  const [selectedAmc, setSelectedAmc] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");

  useEffect(() => {
    async function loadFunds() {
      try {
        const res = await fetch("/api/funds");
        const data = await res.json();
        setFunds(Array.isArray(data.funds) ? data.funds : []);
      } catch (e) {
        console.error("Failed to load funds", e);
      } finally {
        setLoading(false);
      }
    }
    loadFunds();
  }, []);

  // unique options for filters from data
  const amcOptions = ["All", ...Array.from(new Set(funds.map((f) => f.amc_name)))];
  const categoryOptions = [
    "All",
    ...Array.from(new Set(funds.map((f) => f.category))),
  ];
  const riskOptions = [
    "All",
    ...Array.from(new Set(funds.map((f) => f.risk_level))),
  ];

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleAmcChange = (e) => {
    setSelectedAmc(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleRiskChange = (e) => {
    setSelectedRisk(e.target.value);
    setPage(1);
  };

  // combined filtering: search + AMC + category + risk
  const filteredFunds = funds.filter((fund) => {
    const q = query.trim().toLowerCase();

    if (q) {
      const name = (fund.scheme_name || "").toLowerCase();
      const amc = (fund.amc_name || "").toLowerCase();
      if (!name.includes(q) && !amc.includes(q)) return false;
    }

    if (selectedAmc !== "All" && fund.amc_name !== selectedAmc) return false;
    if (
      selectedCategory !== "All" &&
      (fund.category || "") !== selectedCategory
    )
      return false;
    if (selectedRisk !== "All" && (fund.risk_level || "") !== selectedRisk)
      return false;

    return true;
  });

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredFunds.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentPageFunds = filteredFunds.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-semibold text-slate-900">
          Fund Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore mutual funds with detailed metrics and AI insights.
        </p>
      </header>

      {/* Filters row */}
      <div className="mb-6 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="text-slate-400 text-lg"><Search size={16} strokeWidth={2.25} /></span>
          <input
            type="text"
            placeholder="Search funds by name or AMC..."
            value={query}
            onChange={handleSearchChange}
            className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        {/* AMC filter */}
        <select
          value={selectedAmc}
          onChange={handleAmcChange}
          className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm border border-slate-200"
        >
          {amcOptions.map((amc) => (
            <option key={amc} value={amc}>
              {amc}
            </option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm border border-slate-200"
        >
          {categoryOptions.map((c) => (
            <option key={c || "none"} value={c}>
              {c || "Uncategorised"}
            </option>
          ))}
        </select>

        {/* Risk filter */}
        <select
          value={selectedRisk}
          onChange={handleRiskChange}
          className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm border border-slate-200"
        >
          {riskOptions.map((r) => (
            <option key={r || "none"} value={r}>
              {r || "Unknown risk"}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="mb-4 text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {loading ? "…" : filteredFunds.length}
        </span>{" "}
        funds • Page {page} of {totalPages}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 rounded-3xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {currentPageFunds.map((fund) => (
            <FundCard
              key={fund.id}
              fund={fund}
              classNames={classNames}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="rounded-full border px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={classNames(
                "h-8 w-8 rounded-full text-xs font-medium",
                p === page
                  ? "bg-emerald-500 text-white"
                  : "bg-white border text-slate-600"
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="rounded-full border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
