"use client";

import { useState } from "react";
import StageLayout from "@/app/components/StageLayout";
import StageLoader from "@/app/components/StageLoader";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";

interface Stage2Props {
  pipelineData: PipelineStage | null | GetPipelineStage;
  onNext: () => void;
  onBack: () => void;
}

export default function Stage2({ pipelineData, onNext, onBack }: Stage2Props) {
  const [loading, setLoading] = useState(false);

  const handleChunking = async () => {
    setLoading(true);

    // 🔥 Replace this with your real API call
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 2000);
  };

  if (loading) {
    return <StageLoader text="Processing document chunking..." />;
  }

  return (
    <StageLayout
      title="Stage 2: Semantic Chunking"
      description="Your uploaded documents will now be transformed into structured knowledge chunks optimized for vector embedding."
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-slate-700 rounded-full" />
      </div>

      {/* Stage 1 Summary */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-3">Pipeline Summary</h3>

        <div className="text-sm text-slate-400 space-y-2">
          <p>
            <span className="text-slate-300">Title:</span> {pipelineData?.title}
          </p>
          <p>
            <span className="text-slate-300">Agent:</span>{" "}
            {pipelineData?.agent_name}
          </p>
          <p>
            <span className="text-slate-300">Author Email:</span>{" "}
            {pipelineData?.email}
          </p>
          <p>
            <span className="text-slate-300">Documents:</span>{" "}
            {pipelineData?.file_count} uploaded
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">
          Uploaded Files ({pipelineData?.file_count})
        </h3>

        {pipelineData?.file_names?.length === 0 ? (
          <p className="text-sm text-slate-500">No files uploaded.</p>
        ) : (
          <ul className="space-y-2 text-sm text-slate-400">
            {pipelineData?.file_names?.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg border border-slate-700"
              >
                <span className="truncate">{file}</span>
                <span className="text-xs text-slate-500">#{index + 1}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* What is Chunking */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-2">
          What Happens During Chunking?
        </h3>

        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          <li>Documents are parsed and cleaned.</li>
          <li>Content is split into semantically meaningful segments.</li>
          <li>Overlapping context windows are applied for better retrieval.</li>
          <li>Each chunk is prepared for embedding in the next stage.</li>
        </ul>
      </div>

      {/* Chunk Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-4">
          Chunking Configuration
        </h3>

        <div className="grid grid-cols-2 gap-6 text-sm text-slate-400">
          <div>
            <p className="text-slate-300 font-medium">Chunk Size</p>
            <p>500 tokens</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Chunk Overlap</p>
            <p>50 tokens</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Strategy</p>
            <p>Recursive semantic splitting</p>
          </div>

          <div>
            <p className="text-slate-300 font-medium">Output</p>
            <p>Structured segments for embedding</p>
          </div>
        </div>
      </div>

      {/* Estimated Processing */}
      <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-4 mb-6">
        <h4 className="text-indigo-400 font-medium mb-2">
          Estimated Processing
        </h4>
        <p className="text-sm text-slate-400">
          {pipelineData?.file_count} file(s) detected. Processing time scales
          based on document size and complexity.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className=" cursor-pointer px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
        >
          ← Back to Setup
        </button>

        <button
          onClick={handleChunking}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Start Chunking →
        </button>
      </div>
    </StageLayout>
  );
}
