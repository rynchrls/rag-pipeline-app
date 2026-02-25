import { ToastProvider } from "@/context/ToastContext";
import AuthGuard from "./components/AuthGuard";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Rag Pipeline",
  description: "Modern RAG Pipeline Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        <Navbar />
        <ToastProvider>
          <AuthGuard>
            <main className="p-6 max-w-7xl mx-auto">{children}</main>
          </AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
