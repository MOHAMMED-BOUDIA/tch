"use client";

import { useAuth } from "@/lib/auth-context";
import ChatView from "@/components/ChatView";
import PrivateInbox from "@/components/PrivateInbox";

export default function MessagesPage() {
  const { role } = useAuth();
  if (role === "user") return <PrivateInbox />;
  return <ChatView />;
}
