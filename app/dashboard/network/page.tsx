"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import GraphView from "@/components/GraphView";
import { GraphNode } from "@/lib/types";

export default function NetworkPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [fullScreen, setFullScreen] = useState(false);

  const isInteractive = role === "coordinator" || role === "admin";

  const handleViewProfile = useCallback((node: GraphNode) => {
    router.push(`/dashboard/profile/${node.userId}`);
  }, [router]);

  const handleMessageUser = useCallback((node: GraphNode) => {
    router.push(`/dashboard/messages?chatUser=${encodeURIComponent(node.name)}&chatUserId=${node.userId}`);
  }, [router]);

  return (
    <div className={`flex-1 h-full flex flex-col overflow-hidden ${fullScreen ? "fixed inset-0 z-50" : ""}`}>
      <GraphView
        onViewProfile={handleViewProfile}
        onMessageUser={handleMessageUser}
        readOnly={!isInteractive}
        fullScreen={fullScreen}
        onFullScreenChange={setFullScreen}
      />
    </div>
  );
}