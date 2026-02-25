"use client";

import { useEffect, useState, useRef } from "react";
import PipelineCard from "@/app/components/PipelineCard";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PipelinePage() {
  const [pipelines, setPipelines] = useState<unknown[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch(`/api/pipelines?page=${page}`);
    const data = await res.json();

    setPipelines((prev) => [...prev, ...data]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-400">RAG Pipelines</h1>

        <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-500 transition">
          <Plus size={18} />
          <Link href="/pipeline/create">Create Pipeline</Link>
        </button>
      </div>

      {/* Pipeline List */}
      <div
        ref={containerRef}
        className="space-y-6 overflow-y-auto h-[75vh] pr-2"
        onScroll={(e) => {
          const target = e.currentTarget;
          if (
            target.scrollTop + target.clientHeight >=
            target.scrollHeight - 20
          ) {
            loadMore();
          }
        }}
      >
        {pipelines.map((pipeline, index) => (
          <PipelineCard key={index} pipeline={pipeline} />
        ))}

        {loading && (
          <div className="text-center text-slate-400 py-4">Loading...</div>
        )}
      </div>

      {/* {showModal && (
        <CreatePipeline
          onClose={() => setShowModal(false)}
          onCreated={(newPipeline) =>
            setPipelines((prev) => [newPipeline, ...prev])
          }
        />
      )} */}
    </div>
  );
}
