import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Search, Send, ArrowLeft, User } from "lucide-react";

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastTime: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  created_at: string;
  isMine: boolean;
}

import { API_URL } from "@/lib/client-env";
const API = API_URL;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function PrivateInbox() {
  const token = localStorage.getItem("user_token") || "";
  const currentUserId = localStorage.getItem("user_id") || "";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/messages/conversations`, { headers });
      if (res.ok) setConversations(await res.json());
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchConversations().finally(() => setLoading(false));
  }, [fetchConversations]);

  useEffect(() => {
    if (!activeUserId) return;
    (async () => {
      try {
        const res = await fetch(`${API}/api/messages/conversation/${activeUserId}`, { headers });
        if (res.ok) setMessages(await res.json());
      } catch { /* ignore */ }
    })();
  }, [activeUserId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/users/search?q=${encodeURIComponent(searchQuery)}`, { headers });
        if (res.ok) setSearchResults(await res.json());
      } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sendMessage = async () => {
    if (!inputText.trim() || !activeUserId) return;
    const content = inputText.trim();
    setInputText("");
    try {
      const res = await fetch(`${API}/api/messages/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({ receiverId: activeUserId, content }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
        fetchConversations();
      }
    } catch { /* ignore */ }
  };

  const startConversation = (user: any) => {
    setActiveUserId(user.id);
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!activeUserId) {
    return (
      <div className="h-full flex">
        <div className="flex-1 p-8 max-w-[1300px] mx-auto overflow-y-auto h-full custom-scrollbar">
          <div className="flex justify-between items-center pb-4 border-b border-[#1E293B] mb-6">
            <div>
              <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Inbox</h1>
              <p className="text-xs text-[#94A3B8] mt-1">Private messages</p>
            </div>
            <button onClick={() => setShowSearch(p => !p)} className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
              <Search className="w-4 h-4" /> New Message
            </button>
          </div>

          {showSearch && (
            <div className="mb-6 bg-[#111827] rounded-2xl border border-[#1E293B] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full h-10 bg-[#0F172A] border border-[#1E293B] rounded-xl pl-10 pr-4 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-1">
                  {searchResults.filter(u => u.id !== currentUserId).map(u => (
                    <button key={u.id} onClick={() => startConversation(u)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#0F172A] transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-xs font-bold text-[#94A3B8] overflow-hidden">
                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-[#F8FAFC]">{u.name}</p>
                        <p className="text-[10px] text-[#94A3B8] capitalize">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <p className="text-xs text-[#475569] mt-3 text-center">No users found</p>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-[#475569]" />
              </div>
              <p className="text-xs text-[#94A3B8]">No conversations yet</p>
              <p className="text-[10px] text-[#475569] mt-1">Search for a user to send a message</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map(conv => (
                <button key={conv.userId} onClick={() => setActiveUserId(conv.userId)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-[#111827] transition-colors border border-transparent hover:border-[#1E293B] cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-sm font-bold text-[#94A3B8] overflow-hidden shrink-0">
                    {conv.userAvatar ? <img src={conv.userAvatar} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-[#F8FAFC]">{conv.userName}</p>
                      <span className="text-[9px] text-[#475569]">{timeAgo(conv.lastTime)}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeUser = conversations.find(c => c.userId === activeUserId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#1E293B] bg-[#111827]/50 shrink-0">
        <button onClick={() => { setActiveUserId(null); setMessages([]); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#1E293B] hover:text-[#94A3B8] transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-xs font-bold text-[#94A3B8] overflow-hidden">
          {activeUser?.userAvatar ? <img src={activeUser.userAvatar} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4" />}
        </div>
        <p className="text-sm font-semibold text-[#F8FAFC]">{activeUser?.userName || "User"}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                msg.isMine
                  ? "bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-br-md"
                  : "bg-[#1E293B] border border-[#1E293B] rounded-bl-md"
              }`}>
                {!msg.isMine && (
                  <p className="text-[9px] font-semibold text-[#00E5FF] mb-1">{msg.senderName}</p>
                )}
                <p className="text-xs text-[#F8FAFC] break-words">{msg.content}</p>
                <p className="text-[9px] text-[#475569] mt-1 text-right">{formatTime(msg.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={threadEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-[#1E293B] bg-[#111827]/50 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 h-10 bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40"
          />
          <button onClick={sendMessage} disabled={!inputText.trim()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00E5FF] text-[#0F172A] hover:bg-[#3B82F6] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
