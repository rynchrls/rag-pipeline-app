"use client";
import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div className="flex gap-2 mt-4">
      <input
        className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => {
          if (!input) return;
          onSend(input);
          setInput("");
        }}
        className="bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-500"
      >
        Send
      </button>
    </div>
  );
}
