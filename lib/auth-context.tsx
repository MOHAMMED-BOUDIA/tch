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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("user_token"));
    setRole(localStorage.getItem("user_role"));
    setUserId(localStorage.getItem("user_id"));
    setReady(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("current_tab");
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
