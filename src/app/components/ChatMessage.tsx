export default function ChatMessage({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-2 rounded-2xl ${
          isUser ? "bg-indigo-600" : "bg-slate-800 border border-slate-700"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
