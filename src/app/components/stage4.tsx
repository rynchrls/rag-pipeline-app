"use client";

import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";
import StageLayout from "@/app/components/StageLayout";
import { useEffect, useState } from "react";

export default function Stage4({
  pipelineData,
}: {
  pipelineData: PipelineStage | null;
}) {
  const [pipeline, setPipeline] = useState<
    PipelineStage | null | GetPipelineStage
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const func = () => {
      if (pipelineData) {
        setPipeline(pipelineData);
        setLoading(false);
      }
    };
    func();
  }, [pipelineData]);

  if (loading) {
    return (
      <StageLayout title="Loading Pipeline..." description="">
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </StageLayout>
    );
  }

  if (!pipeline) {
    return (
      <StageLayout title="Pipeline Not Found" description="">
        <div className="text-center text-red-400">Pipeline does not exist.</div>
      </StageLayout>
    );
  }

  return (
    <StageLayout
      title={`📊 ${pipeline.title}`}
      description="Complete Retrieval-Augmented Generation pipeline overview."
    >
      {/* ================= ACTIVATION BANNER ================= */}
      <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-6 mb-6 text-center">
        <h2 className="text-green-400 text-xl font-semibold mb-2">
          ✅ Agent Fully Activated
        </h2>

        <p className="text-slate-400 text-sm mb-2">
          <span className="text-slate-300 font-medium">
            {pipeline.agent_name}
          </span>{" "}
          is now completely configured, indexed, and ready to handle
          knowledge-based queries.
        </p>

        <p className="text-slate-400 text-sm">
          All documents have been chunked, embedded, and stored in the vector
          index. Runtime semantic retrieval is enabled.
        </p>

        <button
          onClick={() => (window.location.href = "/chatbox")}
          className="mt-5 cursor-pointer px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          🚀 Start Chatting →
        </button>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">
          General Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
          <p>
            <span className="text-slate-300">Pipeline ID:</span> {pipeline.id}
          </p>
          <p>
            <span className="text-slate-300">Agent Name:</span>{" "}
            {pipeline.agent_name}
          </p>
          <p>
            <span className="text-slate-300">Author:</span> {pipeline.email}
          </p>
          <p>
            <span className="text-slate-300">Stage:</span> {pipeline.stage}
          </p>
          <p>
            <span className="text-slate-300">Created:</span>{" "}
            {new Date(pipeline.created_at as Date).toLocaleString()}
          </p>
          <p>
            <span className="text-slate-300">Updated:</span>{" "}
            {new Date(pipeline.updated_at as Date).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ================= FILES ================= */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">
          📂 Documents ({pipeline.file_count})
        </h3>

        <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-400">
          {pipeline.file_names?.map((file, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3"
            >
              {file}
            </div>
          ))}
        </div>
      </div>

      {/* ================= CHUNKING CONFIG ================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">
          🧠 Chunking Configuration
        </h3>

        <div className="text-sm text-slate-400 space-y-2">
          <p>
            <span className="text-slate-300">Strategy:</span>{" "}
            {pipeline.rp_metadata?.chunking?.strategy}
          </p>

          <p>
            <span className="text-slate-300">Chunk Size:</span>{" "}
            {pipeline.rp_metadata?.chunking?.size} tokens
          </p>

          <p>
            <span className="text-slate-300">Overlap:</span>{" "}
            {pipeline.rp_metadata?.chunking?.overlap} tokens
          </p>

          <p>
            <span className="text-slate-300">Include Metadata:</span>{" "}
            {pipeline.rp_metadata?.chunking?.include_metadata ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* ================= CHUNKS ================= */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-4">
          🔎 Indexed Chunks ({pipeline.chunks?.length})
        </h3>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {pipeline.chunks?.map((chunk, index) => (
            <div
              key={chunk.chunk_id}
              className="bg-slate-900 border border-slate-700 rounded-lg p-4"
            >
              <p className="text-xs text-indigo-400 mb-1">Chunk #{index + 1}</p>

              <p className="text-xs text-slate-500 mb-2">
                Document: {chunk.title}
              </p>

              <p className="text-sm text-slate-300 whitespace-pre-wrap">
                {chunk.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </StageLayout>
  );
}
