import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Workflow, MessageSquare, Calendar, LogOut, Settings, Bolt, Lock,
  Layers, CheckSquare, BarChart, Clock, CalendarDays, Plus, CalendarRange 
} from "lucide-react";
import ChatView from "./components/ChatView";
import GraphView from "./components/GraphView";
import ProfileView from "./components/ProfileView";
import PersonProfile from "./components/PersonProfile";
import NexusImage from "./components/NexusImage";
import UserLogin from "./components/UserLogin";
import LandingPage from "./components/LandingPage";
import { GraphNode } from "./types";

// Active user avatar (Alex Rivera)
const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2rOqwpJ0X-_ADZIqWKW0SfxKxR3beTpohMe5_GJBLmF6LQz9iYdZSSxl3pMK5iSCJtJuKpQnGX_I38W1DalIvKPoUZQ-A98tASJVFrk0sURvOUtL5qhl4PZv4pcVzuXub9lFCtik2DBYjaI0NomahIFvK7mTnOgvGtg-H4uNHSaE8GyBYGjCpTzAzxp4OVeZEAvW2cEeo7os3niKA8I1G-sZAj3CsGUC99sAYSudazHFCnGokLan0mVd1Bp0OTennuiApZ-f3fFhb";

type Tab = "home" | "projects" | "messages" | "calendar" | "settings";

