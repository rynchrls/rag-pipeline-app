"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../store/auth";
import { JwtPayload } from "../types/jwt.types";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const saveUser = useAuth((state) => state.saveUser);

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
    if (token) {
      const decode: JwtPayload = jwtDecode(token as string);
      saveUser({ id: decode.id, email: decode.sub });
    }
    // Redirect if authorized and trying to access login/register
    if (authorized && isPublicPath) {
      router.replace("/");
    }
  }, [authorized, isPublicPath, pathname, router, saveUser, token]);

  return <>{children}</>;
}
