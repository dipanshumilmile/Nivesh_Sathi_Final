// scripts/updateReturnsFromMfapi.mjs
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import fetch from "node-fetch";
import dayjs from "dayjs";

// ---------- Helper: CAGR from NAV history ----------
function computeTrailingReturns(navData) {
  if (!Array.isArray(navData) || navData.length === 0) {
    return { r1: null, r3: null, r5: null };
  }

  const parsed = navData
    .map((d) => ({
      date: dayjs(d.date, "DD-MM-YYYY"),
      nav: Number(d.nav),
    }))
    .filter((d) => d.date.isValid() && d.nav > 0)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf()); // oldest → newest

  if (!parsed.length) return { r1: null, r3: null, r5: null };

  const latest = parsed[parsed.length - 1];

  const findNavYearsAgo = (years) => {
    const cutoff = latest.date.subtract(years, "year");
    let candidate = parsed[0];
    for (const p of parsed) {
      if (p.date.isAfter(cutoff)) break;
      candidate = p;
    }
    return candidate;
  };

  const calcCagr = (startNav, endNav, years) => {
    if (!startNav || !endNav || years <= 0) return null;
    if (startNav <= 0) return null;
    const cagr = Math.pow(endNav / startNav, 1 / years) - 1;
    return cagr * 100; // %
  };

  const oneY = findNavYearsAgo(1);
  const threeY = findNavYearsAgo(3);
  const fiveY = findNavYearsAgo(5);

  return {
    r1: calcCagr(oneY?.nav, latest.nav, 1),
    r3: calcCagr(threeY?.nav, latest.nav, 3),
    r5: calcCagr(fiveY?.nav, latest.nav, 5),
  };
}

// ---------- Main script ----------
const csvPath = path.join(process.cwd(), "data", "funds.csv");
const outPath = path.join(process.cwd(), "data", "funds_updated.csv");

// delay helper to respect API / avoid timeouts
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchNavData(schemeCode) {
  const url = `https://api.mfapi.in/mf/${schemeCode}`;
  const res = await fetch(url, { timeout: 10000 });
  if (!res.ok) {
    console.warn("MFAPI error", res.status, schemeCode);
    return null;
  }
  const json = await res.json(); // { meta, data }
  return json.data || [];
}

async function main() {
  // 1. read CSV
  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const parsed = Papa.parse(csvRaw, { header: true, skipEmptyLines: true });
  const rows = parsed.data;
  console.log("Total rows:", rows.length);

  // 2. loop over rows slowly and update returns
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const code = row.scheme_code || row.schemeCode;

    if (!code) {
      console.log(`Skipping row ${i} (no scheme_code):`, row.scheme_name);
      continue;
    }

    console.log(
      `(${i + 1}/${rows.length}) Fetching NAV for ${code} - ${row.scheme_name}`
    );

    try {
      const navData = await fetchNavData(code);
      if (!navData) {
        console.log("  -> keeping old returns (API null)");
        continue;
      }

      const { r1, r3, r5 } = computeTrailingReturns(navData);

      if (r1 != null) row.returns_1yr = r1.toFixed(2);
      if (r3 != null) row.returns_3yr = r3.toFixed(2);
      if (r5 != null) row.returns_5yr = r5.toFixed(2);

      console.log(
        `  -> updated: 1Y=${row.returns_1yr}, 3Y=${row.returns_3yr}, 5Y=${row.returns_5yr}`
      );
    } catch (e) {
      console.warn("  -> error, keeping old returns:", e.message);
    }

    // sleep 1s between calls to be gentle with MFAPI
    await sleep(1000);
  }

  // 3. write new CSV
  const outCsv = Papa.unparse(rows);
  fs.writeFileSync(outPath, outCsv, "utf8");
  console.log("Written updated CSV to", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
