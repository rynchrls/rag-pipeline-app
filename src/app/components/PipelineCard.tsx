"use client";

import Link from "next/link";
import { PipelineStage } from "../types/pipeline.types";
import {
  FileText,
  Layers,
  Calendar,
  User,
  Database,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import PipelineSvc from "@/api/services/pipeline.service";
import { useState, Dispatch, SetStateAction } from "react";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface Props {
  pipeline: PipelineStage;
  setPipelines: Dispatch<SetStateAction<PipelineStage[]>>;
}

export default function PipelineCard({ pipeline, setPipelines }: Props) {
  const chunking = pipeline.rp_metadata?.chunking;
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  const createdAt = new Date(pipeline.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const updatedAt = new Date(pipeline.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await PipelineSvc.del({
        id: pipeline.id,
        author_id: pipeline.author_id,
        email: pipeline.email,
        agent_name: pipeline.agent_name,
      });
      setTimeout(() => {
        setLoading(false);
        addToast("Pipeline deleted successfully", "success");
        setPipelines((prev: PipelineStage[]) =>
          prev.filter((p) => p.id !== pipeline.id),
        );
      }, 500);
    } catch {
      addToast("Pipeline deleted failed", "error");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading1(true);

      if (!pipeline) {
        addToast(
          "Pipeline data is missing. Please restart the process.",
          "error",
        );
        return;
      }

      pipeline.stage = 1;

      const formData = new FormData();

      // Append primitive pipeline fields
      Object.entries(pipeline).forEach(([key, value]) => {
        if (key !== "files" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append rp_metadata as JSON string
      formData.append(
        "rp_metadata",
        JSON.stringify({
          chunking: {
            ...pipeline?.rp_metadata?.chunking,
          },
        }),
      );

      await PipelineSvc.update(formData);

      setTimeout(() => {
        setLoading1(false);
        router.push(
          `/pipeline/create?stage=${pipeline.stage}&id=${pipeline.id}`,
        );
      }, 500);
    } catch (error) {
      addToast((error as Error).message, "error");
    } finally {
      setTimeout(() => {
        setLoading1(false);
      }, 500);
    }
  };

  return (
    <div className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-indigo-500/70 hover:shadow-indigo-900/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-linear-to-r from-indigo-600 via-violet-500 to-cyan-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white truncate leading-tight">
              {pipeline.title}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
              <User size={12} className="shrink-0 text-slate-500" />
              {pipeline.agent_name}
            </p>
          </div>

          {/* Stage badge */}
          <span
            className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${
              pipeline.stage === 4
                ? "bg-emerald-600/15 text-emerald-400 border-emerald-600/40"
                : "bg-indigo-600/15 text-indigo-400 border-indigo-600/40"
            }`}
          >
            {pipeline.stage === 4 ? "Complete" : `Stage ${pipeline.stage}`}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed min-h-10">
          {pipeline.description || "No description provided."}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
            <FileText size={14} className="text-violet-400 shrink-0" />
            <span className="text-xs text-slate-300 truncate">
              <span className="font-semibold text-white">
                {pipeline.file_count}
              </span>{" "}
              Files
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
            <Database size={14} className="text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-300 truncate">
              <span className="font-semibold text-white">
                {pipeline.chunks_count ?? 0}
              </span>{" "}
              Chunks
            </span>
          </div>

          {chunking && (
            <>
              <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                <Layers size={14} className="text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300 truncate capitalize">
                  {chunking.strategy}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
                <Layers size={14} className="text-yellow-400 shrink-0" />
                <span className="text-xs text-slate-300 truncate">
                  <span className="font-semibold text-white">
                    {chunking.size}
                  </span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span className="font-semibold text-white">
                    {chunking.overlap}
                  </span>
                  <span className="text-slate-500 ml-1">overlap</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            Created {createdAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={11} />
            Updated {updatedAt}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleUpdate}
            disabled={loading1}
            className=" cursor-pointer flex items-center justify-center gap-1.5 flex-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150"
          >
            <Pencil size={13} />
            {loading1 ? "Updating..." : "Update"}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className=" cursor-pointer flex items-center justify-center gap-1.5 flex-1 bg-slate-800 hover:bg-red-600/80 active:scale-95 border border-slate-700 hover:border-red-500 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-all duration-150"
          >
            <Trash2 size={13} />
            {loading ? "Deleting..." : "Delete"}
          </button>

          <Link
            href={`/pipeline/create?id=${pipeline.id}&stage=${pipeline.stage}`}
            className=" cursor-pointer flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 p-2 rounded-xl text-slate-400 hover:text-white transition-all duration-150"
          >
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
