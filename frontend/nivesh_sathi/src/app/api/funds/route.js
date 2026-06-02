// src/app/api/funds/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { computeTrailingReturns } from "../../../lib/navReturns";

const slugify = (name = "", index) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `fund-${index}`;

const toRiskLevel = (num) => {
  const n = Number(num);
  if (Number.isNaN(n)) return "Unknown";
  if (n <= 2) return "Low";
  if (n <= 4) return "Medium";
  return "High";
};

// How many funds to enrich with MFAPI per request (avoid huge fan‑out)
const ENRICH_LIMIT = 5;

async function enrichFundWithNavReturns(fund) {
  if (!fund.scheme_code) return fund;

  try {
    const res = await fetch(`https://api.mfapi.in/mf/${fund.scheme_code}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("MFAPI error", res.status, fund.scheme_code);
      return fund;
    }

    const json = await res.json(); // { meta, data }
    const { r1, r3, r5 } = computeTrailingReturns(json.data || []);

    return {
      ...fund,
      // Prefer MFAPI-based values; fall back to CSV if null
      returns_1yr:
        r1 != null ? r1.toFixed(2) : fund.returns_1yr ?? null,
      returns_3yr:
        r3 != null ? r3.toFixed(2) : fund.returns_3yr ?? null,
      returns_5yr:
        r5 != null ? r5.toFixed(2) : fund.returns_5yr ?? null,
    };
  } catch (e) {
    console.error("Failed to fetch NAV or compute returns", e);
    return fund;
  }
}

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "data", "funds.csv");
    const file = fs.readFileSync(csvPath, "utf8");

    const parsed = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });

    let records = parsed.data.map((row, index) => ({
      id: slugify(row.scheme_name, index),
      scheme_code: row.scheme_code, // now present in CSV
      scheme_name: row.scheme_name,
      min_sip: row.min_sip,
      min_lumpsum: row.min_lumpsum,
      expense_ratio: row.expense_ratio,
      fund_size_cr: row.fund_size_cr,
      fund_age_yr: row.fund_age_yr,
      fund_manager: row.fund_manager,
      sortino: row.sortino,
      alpha: row.alpha,
      sd: row.sd,
      beta: row.beta,
      sharpe: row.sharpe,

      risk_numeric: row.risk_level,
      risk_level: toRiskLevel(row.risk_level),

      amc_name: row.amc_name,
      rating: row.rating,
      category: row.category,
      sub_category: row.sub_category,

      returns_1yr: row.returns_1yr,
      returns_3yr: row.returns_3yr,
      returns_5yr: row.returns_5yr,
    }));

    // enrich first ENRICH_LIMIT funds
    const toEnrich = records.slice(0, ENRICH_LIMIT);
    const rest = records.slice(ENRICH_LIMIT);

    const enriched = await Promise.all(
      toEnrich.map((fund) => enrichFundWithNavReturns(fund))
    );

    records = [...enriched, ...rest];

    return NextResponse.json({ funds: records });
  } catch (error) {
    console.error("Error reading CSV", error);
    return NextResponse.json(
      { error: "Failed to load data" },
      { status: 500 }
    );
  }
}
