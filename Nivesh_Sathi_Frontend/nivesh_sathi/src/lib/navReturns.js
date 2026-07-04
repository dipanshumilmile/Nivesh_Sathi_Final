// src/lib/navReturns.js
import dayjs from "dayjs";

/**
 * navData: array from MFAPI: [{date: "20-12-2024", nav: "123.45"}, ...]
 * Returns: { r1, r3, r5 } as percentages (e.g. 12.34 = 12.34%)
 */
export function computeTrailingReturns(navData) {
  if (!Array.isArray(navData) || navData.length === 0) {
    return { r1: null, r3: null, r5: null };
  }

  const parsed = navData
    .map((d) => ({
      date: dayjs(d.date, "DD-MM-YYYY"), // MFAPI format
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
    const cagr = Math.pow(endNav / startNav, 1 / years) - 1; // CAGR formula[web:114][web:118]
    return cagr * 100;
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
