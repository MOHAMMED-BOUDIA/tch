"use client";

import { useRouter } from "next/navigation";
import UserLogin from "@/components/UserLogin";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (token: string, role: string, userId: string) => {
    localStorage.setItem("user_token", token);
    localStorage.setItem("user_role", role);
    localStorage.setItem("user_id", userId);
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    const tabs: Record<string, string[]> = {
      user: ["network", "messages", "projects", "portfolio", "settings"],
      coordinator: ["network", "messages", "projects", "portfolio", "settings"],
      admin: ["network", "messages", "projects", "portfolio", "settings", "admin"],
    };
    const roleTabs = tabs[role] ?? tabs.user;
    const defaultTab = roleTabs.find(t => t !== "settings" && t !== "admin") || "settings";
    router.replace(`/dashboard/${defaultTab}`);
  };

  return <UserLogin onLogin={handleLogin} onBackToLanding={() => router.push("/")} />;
}
