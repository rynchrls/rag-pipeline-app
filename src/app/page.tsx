"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Sparkles,
  Database,
  MessageSquare,
  Upload,
  Search,
  BrainCircuit,
  Workflow,
  Layers3,
} from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "./store/auth";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      auth: { token: user.id },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("server:hello", (data) => {
      console.log("progress", data);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_30%)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-900/40">
                <Sparkles size={40} />
              </div>
            </div>

            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/80 text-sm text-slate-300 mb-6">
              <Layers3 size={16} className="text-indigo-400" />
              Retrieval-Augmented Generation Platform
            </p>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight bg-linear-to-r from-indigo-400 via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Rag Pipeline
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Build document-aware AI agents with structured pipelines, vector
              search, and contextual chat. Upload knowledge sources, chunk and
              index them, retrieve the most relevant context, and generate
              grounded responses through your chat interface.
            </p>

            <div className="mt-10 flex justify-center gap-4 flex-wrap">
              <Link
                href="/chatbox"
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/30"
              >
                Open Chatbox
              </Link>

              <Link
                href="/pipeline"
                className="px-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-900 transition"
              >
                Manage Pipelines
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">Upload</p>
                <p className="text-sm text-slate-400 mt-1">
                  Add markdown knowledge sources
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">Chunk</p>
                <p className="text-sm text-slate-400 mt-1">
                  Split content into retrievable pieces
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">Retrieve</p>
                <p className="text-sm text-slate-400 mt-1">
                  Search relevant context from vectors
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">Generate</p>
                <p className="text-sm text-slate-400 mt-1">
                  Stream grounded AI responses
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">How your RAG app works</h2>
            <p className="mt-3 text-slate-400 max-w-3xl mx-auto">
              Your platform turns uploaded documents into a searchable knowledge
              base, then uses retrieval to ground model responses with relevant
              context before answering the user.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <Upload className="text-indigo-400 mb-4" size={28} />
              <h3 className="text-lg font-semibold mb-2">
                1. Ingest Documents
              </h3>
              <p className="text-sm text-slate-400 leading-6">
                Users create a pipeline, upload markdown files, and define the
                agent that will use those documents as its knowledge source.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <Workflow className="text-violet-400 mb-4" size={28} />
              <h3 className="text-lg font-semibold mb-2">2. Chunk & Index</h3>
              <p className="text-sm text-slate-400 leading-6">
                Files are split into smaller chunks, embedded, and stored in a
                vector database so semantic search can find the most relevant
                parts later.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <Search className="text-fuchsia-400 mb-4" size={28} />
              <h3 className="text-lg font-semibold mb-2">
                3. Retrieve Context
              </h3>
              <p className="text-sm text-slate-400 leading-6">
                During chat, the app searches the vector store using the user’s
                question and retrieves the best-matching chunks as supporting
                context.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <BrainCircuit className="text-indigo-300 mb-4" size={28} />
              <h3 className="text-lg font-semibold mb-2">4. Generate Answer</h3>
              <p className="text-sm text-slate-400 leading-6">
                The LLM receives the system prompt, retrieved context, and
                recent chat history, then streams a grounded response back to
                the user.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-900/20 transition">
              <MessageSquare className="text-indigo-400 mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">Contextual Chat</h3>
              <p className="text-slate-400 text-sm leading-6">
                Chat with an agent tied to a specific pipeline. Each reply can
                use retrieved document context plus recent messages to keep the
                conversation relevant and grounded.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-violet-900/20 transition">
              <Database className="text-violet-400 mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">
                Vector-Powered Search
              </h3>
              <p className="text-slate-400 text-sm leading-6">
                Your knowledge base is not just stored — it is indexed for
                semantic similarity, allowing the system to retrieve useful
                chunks even when wording differs from the source files.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-fuchsia-900/20 transition">
              <Sparkles className="text-indigo-300 mb-4" size={28} />
              <h3 className="text-xl font-semibold mb-2">
                Streaming Responses
              </h3>
              <p className="text-slate-400 text-sm leading-6">
                Responses can be streamed token by token for a smoother user
                experience, while the final assistant message is persisted after
                generation completes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl font-bold">Architecture overview</h2>
                <p className="mt-4 text-slate-400 leading-7">
                  Your app combines a modern frontend, a FastAPI backend, vector
                  retrieval, and an LLM provider into one workflow for
                  document-aware conversations.
                </p>

                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                    Next.js frontend for pipeline management and chat UI
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                    FastAPI backend for ingestion, retrieval, and streaming
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                    Vector database for embeddings and similarity search
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                    LLM provider for grounded answer generation
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <h3 className="text-xl font-semibold mb-4">Request flow</h3>
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                    1. User sends a question from the chatbox
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                    2. Backend retrieves relevant chunks from the selected
                    pipeline
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                    3. Prompt is built with instructions, context, and recent
                    messages
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                    4. LLM streams the answer back to the UI
                  </div>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                    5. Final assistant response is saved to the conversation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pt-6 pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Start building with your pipelines
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Create agents, upload markdown knowledge, and test grounded AI
            conversations from one workspace.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="/pipeline"
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
            >
              Create a Pipeline
            </Link>
            <Link
              href="/chatbox"
              className="px-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-900 transition"
            >
              Try the Chatbox
            </Link>
          </div>

          <div className="mt-14 text-sm text-slate-500">
            © {new Date().getFullYear()} Rag Pipeline • Built by{" "}
            <a
              href="https://github.com/rynchrls"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition"
            >
              Ryan Charles Alcaraz
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
