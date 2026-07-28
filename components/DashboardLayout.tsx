"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe, MessageSquare, Layers, BarChart, Settings, LogOut, Bolt,
  Search, Bell, ChevronDown, Shield,
  ChevronRight, User, Briefcase
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const USER_AVATAR = "";

type Tab = "network" | "messages" | "projects" | "analytics" | "settings" | "admin" | "profile" | "portfolio";

const TAB_LABELS: Record<Tab, string> = {
  network: "Network", messages: "Messages", projects: "Projects",
  analytics: "Analytics", settings: "Settings", admin: "Admin",
  profile: "Profile", portfolio: "Projects",
};

const TAB_ICONS: Record<Tab, typeof Globe> = {
  network: Globe, messages: MessageSquare, projects: Layers,
  analytics: BarChart, settings: Settings, admin: Shield,
  profile: User, portfolio: Briefcase,
};

const roleTabs: Record<string, Tab[]> = {
  user: ["network", "messages", "projects", "portfolio", "settings"],
  coordinator: ["network", "messages", "projects", "portfolio", "analytics", "settings"],
  admin: ["network", "messages", "projects", "portfolio", "analytics", "settings", "admin"],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const userRole = role || "user";
  const sidebarTabs = roleTabs[userRole] ?? roleTabs.user;
  const [profileUser, setProfileUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
    if (!unreadIds.length) return;
    const token = localStorage.getItem("user_token");
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ids: unreadIds }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      markAllRead();
    }
  }, [showNotifications]);

  const currentTab = (sidebarTabs.find(t => pathname.includes(`/dashboard/${t}`)) || sidebarTabs[0]) as Tab;

  const persistTab = (tab: Tab) => {
    router.push(`/dashboard/${tab}`);
    localStorage.setItem("current_tab", tab);
  };

  const handleUserLogout = () => {
    logout();
  };

  return (
    <div className="h-screen w-screen bg-[#0F172A] text-[#F8FAFC] flex overflow-hidden font-sans">
      <aside className="w-[60px] bg-[#0b1222] border-r border-[#1E293B] flex flex-col items-center py-4 gap-2 shrink-0 z-30">
        <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mb-2 shadow-lg shadow-[#00E5FF]/10">
          <Bolt className="text-[#00E5FF] fill-[#00E5FF]/50 w-5 h-5" />
        </div>
        <div className="w-8 h-px bg-[#1E293B] my-1" />
        {sidebarTabs.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const active = currentTab === tab;
          return (
            <div key={tab} className="relative group">
              <button
                onClick={() => persistTab(tab)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                  active ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-[#475569] hover:bg-[#1E293B] hover:text-[#94A3B8]"
                }`}
              >
                {active && (
                  <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.7)]" />
                )}
                <Icon className="w-[18px] h-[18px]" />
              </button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1E293B] border border-[#334155] rounded-lg text-[10px] font-medium text-[#F8FAFC] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-50">
                {TAB_LABELS[tab]}
              </div>
            </div>
          );
        })}
        <div className="flex-1" />
        <div className="w-8 h-px bg-[#1E293B] my-1" />
        <div className="relative group">
          <button
            onClick={handleUserLogout}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#475569] hover:bg-[#1E293B] hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1E293B] border border-[#334155] rounded-lg text-[10px] font-medium text-[#F8FAFC] whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-50">
            Logout
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="h-14 bg-[#111827]/80 backdrop-blur-xl flex items-center px-5 gap-4 border-b border-[#1E293B] z-20 shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-[#475569] font-medium whitespace-nowrap">Home</span>
            <ChevronRight className="w-3 h-3 text-[#334155]" />
            <motion.span
              key={currentTab}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-semibold text-[#F8FAFC] whitespace-nowrap"
            >
              {TAB_LABELS[currentTab]}
            </motion.span>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[220px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full h-8 bg-[#0F172A]/60 border border-[#1E293B] rounded-lg pl-8 pr-3 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none transition-all duration-200 focus:border-[#00E5FF]/40 focus:shadow-[0_0_12px_rgba(0,229,255,0.06)] focus:bg-[#0F172A]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button onClick={() => setShowNotifications(p => !p)} className="relative w-8 h-8 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#1E293B] hover:text-[#94A3B8] transition-all duration-200 cursor-pointer">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00E5FF] text-[#0F172A] text-[8px] font-bold flex items-center justify-center shadow-[0_0_6px_rgba(0,229,255,0.6)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0F172A] rounded-lg border border-[#1E293B]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="text-[9px] text-green-400 font-semibold tracking-wide">Optimized</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowUserMenu(p => !p)} className="flex items-center gap-2 pl-2.5 border-l border-[#1E293B] group cursor-pointer">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#1E293B] border border-[#1E293B] flex items-center justify-center">
                  {USER_AVATAR ? <img src={USER_AVATAR} alt="" className="w-full h-full object-cover" loading="lazy" /> : <User className="w-4 h-4 text-[#64748B]" />}
                </div>
                <ChevronDown className="w-3 h-3 text-[#475569] group-hover:text-[#94A3B8] transition-colors" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#0F172A] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className="flex-1 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-14 right-5 mt-2 w-72 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
              <p className="text-xs font-bold text-[#F8FAFC]">Notifications</p>
              {unreadCount > 0 && <span className="text-[9px] text-[#00E5FF] font-bold">{unreadCount} new</span>}
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <p className="text-[11px] text-[#475569] text-center py-4">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className={`flex gap-3 p-2 rounded-xl hover:bg-[#0F172A] transition-colors ${!n.read ? "bg-[#0F172A]/50" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#F8FAFC] truncate">{n.title}</p>
                      {n.description && <p className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-2">{n.description}</p>}
                      <p className="text-[9px] text-[#475569] mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {showUserMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
          <div className="fixed top-14 right-5 mt-2 w-48 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-[#1E293B]">
              <p className="text-xs font-bold text-[#F8FAFC]">User</p>
              <p className="text-[9px] text-[#94A3B8]">Signed in</p>
            </div>
            <div className="p-2 space-y-0.5">
              <button onClick={() => { persistTab("settings"); setShowUserMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] text-[#cbd5e1] hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all cursor-pointer">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button onClick={() => { setShowUserMenu(false); handleUserLogout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] text-[#cbd5e1] hover:bg-[#0F172A] hover:text-red-400 transition-all cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
