const QUESTIONS = [
  "What are the pros and cons?",
  "Is this fund risky?",
  "Explain Sharpe ratio",
  "Should I invest long term?",
];

export default function QuickQuestions({ onAsk }) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {QUESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onAsk(q)}
          className="rounded-full border px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
