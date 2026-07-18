"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth-context";
import { Hash, Users, MessageSquare, Plus, Search } from "lucide-react";

interface Group {
  id: string;
  name: string;
  avatar?: string;
  memberCount: number;
  messageCount: number;
}

export default function GroupsPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/groups`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) setGroups(await res.json());
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [token]);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Groups</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Browse all channels and join conversations</p>
        </div>
        <button className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search groups..."
          className="w-full h-9 bg-[#111827] border border-[#1E293B] rounded-xl pl-9 pr-3 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-4">
            <Hash className="w-6 h-6 text-[#475569]" />
          </div>
          <p className="text-xs text-[#94A3B8]">No groups found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 hover:border-[#00E5FF]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-lg">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#F8FAFC] truncate">{group.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-[#64748B]">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {group.memberCount} members</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {group.messageCount} messages</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
