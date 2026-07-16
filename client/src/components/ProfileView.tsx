import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Edit3, Mail, MapPin, Plus, UserPlus, Eye, ArrowLeft,
  ChevronLeft, ChevronRight, Calendar, Pin, Clock, Check, Save, X
} from "lucide-react";
import NexusImage from "./NexusImage";
import LazyList from "./LazyList";
import { Project, Note, Activity, EventSync } from "../types";

// Premium asset references from mockups
const COVER_BANNER = "https://lh3.googleusercontent.com/aida-public/AB6AXuAgmCtKeo7BXCQqpo6mZKPeaOk3MsPnNqULQKi36hjXl_TjCdfCmkJDdXoQzWSTGTGIykGd_WVWCLyI9-UzQ_NcJDyguxlaQdyoCQ99yfHxAHR9nuUlUXob1vVsFCCONNIwegi5murEW8YkH1R6JmcfAwlRA89tfdD0HBKS5DiKVY1v2mBGS09pJQNqL91vvJjg5Z_kOnDtUrD4p2ojeLNAMNFIP8_GBn24nOqqrjDCN2-62kdo1b64cKnH619km8FUUbkScwD9WCzK";
const PROFILE_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2V_sxDq3DOHSTQP8fIFkMRLjcO10-lJkRUH-Ov7JssRfq80eaUo7029AEuTVpTmOYZwvSeT5uduWa3hGS0fAIINQBkiPBPOvcpNlscGXJGNfKExupdoiXioYsDlzJuYCmVz1KB2K0-jWFL-1ZuLYwhMRWivAAmOPHzgqUK6Rr88wZnBX-Md2GaNNFV-u3GfFlgJEjp1RM5o86qR4EWjUabLgEfASkVIQKQBktEachzyMjVnda9kNeTijR2E5H0SfvwCEOoRKW2_06";
const SARAH_CHEN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGh8_IZ7zOk6A22VBMzUKVrpkdmFTpCkpwdnq7OSAKsAFBC6uVvquMrckC_rl6AUmg3zxvHNCI8qRBbuT7Nl6zhqOSvqzeBeOyOcddZdb9dj7KC4a8PBDeVo-Wbhool7K0FzKx4rq2Nl96rGDrxxNzD6eS5cNoMbKVBhi4QXX2wI1_KnBBYVWkSXLeSVCQ7IhRutEf4MyZYw2C5PMAOBsLCNNsG34f3Xxy27GYv_4RU4611U3ZNUwBPpT2uuuU-5BLCdpp2GVrICm-";
const MARCUS_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCehcfhNjJ_tUDQsSiuzAxAvzkmgsSHPEm2jPor6CSDl1essQWi65M9yCbnYzl4wXHhJ768QTmwMThPF5V_NXX4sPRyo3fLUtBtxiCf4LHmyfxG72U2CFMnOA0tfECuCyeBt-nL3DZo3-GNU10cs1gMulGyQi4EmdHMglebsh_xOf8_gNv9KOd8LSshWWMgEjIVw2HRl3-T9Q84e1je2a3FuHbj6JNNjeiU26D1wcVA4prJpmmm8HtflPSH9th2jkqZICcM7fhyR9Hs";

