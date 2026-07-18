"use client";

import GraphView from "@/components/GraphView";

export default function NetworkPage() {
  return (
    <div className="h-full">
      <GraphView
        searchQuery=""
        onMessageUser={(node: any) => {}}
        onViewProfile={(node: any) => {}}
      />
    </div>
  );
}
