"use client";
import { useState } from "react";
import { X, FileText } from "lucide-react";

export default function CreatePipeline({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (pipeline: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [legend, setLegend] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

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
    if (!title || !legend) {
      setError("Title and Legend are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("legend", legend);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/pipelines", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    onCreated(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-semibold text-indigo-400 mb-6">
          Create New Pipeline
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <input
            placeholder="Pipeline Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Legend */}
          <input
            placeholder="Pipeline Legend (Name for Chatbox)"
            value={legend}
            onChange={(e) => setLegend(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* File Upload */}
          <div>
            <input
              type="file"
              accept=".md"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-slate-400"
            />

            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
              <span>{files.length} / 10 files</span>
              {files.length > 0 && (
                <button
                  onClick={clearFiles}
                  className="text-red-400 hover:text-red-300"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* File List Preview */}
          {files.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
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

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
