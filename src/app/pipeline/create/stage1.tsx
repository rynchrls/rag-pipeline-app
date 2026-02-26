"use client";

import { useState } from "react";
import { X, FileText, AlertTriangle } from "lucide-react";
import StageLayout from "@/app/components/StageLayout";
import StageLoader from "@/app/components/StageLoader";

export default function Stage1({ onNext }: { onNext: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [agent_name, setAgentName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const invalid = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith(".md"),
    );

    if (invalid) {
      setError("Only .md files are allowed.");
      return;
    }

    const totalFiles = [...files, ...selectedFiles];

    if (totalFiles.length > 10) {
      setError("Maximum 10 .md files allowed.");
      return;
    }

    setError("");
    setFiles(totalFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("agent_name", agent_name);
    formData.append("description", description);

    files.forEach((file, index) => {
      formData.append("files", file, file.name); // key can be same "files" for multiple files
    });

    setTimeout(() => {
      setLoading(false);
      onNext({
        pipelineId: "testing",
        title,
        description,
        agent_name,
        fileCount: files.length,
      });
    }, 1200);
  };

  if (loading) {
    return <StageLoader text="Saving pipeline details..." />;
  }

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
              className="w-full text-sm text-slate-400"
            />

            <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
              <span>{files.length} / 10 markdown files</span>
              {files.length > 0 && (
                <button
                  onClick={clearFiles}
                  className="text-red-400 hover:text-red-300"
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
            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded-md"
              >
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <FileText size={16} className="text-indigo-400" />
                  {file.name}
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
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
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
        >
          Initialize Pipeline →
        </button>
      </div>
    </StageLayout>
  );
}
