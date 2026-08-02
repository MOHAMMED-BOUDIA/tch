"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PersonProfile from "@/components/PersonProfile";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token || !userId) return;
    fetch(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUserData(data))
      .catch(() => {});
  }, [userId]);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="caption text-ink-muted-48">Loading profile...</p>
      </div>
    );
  }

  return (
    <PersonProfile
      node={{
        id: 0,
        userId: userData.id,
        name: userData.name || userData.username,
        role: userData.role,
        avatar: userData.avatar,
        status: userData.status === "active" ? "online" : "offline",
        x: 0,
        y: 0,
        contribution: "0",
      }}
      connections={[]}
      onBack={() => router.push("/dashboard/network")}
      onMessage={() => router.push(`/dashboard/messages?chatUser=${encodeURIComponent(userData.name || userData.username)}`)}
    />
  );
}