"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("rag_token");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(!!token);
    }
  }, []);

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-lg transition ${
      pathname === path ? "bg-indigo-600" : "hover:bg-slate-800"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("rag_token");
    window.location.href = "/login";
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
      <h1 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
        <Link href="/">Rag Pipeline</Link>
      </h1>

      <div className="flex gap-2 items-center">
        <Link href="/chatbox" className={linkStyle("/chatbox")}>
          Chatbox
        </Link>
        <Link href="/pipeline" className={linkStyle("/pipeline")}>
          Pipeline
        </Link>

        {/* Conditional Logout Button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className=" cursor-pointer flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 transition text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
