import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, Navigate, useNavigate, useLocation, useOutletContext, Outlet } from "react-router-dom";
import {
  Globe, MessageSquare, Layers, BarChart, Settings, LogOut, Bolt,
  Plus, CheckSquare, Search, Bell, ChevronDown, Shield,
  TrendingUp, Users, Activity, ChevronRight, User, Briefcase
} from "lucide-react";
import ChatView from "./components/ChatView";
import PrivateInbox from "./components/PrivateInbox";
import UserPortfolio from "./components/UserPortfolio";
import GraphView from "./components/GraphView";
import ProfileView from "./components/ProfileView";
import PersonProfile from "./components/PersonProfile";
import UserLogin from "./components/UserLogin";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";
import ProjectDetail from "./components/ProjectDetail";
import { GraphNode } from "./types";

const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2rOqwpJ0X-_ADZIqWKW0SfxKxR3beTpohMe5_GJBLmF6LQz9iYdZSSxl3pMK5iSCJtJuKpQnGX_I38W1DalIvKPoUZQ-A98tASJVFrk0sURvOUtL5qhl4PZv4pcVzuXub9lFCtik2DBYjaI0NomahIFvK7mTnOgvGtg-H4uNHSaE8GyBYGjCpTzAzxp4OVeZEAvW2cEeo7os3niKA8I1G-sZAj3CsGUC99sAYSudazHFCnGokLan0mVd1Bp0OTennuiApZ-f3fFhb";

type Tab = "network" | "messages" | "projects" | "analytics" | "settings" | "admin" | "profile" | "portfolio";

const TAB_LABELS: Record<Tab, string> = {
  network: "Network",
  messages: "Messages",
  projects: "Projects",
  analytics: "Analytics",
  settings: "Settings",
  admin: "Admin",
  profile: "Profile",
  portfolio: "Project",
};

const TAB_ICONS: Record<Tab, typeof Globe> = {
  network: Globe,
  messages: MessageSquare,
  projects: Layers,
  analytics: BarChart,
  settings: Settings,
  admin: Shield,
  profile: User,
  portfolio: Briefcase,
};

const roleTabs: Record<string, Tab[]> = {
  user: ["messages", "network", "portfolio", "settings"],
  coordinator: ["network", "messages", "projects", "analytics", "settings"],
  admin: ["network", "messages", "projects", "analytics", "settings", "admin"],
};

