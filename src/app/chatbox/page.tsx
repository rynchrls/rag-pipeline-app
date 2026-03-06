"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  const [messagesCache, setMessagesCache] = useState<Record<number, ChatMsg[]>>(
    {},
  );
  const [msgsLoading, setMsgsLoading] = useState(false);

  /* ─────────────── Load-more pagination per conversation ─────────────── */
  const [msgPage, setMsgPage] = useState<Record<number, number>>({});
  const [msgHasMore, setMsgHasMore] = useState<Record<number, boolean>>({});
  const [loadingMore, setLoadingMore] = useState(false);

  /* ─────────────── Scroll refs ─────────────── */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

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
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");

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
  const PAGE_SIZE = 10;

  const fetchMessages = useCallback(
    async (convId: number) => {
      if (!user?.id || !selectedAgent) return;
      if (messagesCache[convId] !== undefined) return;

      setMsgsLoading(true);
      try {
        const response = await ConversationSvc.get({
          author_id: Number(user.id),
          conversation_id: convId,
          page: 1,
          limit: PAGE_SIZE,
        });
        const data = response.data as GetMessages;
        const mapped: ChatMsg[] = data.data
          .map(
            (m: BaseMessage) =>
              ({
                role: m.role === "user" ? "user" : "system",
                content: m.content,
              }) as ChatMsg,
          )
          .reverse();

        shouldScrollRef.current = true;
        setMessagesCache((prev) => ({ ...prev, [convId]: mapped }));
        setMsgPage((prev) => ({ ...prev, [convId]: 1 }));
        setMsgHasMore((prev) => ({
          ...prev,
          [convId]: data.data.length === PAGE_SIZE,
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessagesCache((prev) => ({ ...prev, [convId]: [] }));
      } finally {
        setMsgsLoading(false);
      }
    },
    [user?.id, selectedAgent, messagesCache],
  );

  /* ─────────── Load older messages (pagination) ─────────── */
  const loadMoreMessages = useCallback(async () => {
    if (!activeConvId || !user?.id) return;
    const nextPage = (msgPage[activeConvId] ?? 1) + 1;
    setLoadingMore(true);

    try {
      const response = await ConversationSvc.get({
        author_id: Number(user.id),
        conversation_id: activeConvId,
        page: nextPage,
        limit: PAGE_SIZE,
      });

      const data = response.data as GetMessages;
      const older: ChatMsg[] = data.data
        .map(
          (m: BaseMessage) =>
            ({
              role: m.role === "user" ? "user" : "system",
              content: m.content,
            }) as ChatMsg,
        )
        .reverse();

      setMessagesCache((prev) => ({
        ...prev,
        [activeConvId]: [...older, ...(prev[activeConvId] ?? [])],
      }));

      setMsgPage((prev) => ({ ...prev, [activeConvId]: nextPage }));
      setMsgHasMore((prev) => ({
        ...prev,
        [activeConvId]: data.data.length === PAGE_SIZE,
      }));
    } catch (err) {
      console.error("Failed to load more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [activeConvId, user?.id, msgPage]);

  useEffect(() => {
    if (activeConvId !== null) {
      shouldScrollRef.current = true;
      fetchMessages(activeConvId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConvId, selectedAgent]);

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

  const activeMessages: ChatMsg[] = useMemo(
    () => (activeConvId !== null ? (messagesCache[activeConvId] ?? []) : []),
    [activeConvId, messagesCache],
  );

  /* ═══════════════════════════════════════════
     CREATE NEW CONVERSATION
  ═══════════════════════════════════════════ */
  const createNewChat = async (name: string) => {
    if (!user?.id || creating) return;

    const finalName = name.trim() || `Conversation ${conversations.length + 1}`;
    setCreating(true);

    try {
      const response = await ConversationSvc.add({
        name: finalName,
        author_id: Number(user.id),
        pipeline_id: selectedAgent?.id ?? null,
      });

      const newConv: Conversation = response.data?.data ?? response.data;
      const displayConv: Conversation = { ...newConv, name: finalName };

      setConversations((prev) => [displayConv, ...prev]);
      setActiveConvId(newConv.id);
      setMessagesCache((prev) => ({ ...prev, [newConv.id]: [] }));
      setMsgHasMore((prev) => ({ ...prev, [newConv.id]: false }));
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
  };

  /* ═══════════════════════════════════════════
     SUBMIT MESSAGE
  ═══════════════════════════════════════════ */
  const submitMessage = async (text: string) => {
    if (!activeConvId || !selectedAgent || sending) return;

    const convIdSnap = activeConvId;
    const existingMessages = messagesCache[convIdSnap] ?? [];

    const previousMessages = existingMessages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const outgoingMessages = [...previousMessages];

    shouldScrollRef.current = true;
    const userMsg: ChatMsg = { role: "user", content: text };

    setMessagesCache((prev) => ({
      ...prev,
      [convIdSnap]: [...(prev[convIdSnap] ?? []), userMsg],
    }));

    setSending(true);

    let fullContent = "";
    let llmMeta: Record<string, unknown> | null = null;

    try {
      const stream = MessageSvc.addStream({
        content: text,
        role: "user",
        agent_name: selectedAgent.agent_name,
        pipeline_id: selectedAgent.id,
        author_id: Number(user?.id),
        conversation_id: convIdSnap,
        messages: outgoingMessages,
      });

      for await (const event of stream) {
        if (event.type === "start") {
          setMessagesCache((prev) => ({
            ...prev,
            [convIdSnap]: [
              ...(prev[convIdSnap] ?? []),
              { role: "system" as const, content: "" },
            ],
          }));
        } else if (event.type === "chunk") {
          fullContent += event.content;
          const chunk = fullContent;

          if (sending) setSending(false);

          setMessagesCache((prev) => {
            const msgs = prev[convIdSnap] ?? [];
            const updated = [...msgs];

            updated[updated.length - 1] = {
              role: "system" as const,
              content: chunk,
            };

            return { ...prev, [convIdSnap]: updated };
          });
        } else if (event.type === "done") {
          llmMeta = event.data as Record<string, unknown>;
          const finalContent = (llmMeta?.content as string) ?? fullContent;

          setMessagesCache((prev) => {
            const msgs = prev[convIdSnap] ?? [];
            const updated = [...msgs];

            updated[updated.length - 1] = {
              role: "system" as const,
              content: finalContent,
            };

            return { ...prev, [convIdSnap]: updated };
          });
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setSending(false);
      return;
    }

    if (llmMeta) {
      try {
        await MessageSvc.add_llm({
          role: llmMeta.role,
          content: llmMeta.content,
          pipeline_id: llmMeta.pipeline_id,
          author_id: llmMeta.author_id,
          agent_name: llmMeta.agent_name,
          conversation_id: llmMeta.conversation_id,
        } as Record<string, unknown>);
      } catch (err) {
        console.error("Failed to persist LLM response:", err);
      }
    }

    setSending(false);
  };

  /* ═══════════════════════════════════════════
     DELETE CONVERSATION
  ═══════════════════════════════════════════ */
  const deleteConversation = async (id: number) => {
    if (!user?.id) return;

    const previousConversations = conversations;
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);

    if (activeConvId === id) {
      setActiveConvId(filtered[0]?.id ?? null);
    }

    try {
      await ConversationSvc.delete({
        conversation_id: id,
        author_id: Number(user.id),
      });

      setMessagesCache((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      setMsgPage((prev) => {
        const u = { ...prev };
        delete u[id];
        return u;
      });

      setMsgHasMore((prev) => {
        const u = { ...prev };
        delete u[id];
        return u;
      });
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      setConversations(previousConversations);
      if (activeConvId === null) setActiveConvId(id);
    }
  };

  /* ─────────── Auto-scroll to bottom ─────────── */
  useEffect(() => {
    if (shouldScrollRef.current) {
      shouldScrollRef.current = false;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, sending]);

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl md:h-[85vh] md:flex-row">
      {/* ═══════════════ NEW CHAT NAME MODAL ═══════════════ */}
      {newChatModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setNewChatModalOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-1 text-base font-semibold text-white">
              New conversation
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Give your chat a name, or leave it blank for a default one.
            </p>

            <input
              autoFocus
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setNewChatModalOpen(false);
                  createNewChat(newChatName);
                } else if (e.key === "Escape") {
                  setNewChatModalOpen(false);
                }
              }}
              placeholder={`Conversation ${conversations.length + 1}`}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="cursor-pointer flex-1 rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setNewChatModalOpen(false);
                  createNewChat(newChatName);
                }}
                disabled={creating}
                className="cursor-pointer flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 size={14} className="mx-auto animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <div className="flex w-full shrink-0 flex-col border-b border-slate-800 bg-slate-900/80 md:w-64 md:border-b-0 md:border-r">
        {/* New Chat Button */}
        <div className="border-b border-slate-800 p-3 sm:p-4">
          <button
            onClick={() => {
              setNewChatName("");
              setNewChatModalOpen(true);
            }}
            disabled={creating || !user?.id}
            className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-indigo-500 shadow-lg shadow-indigo-900/30"
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
        <div className="flex max-h-44 flex-row gap-2 overflow-x-auto overflow-y-hidden px-3 py-3 md:max-h-none md:flex-1 md:flex-col md:gap-1 md:overflow-y-auto md:overflow-x-hidden">
          {convsLoading ? (
            <div className="flex w-full items-center justify-center gap-2 py-6 text-xs text-slate-400 md:py-10">
              <Loader2 size={14} className="animate-spin" />
              Loading chats…
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center gap-2 py-8 opacity-40 md:py-12">
              <MessagesSquare size={28} />
              <p className="text-xs text-slate-400">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={` cursor-pointer group flex min-w-[180px] items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all md:min-w-0
                  ${
                    activeConvId === conv.id
                      ? "bg-indigo-600 shadow-md shadow-indigo-900/30"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
              >
                <span className="mr-1 truncate flex-1">{conv.name}</span>
                <Trash
                  size={13}
                  className="shrink-0 text-red-400 transition-opacity hover:text-red-300 md:opacity-0 md:group-hover:opacity-100"
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-900">
        {/* ── Top Bar ── */}
        <div className="flex flex-col gap-3 border-b border-slate-800 px-4 py-4 shrink-0 sm:px-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex min-w-0 items-center gap-2 text-slate-300">
            <Bot size={20} className="shrink-0 text-indigo-400" />
            <span className="truncate text-sm font-medium">
              {selectedAgent ? (
                <>
                  Agent:{" "}
                  <span className="font-semibold text-indigo-300">
                    {selectedAgent.agent_name}
                  </span>
                </>
              ) : (
                <span className="italic text-slate-500">No agent selected</span>
              )}
            </span>
          </div>

          {/* Agent Dropdown */}
          <div className="relative w-full md:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((p) => !p)}
              disabled={agentsLoading}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition-all hover:border-indigo-500/60 disabled:opacity-50 md:min-w-[180px] md:w-auto"
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
                className={`shrink-0 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl md:w-64">
                {agents.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-400">
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
                        }}
                        className={`cursor-pointer px-4 py-3 text-sm transition-colors
                          ${
                            selectedAgent?.id === agent.id
                              ? "bg-indigo-600/30 text-indigo-200"
                              : "text-slate-200 hover:bg-slate-700"
                          }`}
                      >
                        <p className="truncate font-medium">
                          {agent.agent_name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
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
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 space-y-4"
        >
          {!activeConversation ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 opacity-40 text-center">
              <MessagesSquare size={48} />
              <p className="text-slate-400 text-sm sm:text-base">
                Start a new chat or select one from the sidebar
              </p>
            </div>
          ) : msgsLoading ? (
            <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              Loading messages…
            </div>
          ) : (
            <>
              {msgHasMore[activeConvId!] && (
                <div className="flex justify-center pb-2">
                  <button
                    onClick={loadMoreMessages}
                    disabled={loadingMore}
                    className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-1.5 text-xs text-slate-300 transition-all hover:border-indigo-500/60 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Loading older messages…
                      </>
                    ) : (
                      "↑ Load older messages"
                    )}
                  </button>
                </div>
              )}

              {activeMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 opacity-40 text-center">
                  <Bot size={40} className="text-indigo-400" />
                  <p className="text-sm text-slate-400">
                    Send a message to begin
                  </p>
                </div>
              ) : (
                activeMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    role={msg.role}
                    content={msg.content}
                  />
                ))
              )}

              {sending && (
                <div className="animate-pulse pl-1 text-sm text-slate-400 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Thinking…
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Input ── */}
        {activeConversation && (
          <div className="shrink-0 px-4 pb-4 sm:px-5 sm:pb-5 md:px-6">
            <ChatInput onSend={submitMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
