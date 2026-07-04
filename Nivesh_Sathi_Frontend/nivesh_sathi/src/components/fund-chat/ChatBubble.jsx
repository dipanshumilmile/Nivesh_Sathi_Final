export default function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
        isUser
          ? "ml-auto bg-emerald-500 text-white"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {text}
    </div>
  );
}
