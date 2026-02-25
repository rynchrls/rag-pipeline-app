"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Compute auth state synchronously during render — no effect needed
  const token =
    typeof window !== "undefined" ? localStorage.getItem("rag_token") : null;
  const authorized = !!token;

  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // Redirect if not authorized and trying to access protected page
    if (!authorized && !isPublicPath) {
      router.replace("/login");
    }

    // Redirect if authorized and trying to access login/register
    if (authorized && isPublicPath) {
      router.replace("/");
    }
  }, [authorized, isPublicPath, pathname, router]);

  return <>{children}</>;
}
