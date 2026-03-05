"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ChatMessage from "@/app/components/ChatMessage";
import ChatInput from "@/app/components/ChatInput";
import {
  Plus,
  Trash,
  ChevronDown,
  Bot,
  Loader2,
  MessagesSquare,
} from "lucide-react";
import PipelineSvc from "@/api/services/pipeline.service";
import ConversationSvc from "@/api/services/conversation.service";
import MessageSvc from "@/api/services/message.service";
import { GetPipelines, PipelineStage } from "@/app/types/pipeline.types";
import { Conversation, GetConversations } from "@/app/types/conversation.types";
import { GetMessages, BaseMessage } from "@/app/types/message.types";
import { useAuth } from "@/app/store/auth";

/* ─────────── local UI chat message shape ─────────── */
interface ChatMsg {
  role: "user" | "system";
  content: string;
}

export default function ChatboxPage() {
  /* ─────────────── Auth ─────────────── */
  const { user } = useAuth();

  /* ─────────────── Conversations (from API) ─────────────── */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);

  /* ─────────────── Messages per conversation (cache) ─────────────── */
  // Map of conversation_id → ChatMsg[]
  const [messagesCache, setMessagesCache] = useState<Record<number, ChatMsg[]>>(
    {},
  );
  const [msgsLoading, setMsgsLoading] = useState(false);

  /* ─────────────── Agents (Pipelines) ─────────────── */
  const [agents, setAgents] = useState<PipelineStage[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<PipelineStage | null>(
    null,
  );
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* ─────────────── Sending ─────────────── */
  const [sending, setSending] = useState(false);

  /* ─────────────── Creating new conversation ─────────────── */
  const [creating, setCreating] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ═══════════════════════════════════════════
     FETCH ALL CONVERSATIONS
  ═══════════════════════════════════════════ */
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    setConvsLoading(true);
    try {
      const response = await ConversationSvc.get_all({
        author_id: Number(user.id),
        page: 1,
        limit: 10,
      });
      const data = response.data as GetConversations;
      setConversations(data.data);
      // Auto-select first conversation
      if (data.data.length > 0 && activeConvId === null) {
        setActiveConvId(data.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setConvsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchConversations();
  }, [user?.id, fetchConversations]);

  /* ═══════════════════════════════════════════
     FETCH MESSAGES FOR ACTIVE CONVERSATION
  ═══════════════════════════════════════════ */
  const fetchMessages = useCallback(
    async (convId: number) => {
      if (!user?.id || !selectedAgent) return;
      // Already cached – skip network call
      if (messagesCache[convId] !== undefined) return;

      setMsgsLoading(true);
      try {
        const response = await MessageSvc.get_all({
          author_id: Number(user.id),
          pipeline_id: selectedAgent.id,
          conversation_id: convId,
          page: 1,
          limit: 20,
        });
        const data = response.data as GetMessages;
        const mapped: ChatMsg[] = data.data.map((m: BaseMessage) => ({
          role: m.role === "user" ? "user" : "system",
          content: m.content,
        }));
        setMessagesCache((prev) => ({ ...prev, [convId]: mapped }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessagesCache((prev) => ({ ...prev, [convId]: [] }));
      } finally {
        setMsgsLoading(false);
      }
    },
    [user?.id, selectedAgent, messagesCache],
  );

  useEffect(() => {
    if (activeConvId !== null) fetchMessages(activeConvId);
  }, [activeConvId, fetchMessages]);

  /* ═══════════════════════════════════════════
     FETCH AGENTS (PIPELINES)
  ═══════════════════════════════════════════ */
  const fetchAgents = useCallback(async () => {
    if (!user?.id) return;
    setAgentsLoading(true);
    try {
      const response = await PipelineSvc.get_all({
        author_id: Number(user.id),
        page: 1,
        limit: 100,
        search: "",
      });
      const data = response.data as GetPipelines;
      setAgents(data.data);
      if (data.data.length > 0) setSelectedAgent(data.data[0]);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setAgentsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchAgents();
  }, [user?.id, fetchAgents]);

  /* ─────────── Close dropdown on outside click ─────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─────────── Derived ─────────── */
  const activeConversation = conversations.find((c) => c.id === activeConvId);
  const activeMessages: ChatMsg[] =
    activeConvId !== null ? (messagesCache[activeConvId] ?? []) : [];

  /* ═══════════════════════════════════════════
     CREATE NEW CONVERSATION
  ═══════════════════════════════════════════ */
  const createNewChat = async () => {
    if (!user?.id || creating) return;
    setCreating(true);
    try {
      const response = await ConversationSvc.add({
        name: "New Chat",
        author_id: Number(user.id),
        pipeline_id: selectedAgent?.id ?? null,
      });
      const newConv: Conversation = response.data?.data ?? response.data;
      // Prepend to sidebar and switch to it
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      // Seed the cache as empty so no unnecessary fetch
      setMessagesCache((prev) => ({ ...prev, [newConv.id]: [] }));
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setCreating(false);
    }
  };

  /* ═══════════════════════════════════════════
     SWITCH CONVERSATION
  ═══════════════════════════════════════════ */
  const handleSelectConversation = (convId: number) => {
    setActiveConvId(convId);
    // fetchMessages is triggered by the useEffect watching activeConvId
  };

  /* ═══════════════════════════════════════════
     SUBMIT MESSAGE
     Flow:
       1. Show user msg instantly (optimistic)
       2. add(user text) → backend runs RAG/LLM, returns system response in data
       3. Append system msg when add() resolves
       4. add_llm(data fields) → persist the LLM response on the backend
  ═══════════════════════════════════════════ */
  const submitMessage = async (text: string) => {
    if (!activeConvId || !selectedAgent || sending) return;

    // ── Show user message immediately before any network call ──
    const userMsg: ChatMsg = { role: "user", content: text };
    setMessagesCache((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] ?? []), userMsg],
    }));

    // Update conversation name on first message
    if (activeMessages.length === 0) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, name: text.slice(0, 40) } : c,
        ),
      );
    }

    // ── Start "Thinking…" indicator ──
    setSending(true);

    // ── Step 1: POST user message — backend generates & returns the LLM response ──
    let llmResponseData: Record<string, unknown> | null = null;
    try {
      const addRes = await MessageSvc.add({
        content: text,
        role: "user",
        agent_name: selectedAgent.agent_name,
        pipeline_id: selectedAgent.id,
        author_id: Number(user?.id),
        conversation_id: activeConvId,
      } as Record<string, unknown>);

      // addRes.data = { message: "...", data: { role, content, pipeline_id, author_id, agent_name, conversation_id } }
      llmResponseData = addRes.data?.data ?? addRes.data;

      // Append system response once it arrives
      const systemMsg: ChatMsg = {
        role: "system",
        content: (llmResponseData?.content as string) ?? "",
      };
      setMessagesCache((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] ?? []), systemMsg],
      }));
    } catch (err) {
      console.error("Failed to send message:", err);
      setSending(false);
      return;
    }

    // ── Step 2: Persist the LLM response via add_llm() using the data fields from add() ──
    try {
      await MessageSvc.add_llm({
        role: llmResponseData?.role,
        content: llmResponseData?.content,
        pipeline_id: llmResponseData?.pipeline_id,
        author_id: llmResponseData?.author_id,
        agent_name: llmResponseData?.agent_name,
        conversation_id: llmResponseData?.conversation_id,
      } as Record<string, unknown>);
    } catch (err) {
      // add_llm() persistence failure is non-critical — response is already shown
      console.error("Failed to persist LLM response:", err);
    } finally {
      setSending(false);
    }
  };

  /* ═══════════════════════════════════════════
     DELETE CONVERSATION  (local only – add API call if backend supports it)
  ═══════════════════════════════════════════ */
  const deleteConversation = (id: number) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    setMessagesCache((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (activeConvId === id) {
      setActiveConvId(filtered[0]?.id ?? null);
    }
  };

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="flex h-[85vh] bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <div className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col shrink-0">
        {/* New Chat Button */}
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={createNewChat}
            disabled={creating || !user?.id}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-900/30 font-medium text-sm"
          >
            {creating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {creating ? "Creating…" : "New Chat"}
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {convsLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-slate-400 text-xs">
              <Loader2 size={14} className="animate-spin" />
              Loading chats…
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 opacity-40">
              <MessagesSquare size={28} />
              <p className="text-xs text-slate-400">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`group flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm
                  ${
                    activeConvId === conv.id
                      ? "bg-indigo-600 shadow-md shadow-indigo-900/30"
                      : "hover:bg-slate-800 text-slate-300"
                  }`}
              >
                <span className="truncate flex-1 mr-1">{conv.name}</span>
                <Trash
                  size={13}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 shrink-0 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ═══════════════ MAIN CHAT ═══════════════ */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <Bot size={20} className="text-indigo-400" />
            <span className="text-sm font-medium">
              {selectedAgent ? (
                <>
                  Agent:{" "}
                  <span className="text-indigo-300 font-semibold">
                    {selectedAgent.agent_name}
                  </span>
                </>
              ) : (
                <span className="text-slate-500 italic">No agent selected</span>
              )}
            </span>
          </div>

          {/* Agent Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              disabled={agentsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500/60 text-sm transition-all min-w-[180px] justify-between disabled:opacity-50"
            >
              {agentsLoading ? (
                <span className="flex items-center gap-2 text-slate-400">
                  <Loader2 size={14} className="animate-spin" />
                  Loading agents…
                </span>
              ) : (
                <span className="truncate text-slate-200">
                  {selectedAgent?.agent_name ?? "Select Agent"}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                {agents.length === 0 ? (
                  <div className="px-4 py-3 text-slate-400 text-sm">
                    No agents found
                  </div>
                ) : (
                  <ul className="max-h-60 overflow-y-auto divide-y divide-slate-700/50">
                    {agents.map((agent) => (
                      <li
                        key={agent.id}
                        onClick={() => {
                          setSelectedAgent(agent);
                          setDropdownOpen(false);
                          // Clear message cache so messages reload with correct pipeline
                          setMessagesCache({});
                        }}
                        className={`px-4 py-3 cursor-pointer text-sm transition-colors
                          ${
                            selectedAgent?.id === agent.id
                              ? "bg-indigo-600/30 text-indigo-200"
                              : "hover:bg-slate-700 text-slate-200"
                          }`}
                      >
                        <p className="font-medium truncate">
                          {agent.agent_name}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {agent.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {!activeConversation ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
              <MessagesSquare size={48} />
              <p className="text-slate-400">
                Start a new chat or select one from the sidebar
              </p>
            </div>
          ) : msgsLoading ? (
            <div className="flex items-center justify-center h-full gap-2 text-slate-400 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading messages…
            </div>
          ) : activeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
              <Bot size={40} className="text-indigo-400" />
              <p className="text-slate-400 text-sm">Send a message to begin</p>
            </div>
          ) : (
            activeMessages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} content={msg.content} />
            ))
          )}

          {sending && (
            <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse pl-1">
              <Loader2 size={14} className="animate-spin" />
              Thinking…
            </div>
          )}
        </div>

        {/* ── Input ── */}
        {activeConversation && (
          <div className="px-6 pb-5 shrink-0">
            <ChatInput onSend={submitMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