const PORTFOLIO_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwYEhBqOqBZl3w3INsiZttRD-Etpd0WX5_B-aThv8gnqtrlyiMrvpKyQaz1ez45HnKBcm_879BmQGo64vagR1vwJ-qBL8eAj54RXdce9T1fWlkuV2TADi5iucECiy6K-W2wRsiWudVCZPhnsKje97wp8o_1cSD7vflOh5cFxvESv96rTn4T_bwnXCGmkmOKcnqDh5Nima-8FiFnIQ4CjJ4QiU46d97agHLP1IE9VJrhNyokT54-rX7ypvVkkFLAt5UrwoH8PUJg24M";
const PORTFOLIO_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB5_bh5j2uJZ7aGGr-W_iVbWJ4_8iIO3OrmysAwgcHIGY1qgnLGf8qrc7y4WtIsyrf5rCEZLo02EeTFywRLrNMbtygEly2L0lXzYDlo7bipAVEYDdSRJOZN-21oyZwowXEJKaDHmUYeqbElxcrbWkq3TCghzjd1Pi9WVo-MfK6KoVhPgVEd5Qsj5bELnlx-hcC8CWAwl0peN8ehjnqV0hpLhCctPu0qmHOXCjk75z9zsilNH1kCIFHKdYaFZEob4YXsnNd3vn27xsJx";
const PORTFOLIO_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFoGSMJQS3Wd2VRK2EicCAgZ20ql14FDlCzgcF31NfgfDJH7UYLsxTP7ffCshLXIulMhzWrqCn_tNguwGtzSH8dZSY6DpJbMFnGNI9lSY-vsmPz4wtL0hODZu8jLHQ90hbTYj9m5hCAUpUXa4UcX8whEg5rv8puQvbph8xT3Plm0p8uUfdH4MlI6C9Ev0aJ8vVeDZ6WxkX9xsJN9tq_MfVir6qcHEV0Bn_XB32Zctax2qBOeJLABcfXxMjVOcyiQbHI1SkFp2bniwQ";

const initialProjects: Project[] = [
  { id: "p1", name: "Project Aether", status: "Active Now", description: "Next-gen real-time synchronization engine for distributed workspace collaboration.", contributorsCount: 12 },
  { id: "p2", name: "Vortex Core", status: "Archived", description: "High-frequency data streaming middleware achieving < 2ms latency on global edge nodes.", contributorsCount: 8, performanceScore: "99% Performance Score" }
];

const initialNotes: Note[] = [
  { id: "n1", title: "Review of WebGPU specs", updatedAt: "Updated 2 hours ago", status: "Draft" },
  { id: "n2", title: "Scalability Bottleneck Analysis", updatedAt: "Updated Yesterday", status: "Shared with Engineering" }
];

const initialActivities: Activity[] = [
  { id: "a1", type: "push", text: "Pushed 4 commits to Aether-Core/main", time: "12 minutes ago", color: "bg-blue-500" },
  { id: "a2", type: "endorse", text: "Endorsed Sarah Chen for System Design", time: "4 hours ago", color: "bg-green-500" },
  { id: "a3", type: "publish", text: "Published article 'The Future of Edge Computing'", time: "2 days ago", color: "bg-amber-500" }
];

