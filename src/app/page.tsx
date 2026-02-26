"use client";
import Link from "next/link";
import { Sparkles, Database, MessageSquare } from "lucide-react";
import { useAuth } from "./store/auth";

export default function Home() {
  const users = useAuth((state) => state.user);
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full text-center">
        {users?.email}
        {/* Hero Section */}
        <div className="mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-xl">
              <Sparkles size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            Rag Pipeline
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            A modern Retrieval-Augmented Generation platform designed for
            intelligent document pipelines and contextual AI conversations.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            <Link
              href="/chatbox"
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition shadow-lg"
            >
              Go to Chatbox
            </Link>

            <Link
              href="/pipeline"
              className="px-8 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition"
            >
              Manage Pipelines
            </Link>
          </div>
        </div>
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-900/30 transition">
            <MessageSquare className="text-indigo-400 mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Smart Chat Interface</h3>
            <p className="text-slate-400 text-sm">
              Interact with AI using selectable RAG pipelines to enhance
              contextual responses.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-900/30 transition">
            <Database className="text-violet-400 mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">Modular Pipelines</h3>
            <p className="text-slate-400 text-sm">
              Create and manage document-based pipelines with structured
              Markdown sources.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-900/30 transition">
            <Sparkles className="text-indigo-300 mb-4" size={28} />
            <h3 className="text-xl font-semibold mb-2">
              Scalable RAG Architecture
            </h3>
            <p className="text-slate-400 text-sm">
              Designed to integrate seamlessly with your FastAPI backend and
              vector database.
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-16 text-sm text-slate-500">
          © {new Date().getFullYear()} Rag Pipeline • Built by{" "}
          <a
            href="https://github.com/rag-pipeline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ryan Charles Alcaraz
          </a>
        </div>
      </div>
    </div>
  );
}
