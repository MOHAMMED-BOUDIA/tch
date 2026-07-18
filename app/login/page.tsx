"use client";

import { useRouter } from "next/navigation";
import UserLogin from "@/components/UserLogin";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (token: string, role: string, userId: string) => {
    localStorage.setItem("user_token", token);
    localStorage.setItem("user_role", role);
    localStorage.setItem("user_id", userId);
    const tabs: Record<string, string[]> = {
      user: ["messages", "network", "portfolio", "settings"],
      coordinator: ["network", "messages", "projects", "analytics", "settings"],
      admin: ["network", "messages", "projects", "analytics", "settings", "admin"],
    };
    const roleTabs = tabs[role] ?? tabs.user;
    const defaultTab = roleTabs.find(t => t !== "settings" && t !== "admin") || "settings";
    router.replace(`/dashboard/${defaultTab}`);
  };

  return <UserLogin onLogin={handleLogin} onBackToLanding={() => router.push("/")} />;
}
