// src/app/api/amcs/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), "data", "funds.csv");
    const file = fs.readFileSync(csvPath, "utf8");

    const parsed = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });

    // Count AMC frequency
    const amcCount = {};
    parsed.data.forEach((row) => {
      const amc = (row.amc_name || "").trim();
      if (amc) {
        amcCount[amc] = (amcCount[amc] || 0) + 1;
      }
    });

    // Get top 10 most common AMCs
    const topAmcs = Object.entries(amcCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name]) => name);

    const amcs = ["Any AMC", ...topAmcs.sort()];

    return NextResponse.json({ amcs });
  } catch (error) {
    console.error("Error reading AMCs", error);
    return NextResponse.json(
      { 
        amcs: [
          "Any AMC",
          "HDFC", "SBI", "ICICI", "Aditya Birla", 
          "Nippon India", "Kotak", "Axis", "UTI", "DSP"
        ] 
      }
    );
  }
}
