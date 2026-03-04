"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PipelineCard from "@/app/components/PipelineCard";
import { Plus, Search, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import PipelineSvc from "@/api/services/pipeline.service";
import { GetPipelines, PipelineStage } from "@/app/types/pipeline.types";
import { useAuth } from "@/app/store/auth";

export default function PipelinePage() {
  const [pipelines, setPipelines] = useState<PipelineStage[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { user } = useAuth();
  const isMounted = useRef(false);

  // ------------------ Debounce Search ------------------
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      // Removed setPipelines([]) to prevent flickering/empty states during search
      setHasNext(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ------------------ Fetch Pipelines ------------------
  const fetchPipelines = useCallback(
    async (pageToFetch: number) => {
      if (loading || !user) return;

      setLoading(true);
      try {
        const response = await PipelineSvc.get_all({
          author_id: Number(user.id),
          page: pageToFetch,
          limit,
          search: debouncedSearch,
        });

        const data = response.data as GetPipelines;

        setPipelines((prev) =>
          pageToFetch === 1 ? data.data : [...prev, ...data.data],
        );

        setHasNext(data.pagination.has_next);
        setPage(pageToFetch + 1);
      } catch (error) {
        console.error("Failed to fetch pipelines:", error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, limit, loading, user],
  );

  // ------------------ Initial + Search Fetch ------------------
  useEffect(() => {
    if (user) {
      fetchPipelines(1);
    }
  }, [debouncedSearch, user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-400">RAG Pipelines</h1>

        <Link
          href="/pipeline/create?stage=1"
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/20"
        >
          <Plus size={18} />
          Create Pipeline
        </Link>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative shrink-0">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search pipelines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {/* Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {pipelines.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl">
              <p className="text-slate-400 text-lg">No pipelines found.</p>
              <p className="text-slate-500 text-sm mt-1">
                Try a different search term or create one.
              </p>
            </div>
          )}

          {pipelines.map((pipeline) => (
            <PipelineCard
              key={pipeline.id}
              pipeline={pipeline}
              setPipelines={setPipelines}
            />
          ))}
        </div>

        {/* Action Bar (Load More / Loading) */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          {loading && (
            <div className="flex items-center gap-3 text-indigo-400 font-medium animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span>Fetching pipelines...</span>
            </div>
          )}

          {!loading && hasNext && pipelines.length > 0 && (
            <button
              onClick={() => fetchPipelines(page)}
              className="group flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all active:scale-95 shadow-lg"
            >
              <span>Load More Pipelines</span>
              <ChevronDown
                size={18}
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </button>
          )}

          {!hasNext && pipelines.length > 0 && (
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div className="h-px w-20 bg-slate-700" />
              <p className="text-slate-500 text-sm italic">
                You&apos;ve reached the end of the collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
