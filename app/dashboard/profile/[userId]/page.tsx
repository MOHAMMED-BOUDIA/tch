"use client";

import { useParams } from "next/navigation";
import PersonProfile from "@/components/PersonProfile";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  return (
    <PersonProfile
      node={{ id: 0, name: "", role: "", avatar: "", status: "offline" as const, x: 0, y: 0, contribution: "" }}
      connections={[]}
      onBack={() => window.history.back()}
      onMessage={() => {}}
    />
  );
}
