"use client";

import { useState } from "react";
import ChatBubble from "./ChatBubble";
import QuickQuestions from "./QuickQuestions";

export default function FundChat({ fund }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi! I'm your AI assistant for ${fund.scheme_name}. Ask me anything about this fund.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async (question) => {
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: question }]);

    const res = await fetch("/api/ai/fund-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fund, question }),
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      { role: "ai", text: data.answer },
    ]);

    setLoading(false);
  };

  return (
    <div className="mt-10 rounded-3xl border bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold">✨ AI Fund Assistant</h3>
      <p className="mb-4 text-sm text-slate-500">
        Ask anything about this mutual fund
      </p>

      <div className="space-y-3 max-h-[320px] overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}
        {loading && <ChatBubble role="ai" text="Thinking..." />}
      </div>

      <QuickQuestions onAsk={askAI} />

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this fund..."
          className="flex-1 rounded-full border px-4 py-2 text-sm"
        />
        <button
          onClick={() => {
            askAI(input);
            setInput("");
          }}
          className="rounded-full bg-emerald-500 px-5 py-2 text-white text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
