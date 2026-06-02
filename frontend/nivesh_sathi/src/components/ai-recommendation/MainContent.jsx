"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const fundCategories = [
  "All Categories",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Hybrid",
  "Debt",
];

const amcOptions = [
  "Any AMC",
  "Aditya Birla Sun Life Mutual Fund",
  "Axis Mutual Fund",
  "Bandhan Mutual Fund",
  "Bank of India Mutual Fund",
  "Baroda BNP Paribas Mutual Fund",
  "Canara Robeco Mutual Fund",
  "DSP Mutual Fund",
  "Edelweiss Mutual Fund",
  "Franklin Templeton Mutual Fund",
  "HDFC Mutual Fund",
  "HSBC Mutual Fund",
  "ICICI Prudential Mutual Fund",
  "IDBI Mutual Fund",
  "Indiabulls Mutual Fund",
  "Invesco Mutual Fund",
  "ITI Mutual Fund",
  "JM Financial Mutual Fund",
  "Kotak Mahindra Mutual Fund",
  "LT Mutual Fund",
  "LIC Mutual Fund",
  "Mahindra Manulife Mutual Fund",
  "Mirae Asset Mutual Fund",
  "Motilal Oswal Mutual Fund",
  "Navi Mutual Fund",
  "Nippon India Mutual Fund",
  "PGIM India Mutual Fund",
  "Quant Mutual Fund",
  "SBI Mutual Fund",
  "Shriram Mutual Fund",
  "Sundaram Mutual Fund",
  "Union Mutual Fund",
  "UTI Mutual Fund",
  "WhiteOak Capital Mutual Fund",
];

export default function MainContent() {
  const router = useRouter();

  const [mode, setMode] = useState("LUMPSUM");
  const [amount, setAmount] = useState(100000);
  const [sipAmount, setSipAmount] = useState(5000);
  const [tenure, setTenure] = useState(5);
  const [risk, setRisk] = useState(3);

  const [fundCategory, setFundCategory] = useState("All Categories");
  const [amcPreference, setAmcPreference] = useState("Any AMC");

  const formatAmountLabel = (v) => `₹${(v / 100000).toFixed(1)}L`;
  const formatSipLabel = (v) => `₹${v.toLocaleString()}`;

  const calcPercent = (value, min, max) =>
    ((value - min) / (max - min || 1)) * 100;

  // ✅ DIRECT FASTAPI CALL
  const handleSubmit = async () => {
    try {
      const payload = {
        amc_name: amcPreference === "Any AMC" ? null : amcPreference,
        category: fundCategory === "All Categories" ? null : fundCategory,
        investment_amount: mode === "LUMPSUM" ? amount : null,
        sip_amount: mode === "SIP" ? sipAmount : null,
        tenure: tenure,
      };

      console.log("SENDING PAYLOAD:", payload);

      const ML_URL = process.env.NEXT_PUBLIC_ML_URL;

      const res = await fetch(`${ML_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ML ERROR RESPONSE:", text);
        return;
      }

      const data = await res.json();
      console.log("ML RESPONSE:", data);

      localStorage.setItem("aiResults", JSON.stringify(data));
      console.log("FULL AI RESPONSE:", data);
console.log("RECOMMENDATIONS:", data?.recommendations);


      router.push("/ai-recommendation/results");
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100">
      {/* Top controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="text-xs font-medium text-slate-500 mb-1">
            Fund Category
          </label>
          <select
            value={fundCategory}
            onChange={(e) => setFundCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            {fundCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1">
            AMC Preference
          </label>
          <select
            value={amcPreference}
            onChange={(e) => setAmcPreference(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            {amcOptions.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-between mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase">
          Investment Mode
        </p>
        <div className="inline-flex rounded-full bg-slate-100 p-1">
          {["LUMPSUM", "SIP"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                mode === m
                  ? "bg-emerald-500 text-white"
                  : "text-slate-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Lumpsum */}
      <div className="mb-6">
        <label className="text-xs font-medium text-slate-600">
          Investment Amount
        </label>
        <input
          type="range"
          min="10000"
          max="2000000"
          step="10000"
          disabled={mode !== "LUMPSUM"}
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          className="w-full accent-emerald-500"
        />
        <div className="text-xs text-emerald-600">
          {formatAmountLabel(amount)}
        </div>
      </div>

      {/* SIP */}
      <div className="mb-6">
        <label className="text-xs font-medium text-slate-600">
          Monthly SIP
        </label>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          disabled={mode !== "SIP"}
          value={sipAmount}
          onChange={(e) => setSipAmount(+e.target.value)}
          className="w-full accent-emerald-500"
        />
        <div className="text-xs text-emerald-600">
          {formatSipLabel(sipAmount)}
        </div>
      </div>

      {/* Tenure */}
      <div className="mb-6">
        <label className="text-xs font-medium text-slate-600">
          Tenure (Years)
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={tenure}
          onChange={(e) => setTenure(+e.target.value)}
          className="w-full accent-emerald-500"
        />
        <div className="text-xs text-emerald-600">{tenure} years</div>
      </div>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
      >
        Get AI Recommendations
      </button>
    </section>
  );
}
