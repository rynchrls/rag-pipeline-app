"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const func = () => {
      const token = localStorage.getItem("rag_token");
      setIsLoggedIn(!!token);
    };
    func();
  }, []);

  const linkStyle = (path: string) =>
    `inline-flex items-center justify-center h-10 px-4 rounded-lg text-sm font-medium transition whitespace-nowrap ${
      pathname === path
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("rag_token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent sm:text-xl"
        >
          Rag Pipeline
        </Link>

        {isLoggedIn && (
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:w-auto md:justify-end md:overflow-visible md:pb-0">
            <Link href="/chatbox" className={linkStyle("/chatbox")}>
              Chatbox
            </Link>

            <Link href="/pipeline" className={linkStyle("/pipeline")}>
              Pipeline
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-500 whitespace-nowrap"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
