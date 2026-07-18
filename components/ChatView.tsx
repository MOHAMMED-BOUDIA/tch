import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Send, MessageSquare, Bolt, MoreVertical, Users,
  Smile, Paperclip, Check, CheckCheck, Settings, Hash, AtSign
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";

interface Group {
  id: string;
  title: string;
  avatar?: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  groupId: string;
  content: string;
  senderName: string;
  created_at: string;
  edited?: boolean;
  deleted?: boolean;
}

interface GroupInfo {
  id: string;
  title: string;
  createdAt?: string;
  messageCount?: number;
}

import { API_URL, SOCKET_URL as ENV_SOCKET_URL } from "@/lib/client-env";
const API = API_URL;
const SOCKET_URL = ENV_SOCKET_URL || API || window.location.origin;

const AVATARS = [
  "https://i.pravatar.cc/40?u=member.alpha@nexus",
  "https://i.pravatar.cc/40?u=member.beta@nexus",
  "https://i.pravatar.cc/40?u=member.gamma@nexus",
  "https://i.pravatar.cc/40?u=member.delta@nexus",
  "https://i.pravatar.cc/40?u=member.epsilon@nexus",
  "https://i.pravatar.cc/40?u=member.zeta@nexus",
  "https://i.pravatar.cc/40?u=member.eta@nexus",
  "https://i.pravatar.cc/40?u=member.theta@nexus",
];

