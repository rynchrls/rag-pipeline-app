export default function PipelineCard({ pipeline }: { pipeline: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-indigo-400">
        {pipeline.title}
      </h2>
      <p className="text-slate-400 mt-2">{pipeline.description}</p>

      <div className="mt-4 text-sm text-violet-400">
        Legend: {pipeline.legend}
      </div>

      <div className="mt-4 flex gap-2">
        <button className="bg-indigo-600 px-3 py-1 rounded-lg">Update</button>
        <button className="bg-red-600 px-3 py-1 rounded-lg">Delete</button>
      </div>
    </div>
  );
}
