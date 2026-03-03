"use client";

import { useState } from "react";
import StageLayout from "@/app/components/StageLayout";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";
import { useToast } from "@/context/ToastContext";
import PipelineSvc from "@/api/services/pipeline.service";

export default function Stage3({
  pipelineData,
  onBack,
}: {
  pipelineData: PipelineStage | null | GetPipelineStage;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { addToast } = useToast();

  // const handleFinish = async () => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     setLoading(false);
  //     setCompleted(true);
  //   }, 1800);
  // };

  const handleFinish = async () => {
    try {
      setLoading(true);

      if (!pipelineData) {
        addToast(
          "Pipeline data is missing. Please restart the process.",
          "error",
        );
        return;
      }

      pipelineData.stage = 4;

      const formData = new FormData();

      // Append primitive pipeline fields
      Object.entries(pipelineData).forEach(([key, value]) => {
        if (key !== "files" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append rp_metadata as JSON string
      formData.append(
        "rp_metadata",
        JSON.stringify({
          chunking: {
            ...pipelineData?.rp_metadata?.chunking,
          },
        }),
      );

      await PipelineSvc.update(formData);

      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
      }, 1800);
    } catch (error) {
      addToast((error as Error).message, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  };

  /* ===============================
     SUCCESS STATE
  =============================== */
  if (completed) {
    return (
      <StageLayout
        title="🎉 Agent Successfully Activated"
        description="Your Retrieval-Augmented Generation system is now live and ready for intelligent interaction."
      >
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-6 text-center space-y-5">
          <h3 className="text-green-400 text-xl font-semibold">
            ✅ {pipelineData?.agent_name} is Live
          </h3>

          <p className="text-slate-400">
            {pipelineData?.chunks?.length || 0} chunks are indexed and ready for
            semantic retrieval across {pipelineData?.file_count} documents.
          </p>

          <div className="text-sm text-slate-400 space-y-2">
            <p className="font-medium text-slate-300">
              During every user query, the system will automatically:
            </p>
            <ul className="space-y-1">
              <li>• Convert the question into a semantic embedding</li>
              <li>• Perform similarity search against your vector index</li>
              <li>• Retrieve the most relevant knowledge chunks</li>
              <li>• Augment the LLM prompt with contextual data</li>
              <li>• Generate grounded, knowledge-based responses</li>
            </ul>
          </div>

          <button
            onClick={() => (window.location.href = `/chatbox`)}
            className=" cursor-pointer px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Start Chatting →
          </button>
        </div>
      </StageLayout>
    );
  }

  /* ===============================
     MAIN STAGE
  =============================== */
  return (
    <StageLayout
      title="Stage 3: RAG Runtime Activation"
      description="Your knowledge base is fully indexed. This final step enables automatic query embedding and contextual augmentation at runtime."
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
      </div>

      {/* Pipeline Overview */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-3">
          Pipeline Overview
        </h3>

        <div className="text-sm text-slate-400 space-y-2">
          <p>
            <span className="text-slate-300">Pipeline ID:</span>{" "}
            {pipelineData?.id}
          </p>

          <p>
            <span className="text-slate-300">Title:</span> {pipelineData?.title}
          </p>

          <p>
            <span className="text-slate-300">Agent Name:</span>{" "}
            {pipelineData?.agent_name}
          </p>

          <p>
            <span className="text-slate-300">Author:</span>{" "}
            {pipelineData?.email}
          </p>

          <p>
            <span className="text-slate-300">Created:</span>{" "}
            {new Date(
              pipelineData?.created_at as unknown as string,
            ).toLocaleString()}
          </p>

          <p>
            <span className="text-slate-300">Last Updated:</span>{" "}
            {new Date(
              pipelineData?.updated_at as unknown as string,
            ).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Knowledge Base Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">
          Knowledge Base Summary
        </h3>

        <div className="text-sm text-slate-400 space-y-2">
          <p>
            <span className="text-slate-300">Documents:</span>{" "}
            {pipelineData?.file_count}
          </p>

          <p>
            <span className="text-slate-300">Chunks Indexed:</span>{" "}
            {pipelineData?.chunks?.length || 0}
          </p>

          <p>
            <span className="text-slate-300">Chunking Strategy:</span>{" "}
            {pipelineData?.rp_metadata?.chunking?.strategy}
          </p>

          <p>
            <span className="text-slate-300">Chunk Size:</span>{" "}
            {pipelineData?.rp_metadata?.chunking?.size} tokens
          </p>

          <p>
            <span className="text-slate-300">Chunk Overlap:</span>{" "}
            {pipelineData?.rp_metadata?.chunking?.overlap} tokens
          </p>
        </div>
      </div>

      {/* Runtime Explanation */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-3">
          Runtime Query Intelligence
        </h3>

        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          <li>All document chunks are already embedded and indexed.</li>
          <li>User queries will be embedded automatically at runtime.</li>
          <li>Similarity search will retrieve the most relevant context.</li>
          <li>
            Query augmentation will inject retrieved chunks into the prompt.
          </li>
          <li>The LLM will generate grounded, knowledge-aware responses.</li>
        </ul>
      </div>

      {/* Final Notice */}
      <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-5 mb-6">
        <h4 className="text-indigo-400 font-medium mb-2">
          Your Agent Is Ready 🚀
        </h4>

        <p className="text-sm text-slate-400">
          Chunking and vector indexing are complete.
        </p>

        <p className="text-sm text-slate-400 mt-2">
          Query embedding and augmentation will run automatically in the
          background whenever users interact with your agent.
        </p>

        <p className="text-sm text-slate-400 mt-2">
          Click{" "}
          <span className="text-indigo-400 font-medium">Finish Pipeline</span>{" "}
          to start using{" "}
          <span className="text-indigo-400 font-medium">
            {pipelineData?.agent_name}
          </span>
          .
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className=" cursor-pointer px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
        >
          ← Back
        </button>

        <button
          onClick={handleFinish}
          disabled={loading}
          className={` cursor-pointer px-6 py-2 rounded-lg transition flex items-center gap-2
      ${
        loading
          ? "bg-indigo-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-500"
      }`}
        >
          {loading && (
            <span className=" cursor-pointer w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {loading ? "Initializing..." : "Finish Pipeline →"}
        </button>
      </div>
    </StageLayout>
  );
}
