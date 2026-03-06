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
      <body className="min-h-screen bg-slate-950 text-white">
        <ToastProvider>
          <AuthGuard>
            <div className="flex min-h-screen flex-col">
              <Navbar />

              <main className="w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div className="mx-auto w-full max-w-7xl">{children}</div>
              </main>
            </div>
          </AuthGuard>
        </ToastProvider>
      </body>
    </html>
  );
}
