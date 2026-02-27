"use client";

import { useState } from "react";
import StageLayout from "@/app/components/StageLayout";
import StageLoader from "@/app/components/StageLoader";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";

export default function Stage3({
  pipelineData,
  onBack,
}: {
  pipelineData: PipelineStage | null | GetPipelineStage;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleVectorize = async () => {
    setLoading(true);

    // Simulate API call
    await fetch("/api/pipelines/vectorize", {
      method: "POST",
      body: JSON.stringify(pipelineData),
    });

    // Simulate processing time
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 2500);
  };

  if (loading) {
    return <StageLoader text="Saving embeddings to vector database..." />;
  }

  if (completed) {
    return (
      <StageLayout
        title="Pipeline Successfully Deployed"
        description="Your RAG pipeline is now fully operational."
      >
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-6 text-center space-y-4">
          <h3 className="text-green-400 text-xl font-semibold mb-2">
            ✅ Embeddings Successfully Generated
          </h3>

          <p className="text-slate-400">
            All chunks have been embedded and stored in the vector database.
            Your RAG agent is ready to answer queries based on your documents.
          </p>

          <p className="text-slate-400 text-sm">
            Click below to proceed to the chatbox and try your RAG pipeline.
          </p>

          <button
            onClick={() => (window.location.href = `/chatbox`)}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Go to Chatbox →
          </button>
        </div>
      </StageLayout>
    );
  }

  return (
    <StageLayout
      title="Stage 3: Vector Embedding & Indexing"
      description="Transform semantic chunks into vector embeddings and store them in the vector database for intelligent retrieval."
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
      </div>

      {/* Previous Stage Summary */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-3">
          Chunking Output Summary
        </h3>

        <div className="text-sm text-slate-400 space-y-2">
          <p>
            <span className="text-slate-300">Pipeline:</span>{" "}
            {pipelineData?.title}
          </p>
          <p>
            <span className="text-slate-300">Agent:</span>{" "}
            {pipelineData?.agent_name}
          </p>
          <p>
            <span className="text-slate-300">Total Chunks Generated:</span> 0
          </p>
        </div>
      </div>

      {/* What Happens in This Stage */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-2">
          What Happens During Vectorization?
        </h3>

        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          <li>
            Each chunk is converted into a high-dimensional embedding vector.
          </li>
          <li>Vectors capture semantic meaning of the text.</li>
          <li>Embeddings are stored in the vector database.</li>
          <li>An index is created to enable fast similarity search.</li>
        </ul>
      </div>

      {/* Technical Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">
          Embedding Configuration
        </h3>

        <div className="grid grid-cols-2 gap-6 text-sm text-slate-400">
          <div>
            <p className="text-slate-300 font-medium">Embedding Model</p>
            <p>Text Embedding Model (e.g., 1536-dim vectors)</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Vector Dimension</p>
            <p>1536</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Storage</p>
            <p>Vector Database Index</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Search Type</p>
            <p>Cosine Similarity</p>
          </div>
        </div>
      </div>

      {/* System Notice */}
      <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-4 mb-6">
        <h4 className="text-indigo-400 font-medium mb-2">Final Step</h4>
        <p className="text-sm text-slate-400">
          Once embeddings are stored, your RAG pipeline becomes fully
          operational. The agent will be able to retrieve context-aware answers
          from your documents.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
        >
          ← Back to Chunking
        </button>

        <button
          onClick={handleVectorize}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Proceed to Next Step →
        </button>
      </div>
    </StageLayout>
  );
}
