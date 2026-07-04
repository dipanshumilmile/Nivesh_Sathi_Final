import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await fetch(
      "https://nivesh-sathi-backend.onrender.com/api/ai/recommend",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}
