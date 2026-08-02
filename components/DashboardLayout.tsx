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
import SearchInput from "./ui/SearchInput";

const USER_AVATAR = "";

const HIDE_HEADER_PATHS = ["/dashboard/messages", "/dashboard/projects", "/dashboard/analytics", "/dashboard/settings", "/dashboard/admin"];

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
  const hideHeader = HIDE_HEADER_PATHS.some(p => pathname.startsWith(p));
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
    <div className="h-screen w-screen bg-canvas text-ink font-body flex overflow-hidden">
      <aside className="w-[60px] bg-surface-tile-1 border-r border-hairline flex flex-col items-center py-4 gap-2 shrink-0 z-30">
        <div className="w-9 h-9 rounded-xs bg-primary/10 border border-primary/30 flex items-center justify-center mb-2">
          <Bolt className="text-primary w-5 h-5" />
        </div>
        <div className="w-8 h-px bg-hairline my-1" />
        {sidebarTabs.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const active = currentTab === tab;
          return (
            <div key={tab} className="relative group">
              <button
                onClick={() => persistTab(tab)}
                className={`relative w-10 h-10 flex items-center justify-center rounded-xs transition-all duration-200 cursor-pointer ${
                  active ? "bg-primary/10 text-primary" : "text-ink-muted-48 hover:bg-canvas-parchment hover:text-ink"
                }`}
              >
                {active && (
                  <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
                )}
                <Icon className="w-[18px] h-[18px]" />
              </button>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-body-on-dark rounded-xs fine-print whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                {TAB_LABELS[tab]}
              </div>
            </div>
          );
        })}
        <div className="flex-1" />
        <div className="w-8 h-px bg-hairline my-1" />
        <div className="relative group">
          <button
            onClick={handleUserLogout}
            className="w-10 h-10 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-red-500 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-ink text-body-on-dark rounded-xs fine-print whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
            Logout
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {!hideHeader && (
          <header className="h-14 frosted flex items-center px-5 gap-4 border-b border-hairline z-20 shrink-0 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="fine-print text-ink-muted-48 font-medium whitespace-nowrap">Home</span>
            <ChevronRight className="w-3 h-3 text-hairline" />
            <motion.span
              key={currentTab}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="fine-print font-semibold text-ink whitespace-nowrap"
            >
              {TAB_LABELS[currentTab]}
            </motion.span>
          </div>

          <div className="flex-1 flex justify-center">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search anything..." className="w-full max-w-[220px]" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button onClick={() => setShowNotifications(p => !p)} className="relative w-8 h-8 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-ink transition-all duration-200 cursor-pointer">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white fine-print font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-canvas-parchment rounded-xs border border-hairline">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="fine-print text-primary font-semibold">Optimized</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowUserMenu(p => !p)} className="flex items-center gap-2 pl-2.5 border-l border-hairline group cursor-pointer">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-canvas-parchment border border-hairline flex items-center justify-center">
                  {USER_AVATAR ? <img src={USER_AVATAR} alt="" className="w-full h-full object-cover" loading="lazy" /> : <User className="w-4 h-4 text-ink-muted-48" />}
                </div>
                <ChevronDown className="w-3 h-3 text-ink-muted-48 group-hover:text-ink transition-colors" />
              </button>
            </div>
          </div>
        </header>
        )}

        <main className="flex-1 bg-canvas overflow-hidden relative">
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
          <div className="fixed top-14 right-5 mt-2 w-72 bg-canvas border border-hairline rounded-md product-shadow z-50 overflow-hidden">
            <div className="p-4 border-b border-hairline flex items-center justify-between">
              <p className="caption-strong text-ink">Notifications</p>
              {unreadCount > 0 && <span className="fine-print text-primary font-bold">{unreadCount} new</span>}
            </div>
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <p className="fine-print text-ink-muted-48 text-center py-4">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className={`flex gap-3 p-2 rounded-xs transition-colors ${!n.read ? "bg-canvas-parchment" : ""}`}>
                    <div className="w-8 h-8 rounded-xs bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="caption-strong text-ink truncate">{n.title}</p>
                      {n.description && <p className="fine-print text-ink-muted-48 mt-0.5 line-clamp-2">{n.description}</p>}
                      <p className="fine-print text-ink-muted-48 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
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
          <div className="fixed top-14 right-5 mt-2 w-48 bg-canvas border border-hairline rounded-md product-shadow z-50 overflow-hidden">
            <div className="p-3 border-b border-hairline">
              <p className="caption-strong text-ink">User</p>
              <p className="fine-print text-ink-muted-48">Signed in</p>
            </div>
            <div className="p-2 space-y-0.5">
              <button onClick={() => { persistTab("settings"); setShowUserMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xs caption text-ink hover:bg-canvas-parchment transition-all cursor-pointer">
                <Settings className="w-3.5 h-3.5" /> Settings
              </button>
              <button onClick={() => { setShowUserMenu(false); handleUserLogout(); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xs caption text-ink hover:bg-canvas-parchment hover:text-red-500 transition-all cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}