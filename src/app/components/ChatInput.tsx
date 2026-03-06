"use client";

import { useState, useRef, useCallback } from "react";
import { SendHorizonal } from "lucide-react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [input, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter inserts newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  };

  return (
    <div className="flex items-end gap-3 mt-4 bg-slate-800/60 border border-slate-700 rounded-2xl px-4 py-3 focus-within:border-indigo-500/60 transition-colors">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Ask something… (Shift+Enter for newline)"
        className="flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none leading-relaxed max-h-[180px] overflow-y-auto"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim()}
        className="shrink-0 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
        title="Send (Enter)"
      >
        <SendHorizonal size={16} />
      </button>
    </div>
  );
}
