"use client";

import { useState } from "react";
import StageLayout from "@/app/components/StageLayout";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import PipelineSvc from "@/api/services/pipeline.service";

interface Stage2Props {
  pipelineData: PipelineStage | null | GetPipelineStage;
  onNext: (chunkData: PipelineStage | null | GetPipelineStage) => void;
  onBack: () => void;
}

export default function Stage2({ pipelineData, onNext, onBack }: Stage2Props) {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const [chunkSize, setChunkSize] = useState(
    pipelineData?.rp_metadata?.chunking.size || 500,
  );
  const [chunkOverlap, setChunkOverlap] = useState(
    pipelineData?.rp_metadata?.chunking.overlap || 50,
  );
  const [strategy, setStrategy] = useState(
    pipelineData?.rp_metadata?.chunking.strategy || "ai_semantic",
  );

  const [includeMetadata, setIncludeMetadata] = useState<unknown>(
    pipelineData?.rp_metadata?.chunking.include_metadata !== null
      ? pipelineData?.rp_metadata?.chunking.include_metadata
      : true,
  );
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!pipelineData) {
        addToast(
          "Pipeline data is missing. Please restart the process.",
          "error",
        );
        return;
      }

      pipelineData.stage = 3;

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
            size: chunkSize,
            overlap: chunkOverlap,
            strategy: strategy,
            created_at: new Date().toISOString(), // important: serialize date
            include_metadata: includeMetadata,
          },
        }),
      );

      const response = await PipelineSvc.update(formData);

      const data = response.data.data as PipelineStage;

      setTimeout(() => {
        setLoading(false);
        addToast(response.data.message, "success");
        router.push(`/pipeline/create?stage=3&id=${data.id}`);
        onNext(data);
      }, 500);
    } catch (error) {
      addToast((error as Error).message, "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const isInvalidChunkConfig =
    !chunkSize ||
    !chunkOverlap ||
    chunkSize <= chunkOverlap ||
    chunkSize < 1 ||
    chunkOverlap < 0;

  const isDisabled = loading || isInvalidChunkConfig;

  return (
    <StageLayout
      title="Stage 2: Chunking & Vector Preparation"
      description="Configure how your uploaded documents will be segmented and prepared for vector database storage to enable intelligent semantic retrieval."
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-slate-700 rounded-full" />
      </div>

      {/* Pipeline Summary */}
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

      {/* Uploaded Files */}
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

      {/* What Happens During Chunking */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-2">
          What Happens During This Stage?
        </h3>
        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          <li>Documents are parsed and normalized.</li>
          <li>Text is segmented using your selected chunking strategy.</li>
          <li>Overlapping windows preserve contextual continuity.</li>
          <li>Metadata is optionally attached to each chunk.</li>
          <li>
            Chunks are prepared for embedding and vector database storage.
          </li>
        </ul>
      </div>

      {/* Chunk Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-6">
          Chunking Configuration
        </h3>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <label className="text-slate-300 font-medium block mb-2">
              Chunk Size (tokens)
            </label>
            <select
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className=" cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value={256}>256</option>
              <option value={500}>500 (Recommended)</option>
              <option value={750}>750</option>
              <option value={1000}>1000</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-2">
              Chunk Overlap (tokens)
            </label>
            <select
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className=" cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value={0}>0</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-2">
              Chunking Strategy
            </label>

            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className=" cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value="ai_semantic">
                AI Semantic Strategy (Recommended)
              </option>
              <option value="sentence">Sentence-Based (High Precision)</option>
              <option value="paragraph">
                Paragraph-Based (Natural Structure)
              </option>
            </select>

            <p className="text-xs text-slate-500 mt-2">
              AI Semantic Strategy dynamically detects topic boundaries using
              contextual similarity analysis for optimal retrieval performance.
            </p>
          </div>

          <div>
            <label className="text-slate-300 font-medium block mb-2">
              Include Metadata
            </label>
            <select
              value={includeMetadata ? "yes" : "no"}
              onChange={(e) => setIncludeMetadata(e.target.value === "yes")}
              className=" cursor-pointer w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className=" cursor-pointer px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
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

          {loading ? "Initializing..." : "Start Chunking →"}
        </button>
      </div>
    </StageLayout>
  );
}
