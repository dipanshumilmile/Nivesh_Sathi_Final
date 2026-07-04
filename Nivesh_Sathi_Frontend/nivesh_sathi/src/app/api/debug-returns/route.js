// src/app/api/debug-returns/route.js
import { NextResponse } from "next/server";
import { computeTrailingReturns } from "../../../lib/navReturns";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("scheme_code");
  if (!code) {
    return NextResponse.json(
      { error: "scheme_code is required" },
      { status: 400 }
    );
  }

  const res = await fetch(`https://api.mfapi.in/mf/${code}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "MFAPI failed" }, { status: 500 });
  }

  const json = await res.json();
  const { r1, r3, r5 } = computeTrailingReturns(json.data || []);

  return NextResponse.json({
    scheme_code: code,
    returns_1yr: r1,
    returns_3yr: r3,
    returns_5yr: r5,
    nav_points: json.data.length,
  });
}
