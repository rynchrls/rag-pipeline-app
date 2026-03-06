"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";
import type { Components } from "react-markdown";

/* ─────────────────────────────────────────────────────────
   Copy-button used inside code blocks
───────────────────────────────────────────────────────── */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md bg-slate-700/60 p-1.5 text-slate-300 transition-all hover:bg-slate-600 hover:text-white sm:right-3 sm:top-3"
      title="Copy code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Markdown component map — styles every element on-brand
───────────────────────────────────────────────────────── */
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isBlock = !!match;
    const rawCode = String(children).replace(/\n$/, "");

    if (isBlock) {
      return (
        <div className="relative my-3 overflow-hidden rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/80 px-3 py-1.5 sm:px-4">
            <span className="pr-10 text-xs font-mono text-slate-400">
              {match[1]}
            </span>
            <CopyButton code={rawCode} />
          </div>

          <div className="overflow-x-auto">
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: "#0f1117",
                fontSize: "0.78rem",
                lineHeight: "1.6",
                padding: "0.875rem 1rem",
                minWidth: "max-content",
              }}
              codeTagProps={{ className: "font-mono" }}
            >
              {rawCode}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    return (
      <code
        className="wrap-break-word rounded-md border border-slate-600/50 bg-slate-700/70 px-1.5 py-0.5 font-mono text-[0.82em] text-indigo-300"
        {...props}
      >
        {children}
      </code>
    );
  },

  h1: ({ children }) => (
    <h1 className="mt-5 mb-2 border-b border-slate-700 pb-1 text-lg font-bold text-white sm:text-xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-4 mb-2 text-base font-bold text-white sm:text-lg">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1.5 text-sm font-semibold text-slate-100 sm:text-base">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-3 mb-1 text-sm font-semibold text-slate-200">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="mt-2 mb-1 text-sm font-medium text-slate-300">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="mt-2 mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
      {children}
    </h6>
  ),

  p: ({ children }) => (
    <p className="my-2 wrap-break-word leading-relaxed text-slate-200 first:mt-0 last:mb-0">
      {children}
    </p>
  ),

  ul: ({ children }) => (
    <ul className="my-2 list-outside list-disc space-y-1 pl-5 text-slate-200">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-outside list-decimal space-y-1 pl-5 text-slate-200">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,

  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-r-lg border-l-4 border-indigo-500 bg-slate-800/40 py-2 pl-4 italic text-slate-400">
      {children}
    </blockquote>
  ),

  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-700">
      <table className="w-full min-w-[520px] text-sm text-slate-200">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-800 text-xs uppercase text-slate-300">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-700/60">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors even:bg-slate-800/30 hover:bg-slate-700/30">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold tracking-wide sm:px-4 sm:py-2.5">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 wrap-break-word sm:px-4 sm:py-2.5">{children}</td>
  ),

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-indigo-400 underline underline-offset-2 transition-colors hover:text-indigo-300"
    >
      {children}
    </a>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-slate-300">{children}</em>,

  hr: () => <hr className="my-4 border-slate-700" />,
};

/* ─────────────────────────────────────────────────────────
   ChatMessage component
───────────────────────────────────────────────────────── */
export default function ChatMessage({
  role,
  content,
}: {
  role: string;
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        <div className="w-fit max-w-[85%] wrap-break-word rounded-2xl bg-indigo-600 px-3.5 py-2.5 text-sm leading-relaxed text-white sm:max-w-xl sm:px-4">
          {content}
        </div>
      ) : (
        <div className="w-full max-w-[95%] rounded-2xl border border-slate-700/60 bg-slate-800/70 px-4 py-3 text-sm sm:max-w-3xl sm:px-5 sm:py-3.5">
          <div className="max-w-full overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