export default function ProfileView() {
  // Local profile state for fully dynamic editing
  const [profile, setProfile] = useState({
    name: "Alex Rivera",
    title: "Principal Systems Architect & Creative Technologist",
    location: "Palo Alto, California • Remote",
    bio: "Crafting high-performance digital ecosystems at the intersection of architecture and human experience. 10+ years of experience scaling distributed systems and leading multidisciplinary design teams at Nexus. Passionate about WebGL, generative AI, and sustainable infrastructure."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [activeDay, setActiveDay] = useState(14); // Interactive calendar active day
  const [followedState, setFollowedState] = useState<{ [key: string]: boolean }>({});

  const handleEditOpen = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const toggleFollow = (id: string) => {
    setFollowedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-[#FEF3C8] pb-12" id="nexus-profile-view">
      <div className="relative">
        {/* Banner Cover Image (Fluid height on desktop / mobile) */}
        <div className="h-56 md:h-72 w-full overflow-hidden relative group">
          <NexusImage 
            src={COVER_BANNER} 
            alt="Futuristic neon city panorama" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FEF3C8] via-[#FEF3C8]/80 to-transparent" />
        </div>

        {/* Profile Identity Card Overlay */}
        <div className="max-w-[1300px] mx-auto px-6 md:px-12 -mt-16 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-[#e8e4df]">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-[#FEF3C8] bg-[#f8f6f3] overflow-hidden shadow-2xl shrink-0">
              <NexusImage 
                src={PROFILE_AVATAR} 
                alt="Alex Rivera headshot" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left pb-1">
              <h1 className="text-xl md:text-3xl font-bold text-[#1a1a1a] tracking-tight leading-tight">{profile.name}</h1>
              <p className="text-xs md:text-sm text-[#c9953a] font-semibold mt-1 leading-normal">{profile.title}</p>
              <div className="flex items-center justify-center md:justify-start gap-1 text-[#6a6a6a] text-[11px] mt-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#c9953a] opacity-80" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0 pb-1">
              <button 
                onClick={handleEditOpen}
                className="bg-[#c9953a] hover:bg-[#c9953a]/90 text-[#1a1a1a] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#c9953a]/15 active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button className="bg-[#f8f6f3] hover:bg-[#222] border border-[#e8e4df] text-[#e0e0e0] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                <Mail className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content Panels */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column (Width: 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* About/Bio Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a] mb-3">About</h3>
            <p className="text-xs text-[#4a4a4a] leading-relaxed font-normal">{profile.bio}</p>
          </div>

          {/* Expertise Chips */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a] mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#c9953a]/10 text-[#c9953a] border border-[#c9953a]/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9953a] animate-pulse" /> System Architecture
              </span>
              <span className="bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Three.js / WebGL
              </span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Go Microservices
              </span>
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> UI/UX Vision
              </span>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Product Strategy
              </span>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a] mb-4">Nexus Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8f6f3] rounded-xl border border-[#e8e4df] text-center">
                <p className="text-3xl font-bold text-[#c9953a] tracking-tight leading-none">84</p>
                <p className="text-[9px] text-[#8a8a8a] uppercase tracking-widest mt-2 font-bold">Projects</p>
              </div>
              <div className="p-4 bg-[#f8f6f3] rounded-xl border border-[#e8e4df] text-center">
                <p className="text-3xl font-bold text-green-600 tracking-tight leading-none">12k</p>
                <p className="text-[9px] text-[#8a8a8a] uppercase tracking-widest mt-2 font-bold">Impact</p>
              </div>
            </div>
          </div>

          {/* Network Connections */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a]">Network</h3>
              <button className="text-[#c9953a] text-[10px] font-bold uppercase tracking-wider hover:underline cursor-pointer">View All</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#f8f6f3] border border-[#e8e4df]">
                  <NexusImage src={SARAH_CHEN_AVATAR} alt="Sarah Chen avatar" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1a1a1a] truncate">Sarah Chen</p>
                  <p className="text-[10px] text-[#6a6a6a] truncate">Lead Frontend Designer</p>
                </div>
                <button 
                  onClick={() => toggleFollow('sarah')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border cursor-pointer ${
                    followedState['sarah'] 
                      ? 'bg-[#c9953a]/10 border-[#c9953a]/30 text-[#c9953a]' 
                      : 'bg-[#f8f6f3] hover:bg-[#222] border-[#e8e4df] text-[#6a6a6a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {followedState['sarah'] ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#f8f6f3] border border-[#e8e4df]">
                  <NexusImage src={MARCUS_AVATAR} alt="Marcus Thorne avatar" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1a1a1a] truncate">Marcus Thorne</p>
                  <p className="text-[10px] text-[#6a6a6a] truncate">Cloud Infrastructure Lead</p>
                </div>
                <button 
                  onClick={() => toggleFollow('marcus')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border cursor-pointer ${
                    followedState['marcus'] 
                      ? 'bg-[#c9953a]/10 border-[#c9953a]/30 text-[#c9953a]' 
                      : 'bg-[#f8f6f3] hover:bg-[#222] border-[#e8e4df] text-[#6a6a6a] hover:text-[#1a1a1a]'
                  }`}
                >
                  {followedState['marcus'] ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Width: 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Portfolio Highlights */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a] mb-4">Portfolio Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-44 rounded-xl overflow-hidden group relative border border-[#e8e4df]">
                <NexusImage src={PORTFOLIO_1} alt="Glass UI visualization" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-[#c9953a]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="text-[#1a1a1a] w-6 h-6 shadow-sm" />
                </div>
              </div>
              <div className="h-44 rounded-xl overflow-hidden group relative border border-[#e8e4df]">
                <NexusImage src={PORTFOLIO_2} alt="Decentralized cloud network" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-[#c9953a]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="text-[#1a1a1a] w-6 h-6 shadow-sm" />
                </div>
              </div>
              <div className="h-44 rounded-xl overflow-hidden group relative border border-[#e8e4df]">
                <NexusImage src={PORTFOLIO_3} alt="Minimal datacenter architecture" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                <div className="absolute inset-0 bg-[#c9953a]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="text-[#1a1a1a] w-6 h-6 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Project Cards (Bento) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialProjects.map((proj) => (
              <div key={proj.id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md relative overflow-hidden group hover:border-[#c9953a]/40 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <span className="text-[#c9953a] text-6xl">⚙️</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3.5 inline-block ${
                  proj.status === "Active Now" ? "bg-green-500/10 border border-green-500/20 text-green-600" : "bg-[#f8f6f3] border border-[#e8e4df] text-[#6a6a6a]"
                }`}>
                  {proj.status}
                </span>
                <h4 className="text-base font-bold text-[#1a1a1a] mb-1 leading-snug">{proj.name}</h4>
                <p className="text-[#6a6a6a] text-xs mb-5 leading-relaxed">{proj.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#f8f6f3]" />
                    <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#f8f6f3]" />
                    <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#f8f6f3]" />
                  </div>
                  {proj.performanceScore ? (
                    <span className="text-[10px] text-[#c9953a] font-bold">{proj.performanceScore}</span>
                  ) : (
                    <span className="text-[10px] text-[#6a6a6a] font-medium">+{proj.contributorsCount} Contributors</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bento Grid: Notes & Recent Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes List */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a]">Recent Notes</h3>
                <Plus className="w-4 h-4 text-[#6a6a6a] hover:text-[#1a1a1a] cursor-pointer" />
              </div>
              <ul className="space-y-3">
                {initialNotes.map((note) => (
                  <li key={note.id} className="p-3 bg-[#f8f6f3] rounded-xl border border-[#e8e4df] hover:border-[#c9953a]/30 hover:bg-[#f8f6f3]/80 transition-all cursor-pointer">
                    <p className="text-xs font-bold text-[#1a1a1a] mb-1">{note.title}</p>
                    <p className="text-[9px] text-[#6a6a6a]">{note.updatedAt} • {note.status}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity Feed */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a]">Recent Activity</h3>
              <div className="border-l-2 border-[#e8e4df] ml-1.5 pl-5 space-y-5 relative">
                {initialActivities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full ${act.color} ring-4 ring-[#0f0f0f]`} />
                    <p className="text-xs text-[#2d2d2d] font-medium leading-normal">{act.text}</p>
                    <p className="text-[10px] text-[#8a8a8a] mt-1 font-medium">{act.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Sync System */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#e8e4df] shadow-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#c9953a]">Upcoming Syncs</h3>
              <div className="flex items-center gap-3 text-[#6a6a6a]">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-[#c9953a]" />
                <span className="text-xs font-bold">October 2023</span>
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-[#c9953a]" />
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <span key={idx} className="text-[10px] text-[#8a8a8a] font-bold">{day}</span>
              ))}
            </div>

            {/* October Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`empty-${i}`} className="p-2 text-slate-600/30">2{5+i}</div>
              ))}
              <div className="p-2 text-slate-600/30">28</div>
              {Array.from({ length: 11 }, (_, i) => {
                const day = i + 1;
                return (
                  <div key={`day-${day}`} className="p-2 text-[#6a6a6a] font-medium">
                    {day}
                  </div>
                );
              })}
              
              {/* Highlight event days */}
              <div 
                onClick={() => setActiveDay(12)}
                className={`p-2 rounded-lg relative cursor-pointer font-medium transition-colors ${
                  activeDay === 12 ? 'bg-[#c9953a]/10 border border-[#c9953a]/30 text-[#c9953a]' : 'text-[#6a6a6a] hover:text-[#c9953a]'
                }`}
              >
                12
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c9953a]" />
              </div>

              <div 
                onClick={() => setActiveDay(13)}
                className={`p-2 rounded-lg relative cursor-pointer font-medium transition-colors ${
                  activeDay === 13 ? 'bg-green-500/10 border border-green-500/35 text-green-600' : 'text-[#6a6a6a] hover:text-green-600'
                }`}
              >
                13
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              </div>

              <div 
                onClick={() => setActiveDay(14)}
                className={`p-2 rounded-lg relative cursor-pointer font-bold transition-all ${
                  activeDay === 14 
                    ? 'bg-[#c9953a] text-[#1a1a1a] shadow-lg shadow-[#c9953a]/20' 
                    : 'bg-[#c9953a]/10 border border-[#c9953a]/25 text-[#c9953a]'
                }`}
              >
                14
              </div>

              {Array.from({ length: 17 }, (_, i) => {
                const day = i + 15;
                return (
                  <div key={`day-${day}`} className="p-2 text-[#6a6a6a] font-medium">
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Event detail rendering based on activeDay selection */}
            <div className="mt-5 pt-4 border-t border-[#e8e4df]">
              <AnimatePresence mode="wait">
                {activeDay === 14 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-4 p-4 bg-[#f8f6f3] border border-[#e8e4df] rounded-xl border-l-4 border-l-[#c9953a]"
                  >
                    <div className="shrink-0 text-center bg-white border border-[#e8e4df] p-2 rounded-lg w-12">
                      <p className="text-[10px] uppercase font-bold text-[#8a8a8a]">Oct</p>
                      <p className="text-base font-bold text-[#1a1a1a] leading-none mt-0.5">14</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1a1a1a]">Nexus Core Infrastructure Review</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#6a6a6a]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#8a8a8a]" /> 10:00 AM - 11:30 AM</span>
                        <span>•</span>
                        <span>Zoom</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeDay === 12 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-4 p-4 bg-[#f8f6f3] border border-[#e8e4df] rounded-xl border-l-4 border-l-[#c9953a]"
                  >
                    <div className="shrink-0 text-center bg-white border border-[#e8e4df] p-2 rounded-lg w-12">
                      <p className="text-[10px] uppercase font-bold text-[#8a8a8a]">Oct</p>
                      <p className="text-base font-bold text-[#1a1a1a] leading-none mt-0.5">12</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1a1a1a]">Project Aether Architectural Sync</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#6a6a6a]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#8a8a8a]" /> 02:00 PM - 03:00 PM</span>
                        <span>•</span>
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeDay === 13 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-4 p-4 bg-[#f8f6f3] border border-[#e8e4df] rounded-xl border-l-4 border-l-green-500"
                  >
                    <div className="shrink-0 text-center bg-white border border-[#e8e4df] p-2 rounded-lg w-12">
                      <p className="text-[10px] uppercase font-bold text-[#8a8a8a]">Oct</p>
                      <p className="text-base font-bold text-[#1a1a1a] leading-none mt-0.5">13</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1a1a1a]">Go Microservices Benchmarking</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#6a6a6a]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#8a8a8a]" /> 09:00 AM - 10:30 AM</span>
                        <span>•</span>
                        <span>Office Room 4B</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Profile editor glass modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#e8e4df] p-6 rounded-2xl max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-[#6a6a6a] hover:text-[#1a1a1a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#c9953a] mb-4">Edit Profile details</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#6a6a6a] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#f8f6f3] border border-[#e8e4df] p-3 rounded-xl text-[#2d2d2d] focus:outline-none focus:border-[#c9953a] transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#6a6a6a] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Professional Title</label>
                  <input 
                    type="text" 
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#f8f6f3] border border-[#e8e4df] p-3 rounded-xl text-[#2d2d2d] focus:outline-none focus:border-[#c9953a] transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#6a6a6a] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Biography</label>
                  <textarea 
                    value={editForm.bio}
                    rows={4}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-[#f8f6f3] border border-[#e8e4df] p-3 rounded-xl text-[#2d2d2d] focus:outline-none focus:border-[#c9953a] transition-all leading-relaxed font-medium"
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-[#f8f6f3] hover:bg-[#222] border border-[#e8e4df] text-[#6a6a6a] hover:text-[#1a1a1a] px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#c9953a] hover:bg-[#c9953a]/90 text-[#1a1a1a] px-5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-[#c9953a]/15 active:scale-95 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