export default function App() {
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem("user_token"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("user_role"));
  const [showLanding, setShowLanding] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>("messages");

  const handleUserLogin = (token: string, role: string, userId: string) => {
    setUserToken(token);
    setUserRole(role);
  };

  const handleUserLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_role");
    setUserToken(null);
    setUserRole(null);
  };

  const [profileUser, setProfileUser] = useState<GraphNode | null>(null);

  if (!userToken || !userRole) {
    if (showLanding) {
      return <LandingPage onGetStarted={() => setShowLanding(false)} />;
    }
    return <UserLogin onLogin={handleUserLogin} onBackToLanding={() => setShowLanding(true)} />;
  }

  if (userRole === "user") {
    return (
      <div className="min-h-screen bg-[#FEF3C8] flex items-center justify-center p-4">
        <div className="bg-white border border-[#e8e4df] rounded-2xl p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200/60 flex items-center justify-center mx-auto">
            <Lock className="text-amber-600 w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[#1a1a1a]">Access Restricted</h1>
          <p className="text-sm text-[#6a6a6a]">
            Regular users are not yet allowed to access the platform. Only coordinators can use the chat.
          </p>
          <button
            onClick={handleUserLogout}
            className="px-6 h-10 bg-[#f8f6f3] hover:bg-[#f0ece7] text-[#1a1a1a] text-xs font-bold rounded-xl border border-[#e8e4df] transition-all cursor-pointer"
          >
            Sign in as a different user
          </button>
        </div>
      </div>
    );
  }

  // Secondary placeholders for Projects and Calendar views
  const renderProjectsView = () => (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#e8e4df]">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Enterprise Projects</h1>
          <p className="text-xs text-[#6a6a6a] mt-1">Manage and track live milestones and active deployments</p>
        </div>
        <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/10 cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric widgets */}
        <div className="bg-white p-5 rounded-2xl border border-[#e8e4df] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8a8a8a] tracking-wider">Total Projects</span>
            <p className="text-2xl font-bold text-[#1a1a1a] mt-1">24 Active</p>
          </div>
          <Layers className="text-[#c9953a] w-8 h-8 opacity-80" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e8e4df] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8a8a8a] tracking-wider">Task Completion</span>
            <p className="text-2xl font-bold text-[#c9953a] mt-1">88.4% Completed</p>
          </div>
          <CheckSquare className="text-emerald-600 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e8e4df] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8a8a8a] tracking-wider">System Deployments</span>
            <p className="text-2xl font-bold text-[#c9953a] mt-1">100% Stable</p>
          </div>
          <BarChart className="text-[#c9953a] w-8 h-8 opacity-80" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#e8e4df] shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6a6a6a] mb-4">Milestone Tracker</h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#faf7f0] rounded-xl border border-[#e8e4df] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a]">Database Cluster Upgrades</h4>
              <p className="text-[10px] text-[#8a8a8a] mt-1">Lead: Jordan Smith • Target: July 15</p>
            </div>
            <div className="w-full md:w-48 bg-[#e8e4df] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#c9953a] rounded-full" style={{ width: "75%" }} />
            </div>
            <span className="bg-[#c9953a]/10 text-[#c9953a] border border-[#c9953a]/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">In Review</span>
          </div>

          <div className="p-4 bg-[#faf7f0] rounded-xl border border-[#e8e4df] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a]">Global CDN Geo-Routing</h4>
              <p className="text-[10px] text-[#8a8a8a] mt-1">Lead: Alex Rivera • Target: July 28</p>
            </div>
            <div className="w-full md:w-48 bg-[#e8e4df] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "95%" }} />
            </div>
            <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">Completed</span>
          </div>

          <div className="p-4 bg-[#faf7f0] rounded-xl border border-[#e8e4df] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a]">Holographic Canvas Render Pipeline</h4>
              <p className="text-[10px] text-[#8a8a8a] mt-1">Lead: Elena Rodriguez • Target: Aug 12</p>
            </div>
            <div className="w-full md:w-48 bg-[#e8e4df] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#c9953a]/40 rounded-full" style={{ width: "40%" }} />
            </div>
            <span className="bg-[#c9953a]/5 text-[#c9953a]/60 border border-[#c9953a]/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">Developing</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#e8e4df]">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">Enterprise Calendar</h1>
          <p className="text-xs text-[#6a6a6a] mt-1">Review team synchronization events and cloud operations logs</p>
        </div>
        <button className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/10 cursor-pointer">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e8e4df] shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a]">July 2026</h3>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg bg-[#f8f6f3] hover:bg-[#f0ece7] text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
                <Clock className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#f8f6f3] hover:bg-[#f0ece7] text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
                <CalendarRange className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#8a8a8a] mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {/* Rendering calendar cells for July 2026 */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`empty-${i}`} className="p-3 text-[#e8e4df]">2{8+i}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 8;
              return (
                <div 
                  key={`day-${day}`} 
                  className={`p-3 rounded-xl border relative font-medium transition-all cursor-pointer ${
                    isToday 
                      ? 'bg-[#c9953a] border-[#c9953a] text-white shadow-lg shadow-[#c9953a]/20 font-bold' 
                      : 'bg-[#faf7f0] border-[#e8e4df] text-[#4a4a4a] hover:bg-white'
                  }`}
                >
                  {day}
                  {day === 14 && (
                    <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-[#c9953a]'}`} />
                  )}
                  {day === 24 && (
                    <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-amber-500'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e8e4df] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a] mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#faf7f0] rounded-xl border-l-4 border-l-[#c9953a] border border-[#e8e4df]">
                <span className="text-[9px] font-mono text-[#c9953a] uppercase tracking-wider font-semibold">09:00 AM - 10:30 AM</span>
                <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Operational Standup meeting</h4>
              </div>
              <div className="p-3 bg-[#faf7f0] rounded-xl border-l-4 border-l-emerald-600 border border-[#e8e4df]">
                <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider font-semibold">01:00 PM - 02:00 PM</span>
                <h4 className="text-xs font-bold text-[#1a1a1a] mt-1">Nexus Core Deployment Run</h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e8e4df] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6a6a6a] mb-3">Sync Reminders</h3>
            <p className="text-[11px] text-[#6a6a6a] leading-relaxed font-normal">July 14: Nexus Core Infrastructure Review. Ensure database logs are exported.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#FEF3C8] text-[#1a1a1a] flex flex-col overflow-hidden font-sans">

      {/* Top Navbar */}
      <header className="h-16 w-full bg-white flex items-center px-4 gap-3 border-b border-[#e8e4df] z-30 shrink-0 select-none">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mr-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#c9953a]/10 border border-[#c9953a]/30 flex items-center justify-center shadow-lg shadow-[#c9953a]/10">
            <Bolt className="text-[#c9953a] fill-[#c9953a]/50 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-light tracking-tighter text-[#1a1a1a] uppercase leading-none">STG<span className="font-black text-[#c9953a]">OS</span></h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 flex-1">
          {([
            { tab: "home" as Tab, icon: Home, label: "Home" },
            { tab: "projects" as Tab, icon: Workflow, label: "Projects" },
            { tab: "messages" as Tab, icon: MessageSquare, label: "Messages" },
            { tab: "calendar" as Tab, icon: Calendar, label: "Calendar" },
            { tab: "settings" as Tab, icon: Settings, label: "Settings" },
          ] as const).map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-xs cursor-pointer ${
                currentTab === tab
                  ? "bg-[#c9953a]/10 border border-[#c9953a]/25 text-[#c9953a] shadow-sm font-bold"
                  : "border border-transparent text-[#6a6a6a] hover:bg-[#f8f6f3] hover:text-[#1a1a1a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* System Status + Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#f8f6f3] rounded-lg border border-[#e8e4df]">
            <span className="text-[9px] uppercase tracking-wider text-[#8a8a8a]">System</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-green-600 font-semibold">Optimized</span>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-[#e8e4df]">
            <div className="w-8 h-8 rounded-full bg-[#e8e4df] overflow-hidden border border-[#e8e4df]">
              <NexusImage src={USER_AVATAR} alt="User Avatar" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-[#1a1a1a] leading-tight">Alex Rivera</p>
              <p className="text-[8px] text-[#8a8a8a] uppercase tracking-wider">Premium OS</p>
            </div>
            <button
              onClick={handleUserLogout}
              className="p-1.5 text-[#8a8a8a] hover:text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace Area */}
      <main className="flex-1 flex flex-col bg-[#FEF3C8] overflow-hidden relative">
        {profileUser ? (
          <PersonProfile
            node={profileUser}
            connections={[]}
            onBack={() => setProfileUser(null)}
            onMessage={() => { setCurrentTab("messages"); setProfileUser(null); }}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 h-full"
            >
              {currentTab === "messages" && <ChatView />}
              {currentTab === "home" && <GraphView onMessageUser={(name) => setCurrentTab("messages")} onViewProfile={(node) => setProfileUser(node)} />}
              {currentTab === "settings" && <ProfileView />}
              {currentTab === "projects" && renderProjectsView()}
              {currentTab === "calendar" && renderCalendarView()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
