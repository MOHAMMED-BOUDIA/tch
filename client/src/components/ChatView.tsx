import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Plus, Send, MessageSquare, Bolt, MoreVertical, Users
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface Group {
  id: string;
  title: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string | null;
  groupId: string;
  content: string;
  senderName: string;
  created_at: string;
}

const API = import.meta.env.VITE_API_URL || "";
const SOCKET_URL = API || window.location.origin;

export default function ChatView() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [connected, setConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = localStorage.getItem("user_id") || "";

  const threadEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("groups:list", (list: Group[]) => {
      setGroups(list);
      if (list.length > 0 && !activeGroup) {
        setActiveGroup(list[0].id);
        s.emit("groups:join", { groupId: list[0].id });
      }
    });

    s.on("messages:history", ({ groupId, messages: msgs }: { groupId: string; messages: ChatMessage[] }) => {
      if (groupId === activeGroup) {
        setMessages(msgs);
      }
    });

    s.on("message:new", (msg: ChatMessage) => {
      if (msg.groupId === activeGroup) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && activeGroup) {
      socket.emit("groups:join", { groupId: activeGroup });
    }
  }, [activeGroup, socket]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !socket || !activeGroup) return;

    socket.emit("message:send", { groupId: activeGroup, content: inputText });
    setInputText("");
  };

  const filteredGroups = groups.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGroupData = groups.find((g) => g.id === activeGroup);

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <section className="w-80 bg-white border-r border-[#e8e4df] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#e8e4df] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6a6a6a]">Chat Groups</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-[9px] text-[#8a8a8a] uppercase">{connected ? "Live" : "Offline"}</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a] w-4 h-4" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8f6f3] h-10 pl-9 pr-4 rounded-xl border border-[#e8e4df] text-sm text-[#1a1a1a] focus:ring-1 focus:ring-[#c9953a] focus:border-[#c9953a] transition-all outline-none placeholder:text-[#8a8a8a]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left cursor-pointer ${
                activeGroup === group.id
                  ? "bg-[#f8f6f3] border border-[#c9953a]/30 shadow-sm"
                  : "hover:bg-[#f8f6f3]/40 border border-transparent"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#c9953a]/10 border border-[#c9953a]/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#c9953a]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1a1a1a] truncate">{group.title}</p>
                <p className="text-[10px] text-[#8a8a8a] truncate mt-0.5">
                  {activeGroup === group.id ? "Active" : "Click to open"}
                </p>
              </div>
            </button>
          ))}
          {filteredGroups.length === 0 && (
            <p className="text-xs text-[#8a8a8a] text-center py-8">No groups found</p>
          )}
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-[#FEF3C8] overflow-hidden relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#e8e4df] bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#c9953a]/10 flex items-center justify-center border border-[#c9953a]/20">
              <Bolt className="w-5 h-5 text-[#c9953a]" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#1a1a1a]">{activeGroupData?.title || "Select a group"}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-[#c9953a] animate-pulse" : "bg-red-500"}`} />
                <span className={`text-[10px] font-medium tracking-wide uppercase ${connected ? "text-[#c9953a]" : "text-red-400"}`}>
                  {connected ? "Real-time" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 rounded-full hover:bg-[#f8f6f3] flex items-center justify-center text-[#6a6a6a] hover:text-[#c9953a] transition-colors cursor-pointer">
              <Users className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-[#f8f6f3] flex items-center justify-center text-[#6a6a6a] hover:text-[#c9953a] transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#FEF3C8] relative">
          <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />

          {!activeGroup ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-[#8a8a8a]">Select a group to start chatting</p>
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isOwn = msg.senderId === currentUserId;
                const showAvatar = i === 0 || messages[i - 1]?.senderId !== msg.senderId;
                return (
                  <motion.div
                    key={msg.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-3 max-w-2xl relative group ${isOwn ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border border-[#e8e4df] flex items-center justify-center text-[10px] font-bold text-[#c9953a] bg-white ${showAvatar ? "" : "invisible"}`}>
                      <Bolt className="w-4 h-4 text-[#c9953a]" />
                    </div>
                    <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#4a4a4a]">{msg.senderName}</span>
                        <span className="text-[9px] text-[#8a8a8a]">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className={`p-3.5 rounded-2xl ${
                        isOwn
                          ? "bg-gradient-to-br from-[#c9953a] to-[#d4a853] text-[#1a1a1a] font-semibold rounded-br-none shadow-md shadow-[#c9953a]/10"
                          : "bg-white border border-[#e8e4df] text-[#1a1a1a] rounded-bl-none shadow-sm"
                      }`}>
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          <div ref={threadEndRef} />
        </div>

        {activeGroup && (
          <footer className="p-4 bg-gradient-to-t from-[#FEF3C8] to-[#FEF3C8]/90 border-t border-[#e8e4df]">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto bg-white border border-[#e8e4df] rounded-xl p-1.5 flex items-center gap-2 shadow-2xl">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeGroupData?.title || "group"}...`}
                className="flex-1 bg-transparent border-none text-xs text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:ring-0 focus:outline-none py-2 px-3"
                disabled={!connected}
              />
              <button
                type="submit"
                disabled={!connected || !inputText.trim()}
                className="w-10 h-9 rounded-lg bg-[#c9953a] hover:bg-[#c9953a]/90 flex items-center justify-center text-white font-bold active:scale-95 transition-all shadow-md shadow-[#c9953a]/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            </form>
          </footer>
        )}
      </section>
    </div>
  );
}
