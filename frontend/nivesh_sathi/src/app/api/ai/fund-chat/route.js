import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY is not set. Set process.env.GROQ_API_KEY on the server.");
}


export async function POST(req) {
  try {
    // Parse JSON robustly
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("❌ Invalid JSON body:", err);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { fund, question } = body || {};

    if (!fund || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Missing fund data or question" }, { status: 400 });
    }

    if (question.length > 2000) {
      return NextResponse.json({ error: "Question too long" }, { status: 400 });
    }

    const prompt = `
You are a financial assistant.
Answer ONLY using the information below.
If the question is unrelated, say:
"I can only answer questions about this fund."

Fund Details:
Name: ${fund.scheme_name}
AMC: ${fund.amc_name}
Category: ${fund.category}
Risk Level: ${fund.risk_level}
1Y Return: ${fund.returns_1yr}%
3Y Return: ${fund.returns_3yr}%
5Y Return: ${fund.returns_5yr}%
Expense Ratio: ${fund.expense_ratio}
Sharpe Ratio: ${fund.sharpe}
Alpha: ${fund.alpha}

User Question:
${question}
`;

    if (!GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set.");
      return NextResponse.json({ error: "AI service misconfigured" }, { status: 500 });
    }

    // Single Groq request using OpenAI-compatible API
    const url = `https://api.groq.com/openai/v1/chat/completions`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a financial assistant. Answer ONLY using the information provided. If unrelated, say: 'I can only answer questions about this fund.'",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    };

    let raw;
    try {
      const res = await fetch(url, options);
      raw = await res.json();
      console.log("✅ GROQ RAW RESPONSE:", JSON.stringify(raw, null, 2));
    } catch (err) {
      console.error("❌ GROQ request failed:", err);
      return NextResponse.json({ error: "AI service failed" }, { status: 502 });
    }



    function extractAnswer(raw) {
      if (!raw) return null;
      try {
        // OpenAI-compatible format (Groq uses this)
        if (Array.isArray(raw?.choices) && raw.choices.length) {
          const content = raw.choices[0]?.message?.content;
          if (typeof content === "string" && content.trim()) return content.trim();
        }
        // Fallback for other formats
        if (typeof raw?.text === "string" && raw.text.trim()) return raw.text.trim();
        if (typeof raw?.data?.text === "string" && raw.data.text.trim()) return raw.data.text.trim();
        if (Array.isArray(raw?.outputs) && raw.outputs.length && typeof raw.outputs[0]?.text === 'string') return raw.outputs[0].text.trim();
        if (typeof raw === 'string' && raw.trim()) return raw.trim();
      } catch (e) {
        // ignore
      }
      return null;
    }

    const answer = extractAnswer(raw);
    if (!answer) {
      console.error("❌ GROQ Error: no usable answer in response");
      return NextResponse.json({ error: "AI service failed" }, { status: 502 });
    }



    return NextResponse.json({ answer });
  } catch (err) {
    console.error("❌ GROQ Error:", err);
    return NextResponse.json(
      { error: "AI service failed" },
      { status: 500 }
    );
  }
}
