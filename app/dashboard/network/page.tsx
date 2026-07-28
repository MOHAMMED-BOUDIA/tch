"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GraphView from "@/components/GraphView";
import { GraphNode } from "@/lib/types";

export default function NetworkPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [search, setSearch] = useState("");

  const isInteractive = role === "coordinator" || role === "admin";

  const handleViewProfile = useCallback((node: GraphNode) => {
    router.push(`/dashboard/profile/${node.userId}`);
  }, [router]);

  const handleMessageUser = useCallback((node: GraphNode) => {
    router.push(`/dashboard/messages?chatUser=${encodeURIComponent(node.name)}`);
  }, [router]);

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1E293B] bg-[#111827]/50 shrink-0">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search network..."
            className="w-full h-9 bg-[#0F172A] border border-[#1E293B] rounded-xl pl-9 pr-3 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40 transition-all"
          />
        </div>
        <span className="text-[10px] text-[#475569] font-medium">{isInteractive ? "Interactive Mode" : "View Only"}</span>
      </div>
      <GraphView
        searchQuery={search}
        onViewProfile={handleViewProfile}
        onMessageUser={handleMessageUser}
        readOnly={!isInteractive}
      />
    </div>
  );
}
