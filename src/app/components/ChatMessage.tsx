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
      className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
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
  // ── Code blocks & inline code ──
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isBlock = !!match;
    const rawCode = String(children).replace(/\n$/, "");

    if (isBlock) {
      return (
        <div className="relative my-3 rounded-xl overflow-hidden border border-slate-700/60">
          {/* Language badge */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/80 border-b border-slate-700/60">
            <span className="text-xs font-mono text-slate-400">{match[1]}</span>
            <CopyButton code={rawCode} />
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: "#0f1117",
              fontSize: "0.8rem",
              lineHeight: "1.6",
              padding: "1rem 1.25rem",
            }}
            codeTagProps={{ className: "font-mono" }}
          >
            {rawCode}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-slate-700/70 text-indigo-300 font-mono text-[0.82em] border border-slate-600/50"
        {...props}
      >
        {children}
      </code>
    );
  },

  // ── Headings ──
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-white mt-5 mb-2 border-b border-slate-700 pb-1">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-white mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-100 mt-3 mb-1.5">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-slate-200 mt-3 mb-1">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-sm font-medium text-slate-300 mt-2 mb-1">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-xs font-medium text-slate-400 mt-2 mb-1 uppercase tracking-wide">
      {children}
    </h6>
  ),

  // ── Paragraphs ──
  p: ({ children }) => (
    <p className="leading-relaxed text-slate-200 my-2 first:mt-0 last:mb-0">
      {children}
    </p>
  ),

  // ── Lists ──
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 my-2 space-y-1 text-slate-200">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 my-2 space-y-1 text-slate-200">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,

  // ── Blockquotes ──
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-indigo-500 pl-4 my-3 italic text-slate-400 bg-slate-800/40 py-2 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // ── Tables (GFM) ──
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-slate-700">
      <table className="w-full text-sm text-slate-200">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-800 text-slate-300 text-xs uppercase">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-700/60">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="even:bg-slate-800/30 hover:bg-slate-700/30 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left font-semibold tracking-wide">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-4 py-2.5">{children}</td>,

  // ── Links ──
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  // ── Text formatting ──
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-slate-300">{children}</em>,

  // ── Horizontal rule ──
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {isUser ? (
        /* ── User bubble: plain text, right-aligned ── */
        <div className="max-w-xl px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm leading-relaxed">
          {content}
        </div>
      ) : (
        /* ── System bubble: rich markdown, left-aligned ── */
        <div className="max-w-3xl w-full px-5 py-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 text-sm">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
