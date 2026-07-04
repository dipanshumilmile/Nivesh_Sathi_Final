// scripts/addSchemeCodes.mjs
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import fetch from "node-fetch";

const csvPath = path.join(process.cwd(), "data", "funds.csv");
const outPath = path.join(process.cwd(), "data", "funds_with_codes.csv");

function normalizeName(name = "") {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

async function main() {
  // 1) Read your CSV
  const csvRaw = fs.readFileSync(csvPath, "utf8");
  const parsed = Papa.parse(csvRaw, { header: true, skipEmptyLines: true });
  const rows = parsed.data;
  console.log("Rows in CSV:", rows.length);

  // 2) Fetch all schemes from MFAPI
  const res = await fetch("https://api.mfapi.in/mf");
  if (!res.ok) throw new Error(`MFAPI /mf failed: ${res.status}`);
  const schemes = await res.json(); // [{ schemeCode, schemeName, ... }]
  console.log("Schemes from MFAPI:", schemes.length);

  // 3) Build map by normalized schemeName
  const mfMap = new Map();
  for (const s of schemes) {
    const key = normalizeName(s.schemeName);
    if (!mfMap.has(key)) {
      mfMap.set(key, s.schemeCode);
    }
  }

  // 4) Match each CSV row
  const updatedRows = rows.map((row) => {
    const name = row.scheme_name || "";
    const key = normalizeName(name);

    let schemeCode = mfMap.get(key) || "";

    // fallback: weak match (startsWith)
    if (!schemeCode) {
      for (const [k, code] of mfMap.entries()) {
        if (k.startsWith(key) || key.startsWith(k)) {
          schemeCode = code;
          break;
        }
      }
    }

    if (!schemeCode) {
      console.warn("No schemeCode match for:", name);
    }

    return {
      scheme_code: schemeCode, // new column
      ...row,
    };
  });

  // 5) Write new CSV
  const outCsv = Papa.unparse(updatedRows);
  fs.writeFileSync(outPath, outCsv, "utf8");
  console.log("Written:", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