const COLORS = [
  "from-[#00E5FF] to-[#3B82F6]",
  "from-emerald-400 to-emerald-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const t = new Date(dateStr).getTime();
  const diff = Math.max(0, now - t);
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getColor(title: string): string {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

function simulateReadReceipt(): boolean {
  return Math.random() > 0.3;
}

function getDMName(title: string): string {
  return title.startsWith("@ ") ? title.slice(2) : title;
}

export default function ChatView() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const chatUserName = searchParams.get("chatUser");
  const chatUser = chatUserName ? { id: 0, name: chatUserName } : null;

  const currentUserId = localStorage.getItem("user_id") || "";
  const inputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingDMRef = useRef(chatUser);
  const activeGroupRef = useRef(activeGroup);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteMsgId, setDeleteMsgId] = useState<string | null>(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [groupMembers, setGroupMembers] = useState<Member[]>([]);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState("");
  const [availableUsers, setAvailableUsers] = useState<Member[]>([]);
  const [addMemberResults, setAddMemberResults] = useState<Member[]>([]);

  activeGroupRef.current = activeGroup;
  pendingDMRef.current = chatUser || pendingDMRef.current;

  // ─── Consume route state once ───
  useEffect(() => {
    if (chatUser) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  // ─── Helpers ───
  const scrollToBottom = useCallback(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const getLastMessage = useCallback((groupId: string): ChatMessage | undefined => {
    return [...messages].reverse().find(m => m.groupId === groupId);
  }, [messages]);

  const clearUnread = useCallback((groupId: string) => {
    setUnreadCounts(prev => { const p = { ...prev }; delete p[groupId]; return p; });
  }, []);

  // ─── Split groups ───
  const channels = groups.filter(g => !g.title.startsWith("@ "));
  const dms = groups.filter(g => g.title.startsWith("@ "));

  // ─── Socket ───
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    const s = io(SOCKET_URL, { auth: { token } });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => {});

    s.on("groups:list", (list: Group[]) => {
      setGroups(list);
      const target = pendingDMRef.current;
      if (target) {
        const dmName = `@ ${target.name}`;
        const existing = list.find(g => g.title === dmName);
        if (existing) {
          setActiveGroup(existing.id);
          s.emit("groups:join", { groupId: existing.id });
          pendingDMRef.current = null;
        } else if (list.length > 0) {
          s.emit("group:create", { name: dmName });
        }
      } else if (!activeGroupRef.current && list.length > 0) {
        const first = list.find(g => !g.title.startsWith("@ ")) || list[0];
        setActiveGroup(first.id);
        s.emit("groups:join", { groupId: first.id });
      }
    });

    s.on("messages:history", ({ groupId, messages: msgs }: { groupId: string; messages: ChatMessage[] }) => {
      if (groupId === activeGroupRef.current) {
        setMessages(prev => {
          const existing = prev.filter(m => m.groupId !== groupId);
          return [...existing, ...msgs];
        });
      }
    });

    s.on("message:new", (msg: ChatMessage) => {
      if (msg.groupId === activeGroupRef.current) {
        setMessages(prev => [...prev, msg]);
      } else {
        setUnreadCounts(prev => ({ ...prev, [msg.groupId]: (prev[msg.groupId] || 0) + 1 }));
        setMessages(prev => [...prev, msg]);
      }
    });

    s.on("message:edited", (msg: ChatMessage) => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, content: msg.content, edited: true } : m));
    });

    s.on("message:deleted", ({ id, groupId: gid }: { id: string; groupId: string; content: string; deleted: boolean }) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, content: "This message was deleted", deleted: true } : m));
    });

    s.on("group:members", ({ groupId, members }: { groupId: string; members: Member[] }) => {
      if (groupId === activeGroupRef.current) {
        setGroupMembers(members);
      }
    });

    s.on("group:updated", ({ id, title, avatar }: { id: string; title: string; avatar: string }) => {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, title, avatar } : g));
    });

    setSocket(s);

    return () => { s.disconnect(); };
  }, []);

  useEffect(() => {
    if (socket && activeGroup) {
      socket.emit("groups:join", { groupId: activeGroup });
      socket.emit("group:members", { groupId: activeGroup });
      clearUnread(activeGroup);
    }
  }, [activeGroup, socket, clearUnread]);

  // ─── Typing simulation ───
  useEffect(() => {
    if (!activeGroup || !connected) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const names = ["Alex", "Jordan", "Elena", "Marcus", "Sarah"];
        const name = names[Math.floor(Math.random() * names.length)];
        if (!typingUsers.includes(name)) {
          setTypingUsers(prev => [...prev, name]);
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = setTimeout(() => setTypingUsers([]), 2500);
        }
      }
    }, 5000);
    return () => { clearInterval(interval); clearTimeout(typingTimerRef.current); };
  }, [activeGroup, connected, typingUsers]);

  // ─── Send ───
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !socket || !activeGroup) return;
    socket.emit("message:send", { groupId: activeGroup, content: inputText });
    setInputText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditText(msg.content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !socket || !editingMessageId) return;
    socket.emit("message:edit", { messageId: editingMessageId, content: editText });
    setEditingMessageId(null);
    setEditText("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!socket) return;
    socket.emit("message:delete", { messageId });
    setDeleteMsgId(null);
  };

  const handleDeleteGroup = () => {
    if (!socket || !activeGroup) return;
    socket.emit("group:delete", { groupId: activeGroup });
    setShowDeleteGroupConfirm(false);
    setShowGroupSettings(false);
    setActiveGroup(null);
    setMessages([]);
  };

  const handleGroupNameSave = () => {
    if (!socket || !activeGroup || !groupNameInput.trim()) return;
    socket.emit("group:update", { groupId: activeGroup, name: groupNameInput.trim() });
    setEditingGroupName(false);
  };

  const handleOpenAddMember = () => {
    setShowAddMember(true);
    setAddMemberSearch("");
    setAddMemberResults([]);
    const token = localStorage.getItem("user_token");
    fetch(`${API}/api/users/search?q=`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableUsers(data);
          setAddMemberResults(data);
        }
      })
      .catch(() => {});
  };

  const handleAddMemberSearch = (q: string) => {
    setAddMemberSearch(q);
    if (!q.trim()) {
      setAddMemberResults(availableUsers);
      return;
    }
    const lower = q.toLowerCase();
    setAddMemberResults(availableUsers.filter(u => u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)));
  };

  const handleAddMember = (userId: string) => {
    if (!socket || !activeGroup) return;
    socket.emit("group:add-member", { groupId: activeGroup, userId });
  };

  const handleRemoveMember = (userId: string) => {
    if (!socket || !activeGroup) return;
    socket.emit("group:remove-member", { groupId: activeGroup, userId });
  };

  // ─── Derived ───
  const activeGroupData = groups.find(g => g.id === activeGroup);
  const isActiveDM = activeGroupData?.title.startsWith("@ ") ?? false;
  const activeGroupMessages = messages.filter(m => m.groupId === activeGroup);
  const groupColors = Object.fromEntries(groups.map(g => [g.id, getColor(g.title)]));

  const renderGroupItem = (group: Group, active: boolean) => {
    const lastMsg = getLastMessage(group.id);
    const unread = unreadCounts[group.id] || 0;
    const isDM = group.title.startsWith("@ ");
    const displayName = isDM ? getDMName(group.title) : group.title;
    const avatarUrl = isDM
      ? `https://i.pravatar.cc/40?u=${displayName.toLowerCase().replace(/\s+/g, ".")}@nexus`
      : null;

    return (
      <button
        key={group.id}
        onClick={() => setActiveGroup(group.id)}
        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-left cursor-pointer relative ${
          active
            ? "bg-[#1E293B] border border-[#00E5FF]/25 shadow-[0_0_16px_rgba(0,229,255,0.06)]"
            : "hover:bg-[#1E293B]/50 border border-transparent"
        }`}
      >
        <div className="relative shrink-0">
          {isDM ? (
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111827] border border-[#1E293B] shadow-sm">
              <img src={avatarUrl!} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${groupColors[group.id]} shadow-lg`}>
              <Hash className="w-4 h-4 text-white" />
            </div>
          )}
          {isDM && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#111827] bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#F8FAFC] truncate">
              {isDM ? displayName : group.title}
            </p>
            {lastMsg && (
              <span className="text-[9px] text-[#475569] shrink-0">{timeAgo(lastMsg.created_at)}</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[10px] text-[#64748B] truncate flex-1 min-w-0">
              {lastMsg ? (
                <span>
                  <span className="text-[#94A3B8]">{lastMsg.senderName.split(" ")[0]}: </span>
                  {lastMsg.content}
                </span>
              ) : (
                <span className="italic">No messages yet</span>
              )}
            </p>
            {unread > 0 && (
              <span className="shrink-0 ml-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#00E5FF] text-[9px] font-bold text-[#0F172A] px-1 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-[#0F172A]">
      {/* ═══════════════ GROUPS SIDEBAR ═══════════════ */}
      <section className="w-80 bg-[#111827] border-r border-[#1E293B] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Channels</h2>
            <div className="flex items-center gap-2">
              <span className={`relative w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}>
                <span className={`absolute inset-0 rounded-full animate-ping ${connected ? "bg-green-500/50" : "bg-red-500/50"}`} />
              </span>
              <span className="text-[9px] text-[#94A3B8] uppercase font-semibold">{connected ? "Live" : "Offline"}</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-3.5 h-3.5" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search channels..."
              className="w-full bg-[#0F172A] h-9 pl-9 pr-3 rounded-xl border border-[#1E293B] text-xs text-[#F8FAFC] focus:ring-1 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF]/40 transition-all outline-none placeholder:text-[#475569]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar py-2 space-y-0.5 px-2">
          {channels.length > 0 && (
            <div className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#475569]">Channels</div>
          )}
          {channels.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())).map(group =>
            renderGroupItem(group, activeGroup === group.id)
          )}
          {dms.length > 0 && (
            <>
              <div className="pt-2 mt-2 border-t border-[#1E293B]" />
              <div className="px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#475569]">Direct Messages</div>
            </>
          )}
          {dms.filter(g => getDMName(g.title).toLowerCase().includes(searchQuery.toLowerCase())).map(group =>
            renderGroupItem(group, activeGroup === group.id)
          )}
          {groups.length === 0 && (
            <p className="text-xs text-[#475569] text-center py-8">No conversations yet</p>
          )}
        </div>
      </section>

      {/* ═══════════════ CHAT AREA ═══════════════ */}
      <section className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0a1422] to-[#0F172A] pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full bg-[#00E5FF]/[0.015] blur-[150px] pointer-events-none" />

        {/* ─── Header ─── */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#1E293B] bg-[#111827]/90 backdrop-blur-xl z-10 shrink-0 relative">
          {activeGroupData ? (
            <>
              <div className="flex items-center gap-3">
                {isActiveDM ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#111827] border border-[#1E293B] shadow-sm">
                    <img
                      src={`https://i.pravatar.cc/40?u=${getDMName(activeGroupData.title).toLowerCase().replace(/\s+/g, ".")}@nexus`}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${groupColors[activeGroupData.id]} shadow-lg`}>
                    <Bolt className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-[#F8FAFC] tracking-tight">
                    {isActiveDM ? getDMName(activeGroupData.title) : activeGroupData.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                    <span className="text-[9px] text-green-400 font-semibold uppercase tracking-wide">Online</span>
                    {!isActiveDM && (
                      <>
                        <span className="text-[9px] text-[#475569]">·</span>
                        <span className="text-[9px] text-[#94A3B8]">5 members</span>
                      </>
                    )}
                    {typingUsers.length > 0 && (
                      <>
                        <span className="text-[9px] text-[#475569]">·</span>
                        <span className="text-[9px] text-[#00E5FF] italic flex items-center gap-1">
                          {typingUsers.slice(0, 2).join(" & ")}{typingUsers.length > 2 ? ` +${typingUsers.length - 2}` : ""} typing
                          <span className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-1 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-1 rounded-full bg-[#00E5FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isActiveDM && (
                  <div className="flex items-center -space-x-2 mr-1">
                    {AVATARS.slice(0, 4).map((url, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-[#111827] overflow-hidden bg-[#0F172A]">
                        <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-[#111827] bg-[#0F172A] flex items-center justify-center text-[8px] font-bold text-[#94A3B8]">
                      +3
                    </div>
                  </div>
                )}
                <div className="relative">
                  <button onClick={() => setShowGroupSettings(p => !p)} className="w-8 h-8 rounded-lg hover:bg-[#1E293B] flex items-center justify-center text-[#475569] hover:text-[#94A3B8] transition-all cursor-pointer">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#475569]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#F8FAFC]">Select a channel</h2>
                <p className="text-[9px] text-[#475569]">Pick a conversation from the sidebar</p>
              </div>
            </div>
          )}
        </header>

        {/* ─── Messages ─── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-[1]">
          <div className="absolute inset-0 subtle-grid opacity-[0.04] pointer-events-none" />

          <div className="p-6 pb-2 space-y-1 max-w-4xl mx-auto relative">
            {!activeGroup ? (
              <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-7 h-7 text-[#475569]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#F8FAFC]">No channel selected</p>
                    <p className="text-xs text-[#64748B] mt-1">Choose a channel from the sidebar to start chatting</p>
                  </div>
                </div>
              </div>
            ) : activeGroupMessages.length === 0 ? (
              <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00E5FF]/10 to-[#3B82F6]/10 border border-[#00E5FF]/20 flex items-center justify-center mx-auto">
                    {isActiveDM ? (
                      <img
                        src={`https://i.pravatar.cc/64?u=${getDMName(activeGroupData!.title).toLowerCase().replace(/\s+/g, ".")}@nexus`}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <MessageSquare className="w-8 h-8 text-[#00E5FF]" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#F8FAFC]">No messages yet</p>
                    <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
                      {isActiveDM
                        ? `Start a conversation with ${getDMName(activeGroupData!.title)}`
                        : "Start the conversation — say hello to the team!"}
                    </p>
                  </div>
                  <button
                    onClick={() => { inputRef.current?.focus(); }}
                    className="h-9 px-5 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/20 rounded-xl text-[11px] text-[#00E5FF] font-bold transition-all cursor-pointer"
                  >
                    Write a message
                  </button>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {activeGroupMessages.map((msg, i) => {
                  const isOwn = msg.senderId === currentUserId;
                  const isFirstInSequence = i === 0 || activeGroupMessages[i - 1]?.senderId !== msg.senderId;
                  const isLastInSequence = i === activeGroupMessages.length - 1 || activeGroupMessages[i + 1]?.senderId !== msg.senderId;
                  const showHeader = isFirstInSequence;
                  const read = simulateReadReceipt();
                  return (
                    <motion.div
                      key={msg.id || `msg-${i}`}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`flex items-end gap-1 max-w-[88%] relative ${isOwn ? "ml-auto flex-row-reverse" : ""} ${isLastInSequence ? "mb-3" : "mb-0.5"}`}
                    >
                      {/* Avatar column */}
                      {!isOwn && (
                        <div className="flex flex-col items-center shrink-0 w-9">
                          {isFirstInSequence && (
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#111827] border border-[#1E293B] shadow-sm">
                              <img
                                src={`https://i.pravatar.cc/36?u=${msg.senderName.toLowerCase().replace(/\s+/g, ".")}@nexus`}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      <div className={`flex flex-col min-w-0 max-w-full ${isOwn ? "items-end" : "items-start"}`}>
                        {/* Sender name for received (WhatsApp-style group header) */}
                        {showHeader && !isOwn && (
                          <div className="ml-0.5 mb-0.5">
                            <span className="text-[11px] font-bold text-[#00E5FF]">{msg.senderName}</span>
                          </div>
                        )}

                        <div className="flex items-end gap-1">
                          {/* Edit/delete dropdown for own messages */}
                          {isOwn && !msg.deleted && editingMessageId !== msg.id && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-end gap-0.5 pb-1">
                              <button onClick={() => handleStartEdit(msg)} className="w-6 h-6 rounded-lg hover:bg-[#1E293B] flex items-center justify-center text-[#475569] hover:text-[#F8FAFC] transition-all cursor-pointer" title="Edit">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => setDeleteMsgId(msg.id)} className="w-6 h-6 rounded-lg hover:bg-[#1E293B] flex items-center justify-center text-[#475569] hover:text-red-400 transition-all cursor-pointer" title="Delete">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          )}

                          <div className="group relative">
                            {msg.deleted ? (
                              <div className={`px-4 py-2.5 text-xs leading-relaxed italic ${
                                isOwn
                                  ? "bg-[#1E293B]/50 text-[#64748B] rounded-[7px] rounded-br-sm"
                                  : "bg-[#1E293B]/50 text-[#64748B] rounded-[7px] rounded-bl-sm"
                              }`}>
                                This message was deleted
                              </div>
                            ) : editingMessageId === msg.id ? (
                              <div className="flex flex-col gap-2 min-w-[280px]">
                                <input
                                  value={editText}
                                  onChange={e => setEditText(e.target.value)}
                                  onKeyDown={handleEditKeyDown}
                                  autoFocus
                                  className="w-full bg-[#0F172A] border border-[#00E5FF]/40 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] outline-none focus:border-[#00E5FF] transition-all"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={handleCancelEdit} className="text-[10px] text-[#64748B] hover:text-[#F8FAFC] px-3 py-1.5 rounded-lg hover:bg-[#1E293B] transition-all cursor-pointer">
                                    Cancel
                                  </button>
                                  <button onClick={handleSaveEdit} className="text-[10px] font-bold text-[#0F172A] bg-[#00E5FF] hover:bg-[#3B82F6] px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={`px-3.5 py-2 text-xs leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                                isOwn
                                  ? "bg-[#005C4B] text-white rounded-[7px] rounded-br-sm"
                                  : "bg-[#202C33] text-[#E9EDEF] rounded-[7px] rounded-bl-sm"
                              }`}>
                                {msg.content}
                                <span className="inline-flex items-center gap-1 ml-2 float-right leading-none mt-1">
                                  {msg.edited && (
                                    <span className="text-[9px] opacity-50">edited</span>
                                  )}
                                  <span className={`text-[10px] ${isOwn ? "text-white/50" : "text-[#8696A0]"}`}>
                                    {formatTime(msg.created_at)}
                                  </span>
                                  {isOwn && !msg.deleted && (
                                    <span className="flex items-center">
                                      {read ? (
                                        <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                                      ) : (
                                        <Check className="w-3.5 h-3.5 text-white/50" />
                                      )}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Edit/delete for received messages on hover */}
                            {!isOwn && !msg.deleted && editingMessageId !== msg.id && (
                              <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5">
                                <button onClick={() => setDeleteMsgId(msg.id)} className="w-6 h-6 rounded-lg bg-[#1E293B] hover:bg-red-500/10 flex items-center justify-center text-[#94A3B8] hover:text-red-400 transition-all cursor-pointer" title="Delete">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={threadEndRef} />
          </div>
        </div>

        {/* ─── Input ─── */}
        {activeGroup && (
          <footer className="p-4 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent border-t border-[#1E293B] relative z-[2]">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex items-end gap-2 bg-[#111827] border border-[#1E293B] rounded-2xl p-2 transition-all duration-200 focus-within:border-[#00E5FF]/40 focus-within:shadow-[0_0_20px_rgba(0,229,255,0.08)]">
                <button
                  type="button"
                  className="w-9 h-9 shrink-0 rounded-xl hover:bg-[#1E293B] flex items-center justify-center text-[#475569] hover:text-[#94A3B8] transition-all cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <input
                    ref={inputRef}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isActiveDM
                      ? `Message @${getDMName(activeGroupData!.title)}...`
                      : `Message #${activeGroupData?.title || "channel"}...`}
                    disabled={!connected}
                    className="w-full bg-transparent border-none text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:ring-0 focus:outline-none py-1.5 px-1 resize-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-9 h-9 shrink-0 rounded-xl hover:bg-[#1E293B] flex items-center justify-center text-[#475569] hover:text-[#94A3B8] transition-all cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <motion.button
                  type="submit"
                  disabled={!connected || !inputText.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 shrink-0 rounded-xl bg-[#00E5FF] hover:bg-[#3B82F6] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-[#00E5FF]/15 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </motion.button>
              </div>
            </form>
          </footer>
        )}

        {/* ─── Group Settings Modal ─── */}
        {showGroupSettings && activeGroupData && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowGroupSettings(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111827] border border-[#1E293B] rounded-2xl w-[420px] max-h-[80vh] overflow-hidden shadow-2xl pointer-events-auto flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-[#1E293B] flex items-center justify-between shrink-0">
                  <h3 className="text-sm font-bold text-[#F8FAFC]">{isActiveDM ? "Contact Info" : "Group Settings"}</h3>
                  <button onClick={() => setShowGroupSettings(false)} className="w-7 h-7 rounded-lg hover:bg-[#1E293B] flex items-center justify-center text-[#64748B] hover:text-[#F8FAFC] transition-all cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                  {/* Group info */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#1E293B] border border-[#334155]">
                      {isActiveDM ? (
                        <img src={`https://i.pravatar.cc/80?u=${getDMName(activeGroupData.title).toLowerCase().replace(/\s+/g, ".")}@nexus`} alt="" className="w-full h-full object-cover" />
                      ) : activeGroupData.avatar ? (
                        <img src={activeGroupData.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00E5FF]/20 to-[#3B82F6]/20">
                          <span className="text-2xl font-bold text-[#00E5FF]">{activeGroupData.title.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    {!isActiveDM && (
                      <button className="text-[10px] text-[#00E5FF] font-bold hover:underline cursor-pointer">Change photo</button>
                    )}
                  </div>

                  {/* Group name editing */}
                  {isActiveDM ? (
                    <div className="text-center">
                      <p className="text-base font-bold text-[#F8FAFC]">{getDMName(activeGroupData.title)}</p>
                      <p className="text-[11px] text-[#64748B] mt-1">Direct Message</p>
                    </div>
                  ) : (
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-[#1E293B]">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#475569] mb-2">Group Name</p>
                      {editingGroupName ? (
                        <div className="flex gap-2">
                          <input
                            value={groupNameInput}
                            onChange={e => setGroupNameInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleGroupNameSave(); if (e.key === "Escape") setEditingGroupName(false); }}
                            autoFocus
                            className="flex-1 bg-[#111827] border border-[#334155] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00E5FF]/40 transition-all"
                          />
                          <button onClick={handleGroupNameSave} className="px-3 py-2 bg-[#00E5FF] text-[#0F172A] text-[10px] font-bold rounded-lg hover:bg-[#3B82F6] transition-all cursor-pointer">Save</button>
                          <button onClick={() => setEditingGroupName(false)} className="px-3 py-2 bg-[#1E293B] text-[#94A3B8] text-[10px] font-bold rounded-lg hover:bg-[#334155] transition-all cursor-pointer">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-[#F8FAFC]">{activeGroupData.title}</p>
                          <button onClick={() => { setGroupNameInput(activeGroupData.title); setEditingGroupName(true); }} className="text-[#00E5FF] hover:text-[#3B82F6] transition-colors cursor-pointer">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Members section */}
                  {!isActiveDM && (
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-[#1E293B]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#475569]">Members ({groupMembers.length})</p>
                        <button onClick={handleOpenAddMember} className="text-[10px] text-[#00E5FF] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                          Add member
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {groupMembers.map(m => {
                          const currentUserId = localStorage.getItem("user_id") || "";
                          const isSelf = m.id === currentUserId;
                          return (
                            <div key={m.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#111827] transition-colors group">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1E293B] border border-[#334155]">
                                  {m.avatar ? (
                                    <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#00E5FF]">{m.name.charAt(0).toUpperCase()}</div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#F8FAFC]">{m.name} {isSelf && <span className="text-[9px] text-[#475569] font-normal">(you)</span>}</p>
                                  <p className="text-[9px] text-[#64748B]">{m.email}</p>
                                </div>
                              </div>
                              {!isSelf && (
                                <button onClick={() => handleRemoveMember(m.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-[#475569] hover:text-red-400 transition-all cursor-pointer" title="Remove">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              )}
                            </div>
                          );
                        })}
                        {groupMembers.length === 0 && (
                          <p className="text-[11px] text-[#64748B] text-center py-4 italic">No members loaded</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add member modal */}
                  {showAddMember && (
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-[#1E293B]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#475569]">Add Member</p>
                        <button onClick={() => setShowAddMember(false)} className="text-[10px] text-[#64748B] hover:text-[#F8FAFC] transition-colors cursor-pointer">Cancel</button>
                      </div>
                      <input
                        value={addMemberSearch}
                        onChange={e => handleAddMemberSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-[#111827] border border-[#334155] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00E5FF]/40 transition-all mb-3 placeholder:text-[#475569]"
                      />
                      <div className="space-y-1 max-h-[160px] overflow-y-auto custom-scrollbar">
                        {addMemberResults.filter(u => !groupMembers.some(m => m.id === u.id)).map(u => (
                          <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-[#111827] transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1E293B] border border-[#334155]">
                                {u.avatar ? (
                                  <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#00E5FF]">{u.name.charAt(0).toUpperCase()}</div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#F8FAFC]">{u.name}</p>
                                <p className="text-[9px] text-[#64748B]">{u.email}</p>
                              </div>
                            </div>
                            <button onClick={() => handleAddMember(u.id)} className="px-3 py-1.5 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/20 rounded-lg text-[10px] font-bold text-[#00E5FF] transition-all cursor-pointer">
                              Add
                            </button>
                          </div>
                        ))}
                        {addMemberResults.filter(u => !groupMembers.some(m => m.id === u.id)).length === 0 && (
                          <p className="text-[11px] text-[#64748B] text-center py-3 italic">No users found</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delete action */}
                  <button onClick={() => { setShowGroupSettings(false); setShowDeleteGroupConfirm(true); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] text-red-400 hover:bg-red-500/10 border border-red-500/10 transition-all cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete {isActiveDM ? "conversation" : "channel"}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ─── Delete message confirmation ─── */}
        {deleteMsgId && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteMsgId(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 w-80 shadow-2xl pointer-events-auto">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <p className="text-sm font-bold text-[#F8FAFC] text-center">Delete message?</p>
                <p className="text-[11px] text-[#64748B] text-center mt-2">This action cannot be undone.</p>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setDeleteMsgId(null)} className="flex-1 h-9 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[11px] text-[#F8FAFC] font-bold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={() => handleDeleteMessage(deleteMsgId)} className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-[11px] text-white font-bold transition-all cursor-pointer">
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ─── Delete group confirmation ─── */}
        {showDeleteGroupConfirm && (
          <>
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteGroupConfirm(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 w-80 shadow-2xl pointer-events-auto">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <p className="text-sm font-bold text-[#F8FAFC] text-center">Delete this conversation?</p>
                <p className="text-[11px] text-[#64748B] text-center mt-2">All messages will be permanently removed.</p>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => setShowDeleteGroupConfirm(false)} className="flex-1 h-9 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-[11px] text-[#F8FAFC] font-bold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button onClick={handleDeleteGroup} className="flex-1 h-9 rounded-xl bg-red-500 hover:bg-red-600 text-[11px] text-white font-bold transition-all cursor-pointer">
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
