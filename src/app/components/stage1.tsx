"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { X, FileText, AlertTriangle } from "lucide-react";
import StageLayout from "@/app/components/StageLayout";
import PipelineSvc from "@/api/services/pipeline.service";
import { useAuth } from "@/app/store/auth";
import { GetPipelineStage, PipelineStage } from "@/app/types/pipeline.types";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function Stage1({
  onNext,
  pipelineData,
  files,
  setFiles,
}: {
  onNext: (data: PipelineStage) => void;
  pipelineData: PipelineStage | null | GetPipelineStage;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const [title, setTitle] = useState(pipelineData?.title || "");
  const [description, setDescription] = useState(
    pipelineData?.description || "",
  );
  const [agent_name, setAgentName] = useState(pipelineData?.agent_name || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (pipelineData) {
      setTitle(pipelineData.title || "");
      setDescription(pipelineData.description || "");
      setAgentName(pipelineData.agent_name || "");
    }
  }, [pipelineData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Check for invalid file extension
    const invalid = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".md"),
    );
    if (invalid) {
      setError("Only .md files are allowed.");
      return;
    }

    // Check for duplicates
    const duplicates = selectedFiles.find((file) =>
      files.some((f) => f.name === file.name),
    );
    if (duplicates) {
      setError(`File "${duplicates.name}" is already added.`);
      return;
    }

    // Combine existing and new files
    const totalFiles = [...selectedFiles, ...files];

    // Maximum 10 files
    if (totalFiles.length > 10) {
      setError("Maximum 10 .md files allowed.");
      return;
    }

    setError("");
    setFiles(totalFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev: File[]) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles((prev: File[]) => prev.filter((file) => !(file instanceof File)));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fileNames = files.map((file) => file.name);

      const newFiles = files.filter((file) => file instanceof File);

      // if (newFiles.length === 0 && pipelineData?.id) {
      //   setTimeout(() => {
      //     setLoading(false);
      //     router.push(`/pipeline/create?stage=2&id=${pipelineData?.id}`);
      //     onNext(pipelineData);
      //   }, 500);
      //   return;
      // }

      // Prepare FormData
      const formData = new FormData();

      // If updating an existing pipeline, seed all existing fields first
      if (pipelineData?.id) {
        Object.entries(pipelineData).forEach(([key, value]) => {
          if (key !== "files" && value !== undefined && value !== null) {
            formData.append(
              key,
              typeof value === "object" ? JSON.stringify(value) : String(value),
            );
          }
        });

        if (pipelineData.rp_metadata) {
          // Append rp_metadata as JSON string
          formData.append(
            "rp_metadata",
            JSON.stringify({
              chunking: {
                ...pipelineData.rp_metadata?.chunking,
              },
            }),
          );
        }
      }

      // Override with current form values and derived fields
      formData.set("title", title);
      formData.set("agent_name", agent_name);
      formData.set("description", description);
      formData.set("author_id", user?.id as unknown as Blob);
      formData.set("email", user?.email as unknown as Blob);
      formData.set("file_count", files.length as unknown as Blob);
      formData.set("stage", 2 as unknown as Blob);
      formData.set("file_names", fileNames as unknown as Blob);
      newFiles.forEach((file) => {
        formData.append("files", file, file.name);
      });

      const response = await PipelineSvc.add(formData);
      const data = response.data.data as PipelineStage;
      setTimeout(() => {
        setLoading(false);
        addToast(response.data.message, "success");
        router.push(`/pipeline/create?stage=2&id=${data.id}`);
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

  return (
    <StageLayout
      title="Stage 1: Pipeline Initialization"
      description="Initialize your Retrieval-Augmented Generation (RAG) pipeline by defining metadata and uploading knowledge documents."
    >
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-indigo-600 rounded-full" />
        <div className="flex-1 h-2 bg-slate-700 rounded-full" />
        <div className="flex-1 h-2 bg-slate-700 rounded-full" />
      </div>

      {/* Process Overview */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-2">
          What Happens in This Stage?
        </h3>

        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
          <li>Define your pipeline identity and chat agent configuration.</li>
          <li>Upload markdown documents as your knowledge source.</li>
          <li>Documents will be stored and prepared for chunking.</li>
          <li>No embeddings are generated yet — this is setup only.</li>
        </ul>
      </div>

      {/* Configuration Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-3">
            Pipeline Configuration
          </h3>

          <div className="space-y-4">
            <input
              placeholder="Pipeline Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-600"
            />

            <input
              placeholder="RAG Agent Name"
              value={agent_name}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={pipelineData?.id ? true : false}
              className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-600"
            />

            <textarea
              placeholder="Pipeline Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Warning / Info Section */}
        <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-500/90">
          <AlertTriangle size={20} className="text-yellow-400 mt-1" />
          <div>
            <p className="font-semibold">Important File Guidelines</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>
                Only <span className="text-yellow-200">.md</span>(markdown)
                files are allowed.
              </li>
              <li>
                Maximum of <span className="text-yellow-200">10</span> files per
                pipeline.
              </li>
              <li>
                Each file name should clearly represent its content to help with
                semantic chunking later.
              </li>
            </ul>
          </div>
        </div>

        {/* Document Upload Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-3">
            Knowledge Documents
          </h3>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <input
              type="file"
              accept=".md"
              multiple
              onChange={handleFileChange}
              className=" cursor-pointer w-full text-sm text-slate-400"
            />

            <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
              <span>{files.length} / 10 markdown files</span>
              {files.length > 0 && (
                <button
                  onClick={clearFiles}
                  className=" cursor-pointer text-red-400 hover:text-red-300"
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Each document will be parsed and prepared for semantic chunking in
              the next stage.
            </p>
          </div>
        </div>

        {/* File Preview */}
        {files.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto border border-slate-700">
            {files.map((file, index) => {
              const isNewFile = file instanceof File;

              return (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-md"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <FileText size={16} className="text-indigo-400" />
                    <span>{file.name}</span>

                    {!isNewFile && (
                      <span className="text-xs text-yellow-400 ml-2">
                        (Saved file – editable after pipeline creation)
                      </span>
                    )}
                  </div>

                  {isNewFile && (
                    <button
                      onClick={() => removeFile(index)}
                      className=" cursor-pointer text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Next Stage Explanation */}
      <div className="mt-8 bg-indigo-900/20 border border-indigo-700/30 rounded-xl p-4">
        <h4 className="text-indigo-400 font-medium mb-2">
          Next Stage: Document Chunking
        </h4>
        <p className="text-sm text-slate-400">
          After initialization, your documents will be split into semantic
          chunks optimized for embedding. You will review the chunking
          configuration before processing begins.
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push("/pipeline")}
          className=" cursor-pointer px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
        >
          ← Back to Setup
        </button>
        <button
          onClick={handleSubmit}
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

          {loading ? "Initializing..." : "Initialize Pipeline →"}
        </button>
      </div>
    </StageLayout>
  );
}
