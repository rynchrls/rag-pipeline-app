"use client";

import { useEffect, useState } from "react";
import ChatMessage from "@/app/components/ChatMessage";
import ChatInput from "@/app/components/ChatInput";
import { Plus, Trash } from "lucide-react";
import { Conversation } from "../types/Chatbox.types";

export default function ChatboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPipeline, setSelectedPipeline] = useState("default");

  /* =========================
     Load from localStorage
  ========================== */
  useEffect(() => {
    const saved = localStorage.getItem("rag-conversations");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveId(parsed[0].id);
      }
    }
  }, []);

  /* =========================
     Persist conversations
  ========================== */
  useEffect(() => {
    localStorage.setItem("rag-conversations", JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  /* =========================
     Create New Chat
  ========================== */
  const createNewChat = () => {
    const newChat: Conversation = {
      id: crypto.randomUUID(),
      title: "New Chat",
      pipeline: selectedPipeline,
      messages: [],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveId(newChat.id);
  };

  /* =========================
     Send Message
  ========================== */
  const sendMessage = async (text: string) => {
    if (!activeConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id !== activeId) return conv;

      const updatedMessages = [
        ...conv.messages,
        { role: "user", content: text },
      ];

      return {
        ...conv,
        title: conv.messages.length === 0 ? text.slice(0, 30) : conv.title,
        messages: updatedMessages,
      };
    });

    setConversations(updatedConversations);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        pipeline: selectedPipeline,
      }),
    });

    const data = await res.json();

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { role: "assistant", content: data.response },
              ],
            }
          : conv,
      ),
    );
  };

  const deleteConversation = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (activeId === id) {
      setActiveId(filtered[0]?.id || null);
    }
  };

  return (
    <div className="flex h-[85vh] bg-slate-950 text-white rounded-2xl overflow-hidden shadow-xl">
      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 m-4 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`group flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition
                ${
                  activeId === conv.id ? "bg-indigo-600" : "hover:bg-slate-800"
                }`}
            >
              <span className="truncate text-sm">{conv.title}</span>

              <Trash
                size={14}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN CHAT ================= */}
      <div className="flex-1 flex flex-col p-6 bg-slate-900">
        {/* Top Bar */}
        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedPipeline}
            onChange={(e) => setSelectedPipeline(e.target.value)}
            className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700"
          >
            <option value="default">Default Pipeline</option>
            <option value="legal">Legal Pipeline</option>
            <option value="medical">Medical Pipeline</option>
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {activeConversation?.messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
        </div>

        {activeConversation && <ChatInput onSend={sendMessage} />}
      </div>
    </div>
  );
}
