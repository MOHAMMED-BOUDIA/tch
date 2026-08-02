import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Search, Send, ArrowLeft, User } from "lucide-react";
import SearchInput from "./ui/SearchInput";

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastTime: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export default function PrivateInbox() {
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  const searchParams = useSearchParams();
  const chatUserName = searchParams.get("chatUser");
  const chatUserId = searchParams.get("chatUserId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(chatUserId);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(chatUserName);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/messages/conversations", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setConversations(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!selectedUser || !token) return;
    fetch(`/api/messages/conversation/${selectedUser}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setMessages(data))
      .catch(() => {});
  }, [selectedUser, token]);

  useEffect(() => {
    if (chatUserId) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!newMsg.trim() || !selectedUser || !token) return;
    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: selectedUser, content: newMsg }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setNewMsg("");
    }
  }, [newMsg, selectedUser, token]);

  const filtered = conversations.filter((c) =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-hairline flex flex-col shrink-0 bg-canvas">
        <div className="p-3 border-b border-hairline">
          <h2 className="caption-strong text-ink mb-3">Inbox</h2>
          <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <p className="caption text-ink-muted-48 text-center py-8">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="caption text-ink-muted-48 text-center py-8">No conversations</p>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => { setSelectedUser(conv.userId); setSelectedUserName(conv.userName); }}
                className={`w-full flex items-center gap-3 px-3 py-3 transition-all cursor-pointer text-left ${
                  selectedUser === conv.userId
                    ? "bg-primary/5 border-l-2 border-primary"
                    : "hover:bg-canvas-parchment border-l-2 border-transparent"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-ink-muted-48" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="caption-strong text-ink truncate">{conv.userName}</p>
                  <p className="fine-print text-ink-muted-48 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-canvas-parchment">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-14 h-14 rounded-xs bg-canvas border border-hairline flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-ink-muted-48" />
              </div>
              <p className="body text-ink-muted-48">Select a conversation</p>
              <p className="caption text-ink-muted-48 mt-1">Choose from the sidebar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 border-b border-hairline bg-canvas">
              <button onClick={() => setSelectedUser(null)} className="md:hidden cursor-pointer text-ink-muted-48 hover:text-ink">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center">
                <User className="w-4 h-4 text-ink-muted-48" />
              </div>
              <span className="caption-strong text-ink">{selectedUserName || conversations.find((c) => c.userId === selectedUser)?.userName || "User"}</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="caption text-ink-muted-48 text-center py-8">No messages yet. Say hello!</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === userId;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-3.5 py-2 rounded-xs ${
                        isMe ? "bg-primary text-white" : "bg-canvas border border-hairline text-ink"
                      }`}>
                        <p className="caption">{msg.content}</p>
                        <p className={`fine-print mt-1 ${isMe ? "text-white/70" : "text-ink-muted-48"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-hairline bg-canvas">
              <div className="flex items-center gap-2">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder="Type a message..."
                  className="flex-1 h-10 bg-canvas-parchment border border-hairline rounded-xs px-3 caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMsg.trim()}
                  className="w-10 h-10 rounded-xs bg-primary hover:bg-primary-focus flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}