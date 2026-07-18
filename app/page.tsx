"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default function HomePage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;

  useEffect(() => {
    if (token) {
      const role = localStorage.getItem("user_role");
      const tabs: Record<string, string[]> = {
        user: ["messages", "network", "portfolio", "settings"],
        coordinator: ["network", "messages", "projects", "analytics", "settings"],
        admin: ["network", "messages", "projects", "analytics", "settings", "admin"],
      };
      const roleTabs = tabs[role || "user"];
      const defaultTab = roleTabs?.find(t => t !== "settings" && t !== "admin") || "settings";
      router.replace(`/dashboard/${defaultTab}`);
    }
  }, [token, router]);

  if (token) return null;

  return <LandingPage onGetStarted={() => router.push("/login")} />;
}
