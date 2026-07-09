import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Workflow, MessageSquare, Calendar, LogOut, Settings, Bolt, 
  Layers, CheckSquare, BarChart, Clock, CalendarDays, Plus, CalendarRange 
} from "lucide-react";
import ChatView from "./components/ChatView";
import GraphView from "./components/GraphView";
import ProfileView from "./components/ProfileView";
import PersonProfile from "./components/PersonProfile";
import NexusImage from "./components/NexusImage";
import { GraphNode } from "./types";

// Active user avatar (Alex Rivera)
const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2rOqwpJ0X-_ADZIqWKW0SfxKxR3beTpohMe5_GJBLmF6LQz9iYdZSSxl3pMK5iSCJtJuKpQnGX_I38W1DalIvKPoUZQ-A98tASJVFrk0sURvOUtL5qhl4PZv4pcVzuXub9lFCtik2DBYjaI0NomahIFvK7mTnOgvGtg-H4uNHSaE8GyBYGjCpTzAzxp4OVeZEAvW2cEeo7os3niKA8I1G-sZAj3CsGUC99sAYSudazHFCnGokLan0mVd1Bp0OTennuiApZ-f3fFhb";

type Tab = "home" | "projects" | "messages" | "calendar" | "settings";

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("messages");
  const [profileUser, setProfileUser] = useState<GraphNode | null>(null);

  // Secondary placeholders for Projects and Calendar views
  const renderProjectsView = () => (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#222]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Projects</h1>
          <p className="text-xs text-slate-400 mt-1">Manage and track live milestones and active deployments</p>
        </div>
        <button className="bg-[#00f2ff] hover:bg-[#00f2ff]/90 text-black text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,255,0.25)] cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric widgets */}
        <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-[#222] shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Projects</span>
            <p className="text-2xl font-bold text-white mt-1">24 Active</p>
          </div>
          <Layers className="text-[#00f2ff] w-8 h-8 opacity-80 animate-pulse" />
        </div>
        <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-[#222] shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Task Completion</span>
            <p className="text-2xl font-bold text-[#00f2ff] mt-1">88.4% Completed</p>
          </div>
          <CheckSquare className="text-emerald-400 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#0f0f0f] p-5 rounded-2xl border border-[#222] shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Deployments</span>
            <p className="text-2xl font-bold text-[#00f2ff] mt-1">100% Stable</p>
          </div>
          <BarChart className="text-[#00f2ff] w-8 h-8 opacity-80" />
        </div>
      </div>

      <div className="bg-[#0f0f0f] p-6 rounded-2xl border border-[#222] shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Milestone Tracker</h3>
        <div className="space-y-4">
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Database Cluster Upgrades</h4>
              <p className="text-[10px] text-slate-500 mt-1">Lead: Jordan Smith • Target: July 15</p>
            </div>
            <div className="w-full md:w-48 bg-[#161616] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00f2ff] rounded-full" style={{ width: "75%" }} />
            </div>
            <span className="bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">In Review</span>
          </div>

          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Global CDN Geo-Routing</h4>
              <p className="text-[10px] text-slate-500 mt-1">Lead: Alex Rivera • Target: July 28</p>
            </div>
            <div className="w-full md:w-48 bg-[#161616] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">Completed</span>
          </div>

          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-[#222] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-200">Holographic Canvas Render Pipeline</h4>
              <p className="text-[10px] text-slate-500 mt-1">Lead: Elena Rodriguez • Target: Aug 12</p>
            </div>
            <div className="w-full md:w-48 bg-[#161616] h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00f2ff]/40 rounded-full" style={{ width: "40%" }} />
            </div>
            <span className="bg-[#00f2ff]/5 text-[#00f2ff]/60 border border-[#00f2ff]/10 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">Developing</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#222]">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Calendar</h1>
          <p className="text-xs text-slate-400 mt-1">Review team synchronization events and cloud operations logs</p>
        </div>
        <button className="bg-[#00f2ff] hover:bg-[#00f2ff]/90 text-black text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,255,0.25)] cursor-pointer">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f0f0f] p-6 rounded-2xl border border-[#222] shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">July 2026</h3>
            <div className="flex gap-2">
              <button className="p-1.5 rounded-lg bg-[#161616] hover:bg-[#222] text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Clock className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#161616] hover:bg-[#222] text-slate-400 hover:text-white transition-colors cursor-pointer">
                <CalendarRange className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {/* Rendering calendar cells for July 2026 */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={`empty-${i}`} className="p-3 text-slate-800">2{8+i}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 8; // Matching July 8 current date metadata
              return (
                <div 
                  key={`day-${day}`} 
                  className={`p-3 rounded-xl border relative font-medium transition-all cursor-pointer ${
                    isToday 
                      ? 'bg-[#00f2ff] border-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/20 font-bold' 
                      : 'bg-[#0a0a0a]/40 border-[#222] text-slate-300 hover:bg-[#161616]'
                  }`}
                >
                  {day}
                  {day === 14 && (
                    <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-black' : 'bg-[#00f2ff]'}`} />
                  )}
                  {day === 24 && (
                    <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-black' : 'bg-amber-400'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f0f0f] p-6 rounded-2xl border border-[#222] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00f2ff] mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#0a0a0a] rounded-xl border-l-4 border-l-[#00f2ff] border border-[#222]">
                <span className="text-[9px] font-mono text-[#00f2ff] uppercase tracking-wider font-semibold">09:00 AM - 10:30 AM</span>
                <h4 className="text-xs font-bold text-slate-200 mt-1">Operational Standup meeting</h4>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-xl border-l-4 border-l-emerald-500 border border-[#222]">
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">01:00 PM - 02:00 PM</span>
                <h4 className="text-xs font-bold text-slate-200 mt-1">Nexus Core Deployment Run</h4>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] p-6 rounded-2xl border border-[#222] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Sync Reminders</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">July 14: Nexus Core Infrastructure Review. Ensure database logs are exported.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#050505] text-[#e0e0e0] flex flex-col overflow-hidden font-sans">

      {/* Top Navbar */}
      <header className="h-16 w-full bg-[#0f0f0f] flex items-center px-4 gap-3 border-b border-[#222] z-30 shrink-0 select-none">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mr-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center shadow-lg shadow-[#00f2ff]/10">
            <Bolt className="text-[#00f2ff] fill-[#00f2ff]/50 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-light tracking-tighter text-white uppercase leading-none">STG<span className="font-black text-[#00f2ff]">OS</span></h1>
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
                  ? "bg-[#00f2ff]/10 border border-[#00f2ff]/25 text-[#00f2ff] shadow-sm font-bold"
                  : "border border-transparent text-slate-400 hover:bg-[#161616] hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* System Status + Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#0a0a0a] rounded-lg border border-[#222]">
            <span className="text-[9px] uppercase tracking-wider text-[#666]">System</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] text-green-400 font-semibold">Optimized</span>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-[#222]">
            <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden border border-white/5">
              <NexusImage src={USER_AVATAR} alt="User Avatar" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-white leading-tight">Alex Rivera</p>
              <p className="text-[8px] text-[#666] uppercase tracking-wider">Premium OS</p>
            </div>
            <button
              onClick={() => setCurrentTab("settings")}
              className="p-1.5 text-slate-500 hover:text-[#00f2ff] cursor-pointer hover:bg-slate-800/40 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace Area */}
      <main className="flex-1 flex flex-col bg-[#050505] overflow-hidden relative">
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
