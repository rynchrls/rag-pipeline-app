export default function StageLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-400 mb-2">{title}</h1>
      <p className="text-slate-400 mb-8">{description}</p>

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800">
        {children}
      </div>
    </div>
  );
}