function ProjectsView() {
  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Enterprise Projects</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage and track live milestones and active deployments</p>
        </div>
        <button className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Total Projects</span><p className="text-2xl font-bold text-[#F8FAFC] mt-1">24 Active</p></div>
          <Layers className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Task Completion</span><p className="text-2xl font-bold text-[#00E5FF] mt-1">88.4% Completed</p></div>
          <CheckSquare className="text-green-400 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">System Deployments</span><p className="text-2xl font-bold text-[#00E5FF] mt-1">100% Stable</p></div>
          <BarChart className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Platform Analytics</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Real-time collaboration intelligence and system metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">Weekly Activity</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#94A3B8] mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasEvent = [8, 14, 24].includes(day);
              const isHigh = [14, 24].includes(day);
              return (
                <div key={day} className={`p-3 rounded-xl border relative font-medium transition-all ${hasEvent ? 'bg-[#00E5FF]/10 border-[#00E5FF]/20 text-[#00E5FF]' : 'bg-[#1E293B] border-[#1E293B] text-[#cbd5e1]'}`}>
                  {day}
                  {hasEvent && <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-[#00E5FF]' : 'bg-[#00E5FF]/40'}`} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><Users className="w-3 h-3 text-[#00E5FF]" /> Active Users</span>
                <span className="text-xs font-bold text-[#F8FAFC]">128</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-[#00E5FF]" /> Messages Today</span>
                <span className="text-xs font-bold text-[#F8FAFC]">1,842</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><Activity className="w-3 h-3 text-[#00E5FF]" /> System Uptime</span>
                <span className="text-xs font-bold text-green-400">99.97%</span>
              </div>
            </div>
          </div>
          <div className="bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Trending</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">Collaboration velocity increased 23% this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RestrictedView({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 max-w-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6 text-[#00E5FF]" />
        </div>
        <h2 className="text-sm font-bold text-[#F8FAFC]">Access Restricted</h2>
        <p className="text-xs text-[#94A3B8]">{label}</p>
      </div>
    </div>
  );
}

function DashboardLayout({ userRole }: { userRole: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarTabs = roleTabs[userRole] ?? roleTabs.user;
  const defaultTab = sidebarTabs.includes("network") ? "network" : "settings";
  const currentTab = (sidebarTabs.includes(location.pathname.replace("/", "") as Tab) ? location.pathname.replace("/", "") : defaultTab) as Tab;
  const [profileUser, setProfileUser] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const persistTab = (tab: Tab) => {
    navigate(`/${tab}`, { replace: true });
    localStorage.setItem("current_tab", tab);
  };

  const handleUserLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("current_tab");
    window.location.href = "/login";
  };

  return (
    <div className="h-screen w-screen bg-[#0F172A] text-[#F8FAFC] flex overflow-hidden font-sans">
      {/* ─── Sidebar ─── */}
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
                  active
                    ? "bg-[#00E5FF]/10 text-[#00E5FF]"
                    : "text-[#475569] hover:bg-[#1E293B] hover:text-[#94A3B8]"
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

      {/* ─── Content ─── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ─── Top Bar ─── */}
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
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0F172A] rounded-lg border border-[#1E293B]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="text-[9px] text-green-400 font-semibold tracking-wide">Optimized</span>
            </div>
            <div className="relative">
              <button onClick={() => setShowUserMenu(p => !p)} className="flex items-center gap-2 pl-2.5 border-l border-[#1E293B] group cursor-pointer">
                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#1E293B] border border-[#1E293B]">
                  <img src={USER_AVATAR} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <ChevronDown className="w-3 h-3 text-[#475569] group-hover:text-[#94A3B8] transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── Main Content ─── */}
        <main className="flex-1 bg-[#0F172A] overflow-hidden relative">
          {profileUser ? (
            <PersonProfile
              node={profileUser}
              connections={[]}
              onBack={() => setProfileUser(null)}
              onMessage={() => { navigate("/messages", { state: { chatUser: profileUser } }); setProfileUser(null); }}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="flex-1 h-full"
              >
                <Outlet context={{ searchQuery, onMessageUser: (node: GraphNode) => { navigate("/messages", { state: { chatUser: node } }); }, onViewProfile: (node: GraphNode) => setProfileUser(node) }} />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="fixed top-14 right-5 mt-2 w-72 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#1E293B]">
              <p className="text-xs font-bold text-[#F8FAFC]">Notifications</p>
            </div>
            <div className="p-4 space-y-3">
              {[{
                title: "New message from Alex",
                desc: "Hey, check the latest deployment build.",
                time: "2m ago",
              }, {
                title: "Project milestone completed",
                desc: "Q3 rollout reached 100% completion.",
                time: "1h ago",
              }, {
                title: "System alert resolved",
                desc: "Latency spike on us-east-1 returned to normal.",
                time: "3h ago",
              }].map((n, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-[#0F172A] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-3.5 h-3.5 text-[#00E5FF]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[#F8FAFC] truncate">{n.title}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-2">{n.desc}</p>
                    <p className="text-[9px] text-[#475569] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showUserMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
          <div className="fixed top-14 right-5 mt-2 w-48 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-[#1E293B]">
              <p className="text-xs font-bold text-[#F8FAFC]">Alex Rivera</p>
              <p className="text-[9px] text-[#94A3B8]">alex@nexus.local</p>
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

function GraphViewWrapper() {
  const ctx = useOutletContext<{ searchQuery: string; onMessageUser: (node: GraphNode) => void; onViewProfile: (node: GraphNode) => void }>();
  return <GraphView searchQuery={ctx.searchQuery} onMessageUser={ctx.onMessageUser} onViewProfile={ctx.onViewProfile} />;
}

function MessagesRouter({ userRole }: { userRole: string }) {
  if (userRole === "user") return <PrivateInbox />;
  return <ChatView />;
}

function RoleRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const role = localStorage.getItem("user_role");
  if (!role || !allowedRoles.includes(role)) {
    return <RestrictedView label="You do not have permission to access this section." />;
  }
  return <>{children}</>;
}

export default function App() {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("user_token"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("user_role"));

  const handleUserLogin = (token: string, role: string, userId: string) => {
    setUserToken(token);
    setUserRole(role);
    const defaultTab = roleTabs[role]?.find(t => t !== "settings" && t !== "admin") || "settings";
    navigate(`/${defaultTab}`, { replace: true });
  };

  const handleUserLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("current_tab");
    setUserToken(null);
    setUserRole(null);
  };

  // Not authenticated
  if (!userToken || !userRole) {
    return (
      <Routes>
        <Route path="/login" element={<UserLogin onLogin={handleUserLogin} onBackToLanding={() => navigate("/", { replace: true })} />} />
        <Route path="*" element={<LandingPage onGetStarted={() => navigate("/login")} />} />
      </Routes>
    );
  }

  // Authenticated dashboard
  return (
    <Routes>
      <Route element={<DashboardLayout userRole={userRole} />}>
        <Route path="/network" element={<RoleRoute allowedRoles={["admin", "coordinator", "user"]}><GraphViewWrapper /></RoleRoute>} />
        <Route path="/messages" element={<RoleRoute allowedRoles={["admin", "coordinator", "user"]}><MessagesRouter userRole={userRole} /></RoleRoute>} />
        <Route path="/projects" element={<RoleRoute allowedRoles={["admin", "coordinator"]}><ProjectsView /></RoleRoute>} />
        <Route path="/portfolio" element={<RoleRoute allowedRoles={["user"]}><UserPortfolio /></RoleRoute>} />
        <Route path="/analytics" element={<RoleRoute allowedRoles={["admin", "coordinator"]}><AnalyticsView /></RoleRoute>} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/settings" element={<ProfileView />} />
        <Route path="/profile/:userId" element={<ProfileView />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminPanel /></RoleRoute>} />
        <Route path="*" element={<Navigate to={`/${roleTabs[userRole]?.find(t => t !== "settings" && t !== "admin") || "settings"}`} replace />} />
      </Route>
    </Routes>
  );
}
