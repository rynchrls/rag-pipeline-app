export default function StageLoader({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-slate-400">{text}</p>
    </div>
  );
}
