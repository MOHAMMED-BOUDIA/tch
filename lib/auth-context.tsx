"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  role: string | null;
  userId: string | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  userId: null,
  logout: () => {},
  isAuthenticated: false,
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

function syncAuthFromCookies(): { token: string | null; role: string | null; userId: string | null } {
  const cookieToken = getCookie("token");
  if (cookieToken) {
    const payload = parseJwtPayload(cookieToken);
    if (payload && payload.userId && payload.role) {
      const uid = String(payload.userId);
      const rol = String(payload.role);
      localStorage.setItem("user_token", cookieToken);
      localStorage.setItem("user_role", rol);
      localStorage.setItem("user_id", uid);
      return { token: cookieToken, role: rol, userId: uid };
    }
  }
  const t = localStorage.getItem("user_token");
  const r = localStorage.getItem("user_role");
  const u = localStorage.getItem("user_id");
  return { token: t, role: r, userId: u };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { token: t, role: r, userId: u } = syncAuthFromCookies();
    setToken(t);
    setRole(r);
    setUserId(u);
    setReady(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("current_tab");
    document.cookie = "token=; path=/; max-age=0";
    setToken(null);
    setRole(null);
    setUserId(null);
    router.replace("/");
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ token, role, userId, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
