import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Edit3, Mail, MapPin, Plus, UserPlus, Eye,
  ChevronLeft, ChevronRight, Clock, Check, Save, X,
  Globe, Briefcase, Key, Shield, LogOut, ToggleLeft, ToggleRight,
  Camera, CheckCircle, AlertCircle, Wifi, Moon, MinusCircle,
  MessageSquare, Users, Activity, TrendingUp, Zap, Star,
  Hash, Calendar, ArrowUpRight, Link, ExternalLink, Bell,
} from "lucide-react";
import NexusImage from "./NexusImage";
import type { Project, Note, Activity as ProfileActivity } from "@/lib/types";
import { API_URL } from "@/lib/client-env";

const AVAILABLE_SKILLS = [
  "System Architecture", "Three.js / WebGL", "Go Microservices",
  "UI/UX Vision", "Product Strategy", "React / TypeScript",
  "Node.js", "Kubernetes", "GraphQL", "Rust", "Python",
  "Machine Learning", "DevOps", "PostgreSQL", "Redis"
];

function Sparkline({ data, color = "#00E5FF", height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 160;
  const len = Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => `${(i / len) * w},${height - (v / max) * (height - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#spark-fill)" points={`0,${height} ${pts} ${w},${height}`} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function CollaborationScore({ score }: { score: number }) {
  const r = 28; const cx = 36; const cy = 36; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E293B" strokeWidth="5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#00E5FF" strokeWidth="5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 5} textAnchor="middle" className="fill-[#F8FAFC] text-[10px] font-bold">{score}%</text>
    </svg>
  );
}

export default function ProfileView() {
  const { userId: paramUserId } = useParams();
  const currentUserId = localStorage.getItem("user_id") || "";
  const profileUserId = paramUserId || currentUserId;
  const isOwnProfile = profileUserId === currentUserId;
  const currentUserRole = localStorage.getItem("user_role") || "user";
  const isAdvanced = currentUserRole === "admin" || currentUserRole === "coordinator";
  const [profile, setProfile] = useState({
    id: currentUserId,
    name: "",
    title: "",
    location: "",
    bio: "",
    email: "",
    website: "",
    avatar: "",
    coverPic: "",
    experienceLevel: "Junior",
    role: currentUserRole,
    status: "online",
    availableForCollab: false,
    skills: [] as string[],
  });
  const [emailVerified] = useState(false);
  const [activeSessions] = useState(1);

  const networkStats = useMemo(() => ({
    connections: 0,
    messagesSent: 0,
    activeConversations: 0,
    activityLevel: "Low" as string,
  }), []);

  const [editForm, setEditForm] = useState({ ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState<"basic" | "contact" | "professional" | "availability" | "security">("basic");
  const [activeDay, setActiveDay] = useState(14);
  const [followedState, setFollowedState] = useState<{ [key: string]: boolean }>({});
  const [skillInput, setSkillInput] = useState("");
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [coverPicPreview, setCoverPicPreview] = useState<string | null>(null);

  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [viewNote, setViewNote] = useState<Note | null>(null);

  function api(path: string) {
    const token = localStorage.getItem("user_token");
    return fetch(`/api${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    const uid = localStorage.getItem("user_id");
    if (isOwnProfile) {
      api(`/users/${uid}`).then(r => r.ok ? r.json() : null).then(d => {
        if (d) {
          setProfile(prev => ({
            ...prev,
            id: d.id,
            name: d.name || prev.name,
            title: d.title || prev.title,
            location: d.location || prev.location,
            bio: d.bio || prev.bio,
            email: d.email || prev.email,
            website: d.website || prev.website,
            role: d.role || prev.role,
            status: d.status === "active" ? "online" : "offline",
            avatar: d.avatar || "",
            coverPic: d.coverPic || "",
          }));
        }
      });
      api("/projects").then(r => r.ok ? r.json() : []).then(d => { setProjects(d); setLoadingProjects(false); }).catch(() => setLoadingProjects(false));
      api("/notes").then(r => r.ok ? r.json() : []).then(d => { setNotes(d); setLoadingNotes(false); }).catch(() => setLoadingNotes(false));
    } else {
      api(`/users/${profileUserId}/projects`).then(r => r.ok ? r.json() : []).then(d => { setProjects(d); setLoadingProjects(false); }).catch(() => setLoadingProjects(false));
      api(`/users/${profileUserId}`).then(r => r.ok ? r.json() : null).then(d => {
        if (d) {
          setProfile(prev => ({
            ...prev,
            id: d.id,
            name: d.name || prev.name,
            title: d.title || prev.title,
            location: d.location || prev.location,
            bio: d.bio || prev.bio,
            email: d.email || prev.email,
            website: d.website || prev.website,
            role: d.role || prev.role,
            status: d.status === "active" ? "online" : "offline",
            avatar: d.avatar || "",
            coverPic: d.coverPic || "",
          }));
        }
        setLoadingNotes(false);
      }).catch(() => setLoadingNotes(false));
    }
  }, [profileUserId]);

  const openEditor = (section: typeof editSection) => {
    setEditForm({ ...profile });
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setPasswordError(""); setErrors({}); setProfilePicPreview(null); setCoverPicPreview(null);
    setEditSection(section); setIsEditing(true);
  };

  const closeEditor = () => { setIsEditing(false); setSuccessMsg(""); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!editForm.name.trim()) e.name = "Name is required";
    if (!editForm.title.trim()) e.title = "Title is required";
    if (editSection === "contact") {
      if (!editForm.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = "Invalid email format";
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const token = localStorage.getItem("user_token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(prev => ({ ...prev, ...updated }));
        setIsEditing(false);
        setSuccessMsg("Profile updated successfully!");
      } else {
        const err = await res.json();
        setErrors({ form: err.error || "Failed to update profile" });
      }
    } catch {
      setErrors({ form: "Network error" });
    }
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) { setPasswordError("All fields are required"); return; }
    if (passwordForm.newPass.length < 6) { setPasswordError("Password must be at least 6 characters"); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError("Passwords do not match"); return; }
    setPasswordError(""); setPasswordForm({ current: "", newPass: "", confirm: "" }); setIsEditing(false);
    setSuccessMsg("Password changed successfully!"); setTimeout(() => setSuccessMsg(""), 3000);
  };

  const addSkill = (s: string) => {
    if (!editForm.skills.includes(s)) setEditForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput(""); setShowSkillSuggestions(false);
  };
  const removeSkill = (s: string) => setEditForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
  const filteredSkillSuggestions = AVAILABLE_SKILLS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !editForm.skills.includes(s));
  const handleLogoutAll = () => { localStorage.removeItem("user_token"); localStorage.removeItem("user_role"); localStorage.removeItem("current_tab"); window.location.href = "/login"; };
  const handlePicUpload = (type: "profile" | "cover") => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { if (type === "profile") setProfilePicPreview(reader.result as string); else setCoverPicPreview(reader.result as string); };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("user_token");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.file?.url) {
        if (type === "profile") {
          setEditForm(p => ({ ...p, avatar: data.file.url }));
        } else {
          setEditForm(p => ({ ...p, coverPic: data.file.url }));
        }
      }
    } catch { /* preview already set */ }
  };
  const toggleFollow = (id: string) => setFollowedState(prev => ({ ...prev, [id]: !prev[id] }));

  const StatusIcon = profile.status === "online" ? Wifi : profile.status === "busy" ? MinusCircle : Moon;
  const statusColor = profile.status === "online" ? "text-green-400" : profile.status === "busy" ? "text-yellow-400" : "text-[#64748B]";
  const roleColor = profile.role === "admin" ? "text-[#00E5FF] border-[#00E5FF]/30 bg-[#00E5FF]/10" : profile.role === "coordinator" ? "text-purple-400 border-purple-500/30 bg-purple-500/10" : "text-blue-400 border-blue-500/30 bg-blue-500/10";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar h-full bg-[#0F172A] pb-12" id="nexus-profile-view">
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[100] bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
            <CheckCircle className="w-4 h-4" /> {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Banner & Profile Header ─── */}
      <div className="relative">
        <div className="h-56 md:h-72 w-full overflow-hidden relative group">
          <NexusImage src={coverPicPreview || profile.coverPic || ""} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
        </div>

        <div className="max-w-[1300px] mx-auto px-6 md:px-12 -mt-16 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-[#1E293B]">
            {/* Avatar with glow ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#00E5FF] blur-xl opacity-30 animate-pulse" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-[#00E5FF]/40 bg-[#1E293B] overflow-hidden shadow-2xl shadow-[#00E5FF]/10">
                <NexusImage src={profilePicPreview || profile.avatar || ""} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-1">
              <div className="flex items-center gap-2.5 justify-center md:justify-start flex-wrap">
                <h1 className="text-xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight leading-tight">{profile.name}</h1>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${roleColor}`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${statusColor}`}>
                  <StatusIcon className="w-3 h-3" />
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#00E5FF] font-semibold mt-1 leading-normal">{profile.title}</p>
              <div className="flex items-center justify-center md:justify-start gap-3 text-[#94A3B8] text-[11px] mt-1.5 font-medium flex-wrap">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#00E5FF] opacity-80" />{profile.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-[#00E5FF] opacity-80" />{profile.experienceLevel}</span>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#00E5FF] transition-colors">
                    <Link className="w-3 h-3 text-[#00E5FF] opacity-80" />Portfolio <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] mt-2 max-w-2xl leading-relaxed">{profile.bio}</p>
            </div>

            <div className="flex gap-2 shrink-0 pb-1">
              {isOwnProfile ? (
                <button onClick={() => openEditor("basic")}
                  className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#F8FAFC] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/15 active:scale-95 transition-all cursor-pointer">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#e0e0e0] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
                  <Mail className="w-3.5 h-3.5" /> Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Network Statistics — Admin / Coordinator only */}
          {isAdvanced && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-[#111827]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] shadow-md overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-[#1E293B] flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Network Stats</h3>
                <CollaborationScore score={0} />
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-[#1E293B]">
                    <p className="text-xl font-bold text-[#F8FAFC] tracking-tight">{networkStats.connections}</p>
                    <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider mt-0.5 font-bold flex items-center gap-1"><Users className="w-3 h-3" /> Connections</p>
                  </div>
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-[#1E293B]">
                    <p className="text-xl font-bold text-[#F8FAFC] tracking-tight">{networkStats.messagesSent.toLocaleString()}</p>
                    <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider mt-0.5 font-bold flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Messages</p>
                  </div>
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-[#1E293B]">
                    <p className="text-xl font-bold text-[#F8FAFC] tracking-tight">{networkStats.activeConversations}</p>
                    <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider mt-0.5 font-bold flex items-center gap-1"><Hash className="w-3 h-3" /> Active Chats</p>
                  </div>
                  <div className="bg-[#1E293B] rounded-xl p-3.5 border border-[#1E293B]">
                    <p className={`text-xl font-bold tracking-tight ${networkStats.activityLevel === "High" ? "text-green-400" : networkStats.activityLevel === "Medium" ? "text-yellow-400" : "text-[#64748B]"}`}>{networkStats.activityLevel}</p>
                    <p className="text-[9px] text-[#94A3B8] uppercase tracking-wider mt-0.5 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Activity</p>
                  </div>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-3 pt-5 border border-[#1E293B]">
                  <p className="text-[9px] text-[#475569] uppercase tracking-wider font-bold mb-2">14-Day Activity</p>
                  <Sparkline data={[]} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Skills & Expertise */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Skills & Expertise</h3>
              {isOwnProfile && <button onClick={() => openEditor("professional")} className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-wider hover:underline cursor-pointer">Manage</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={s}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wide transition-all ${
                    i === 0
                      ? "bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_8px_rgba(0,229,255,0.08)]"
                      : "bg-[#1E293B] text-[#94A3B8] border border-[#1E293B]"
                  }`}>
                  {i === 0 && <Star className="w-2.5 h-2.5 fill-[#00E5FF]" />}
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Availability & Collaboration */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] mb-4 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Availability</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
                <span className="text-[11px] text-[#94A3B8]">Status</span>
                <span className={`flex items-center gap-1.5 text-[11px] font-bold ${statusColor}`}><StatusIcon className="w-3.5 h-3.5" /> {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
                <span className="text-[11px] text-[#94A3B8]">Available for collab</span>
                <span className={`text-[11px] font-bold ${profile.availableForCollab ? "text-green-400" : "text-[#64748B]"}`}>{profile.availableForCollab ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
                <span className="text-[11px] text-[#94A3B8]">Email</span>
                <span className="text-[11px] text-[#F8FAFC] flex items-center gap-1.5">{profile.email} {emailVerified && <CheckCircle className="w-3 h-3 text-green-400" />}</span>
              </div>
            </div>
            {isOwnProfile && <button onClick={() => openEditor("availability")} className="w-full mt-3 h-8 bg-[#0F172A] border border-[#1E293B] rounded-xl text-[10px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer">
              Update Availability
            </button>}
          </motion.div>

          {/* Security Quick Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] mb-4 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Security</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
                <span className="text-[11px] text-[#94A3B8]">Sessions</span>
                <span className="text-[11px] text-[#F8FAFC]">{activeSessions} active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl">
                <span className="text-[11px] text-[#94A3B8]">2FA</span>
                <span className={`text-[11px] font-bold ${twoFactorEnabled ? "text-green-400" : "text-[#64748B]"}`}>{twoFactorEnabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
            {isOwnProfile && <button onClick={() => openEditor("security")} className="w-full mt-3 h-8 bg-[#0F172A] border border-[#1E293B] rounded-xl text-[10px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] transition-all cursor-pointer">
              Manage Security
            </button>}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Relationship Insights — Admin / Coordinator only */}
          {isAdvanced && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-[#111827]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] shadow-md">
              <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Relationship Insights</h3>
              </div>
              <div className="p-5 space-y-5">
                <p className="text-xs text-[#475569] text-center py-4">No relationship data yet. Start collaborating to build your network.</p>
              </div>
            </motion.div>
          )}

          {/* Portfolio */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Portfolio</h3>
            </div>
            {loadingProjects ? (
              <p className="text-xs text-[#475569] text-center py-8">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-xs text-[#475569] text-center py-8">{isOwnProfile ? "No projects yet" : "No published projects yet."}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {projects.slice(0, 3).map((proj, i) => (
                  <div key={proj.id} onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
                    className="h-36 rounded-xl overflow-hidden group relative border border-[#1E293B] cursor-pointer hover:shadow-lg hover:shadow-[#00E5FF]/10 transition-all duration-300">
                    <NexusImage src={proj.image || ""} alt={proj.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    <div className="absolute inset-0 bg-[#00E5FF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="text-[#F8FAFC] w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Projects */}
          {loadingProjects ? (
            <p className="text-xs text-[#475569] text-center py-8">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-xs text-[#475569] text-center py-8">{isOwnProfile ? "No projects yet" : "No published projects yet."}</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map(proj => (
              <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
                className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md relative overflow-hidden group hover:border-[#00E5FF]/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00E5FF]/5 transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><span className="text-[#00E5FF] text-6xl">&#9881;</span></div>
                {isOwnProfile && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block ${proj.status === "published" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-[#1E293B] border border-[#1E293B] text-[#94A3B8]"}`}>
                    {proj.status === "published" ? "Published" : "Draft"}
                  </span>
                )}
                <h4 className="text-sm font-bold text-[#F8FAFC] mb-1 leading-snug">{proj.name}</h4>
                <p className="text-[#94A3B8] text-[11px] mb-4 leading-relaxed line-clamp-2">{proj.description}</p>
                <div className="flex items-center gap-2">
                  {proj.link ? (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#00E5FF]/20 transition-all">
                      <ExternalLink className="w-3 h-3" /> Visit Project
                    </a>
                  ) : (
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#1E293B]" />
                      <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#1E293B]" />
                      <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#1E293B]" />
                    </div>
                  )}
                  {proj.performanceScore ? <span className="text-[10px] text-[#00E5FF] font-bold">{proj.performanceScore}</span> : proj.contributorsCount > 0 && <span className="text-[10px] text-[#94A3B8] font-medium">+{proj.contributorsCount} Contributors</span>}
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {/* Notes & Activity */}
          <div className={`grid grid-cols-1 ${isAdvanced ? "md:grid-cols-2" : ""} gap-5`}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Recent Notes</h3>
              </div>
              {loadingNotes ? (
                <p className="text-xs text-[#475569] text-center py-6">Loading notes...</p>
              ) : notes.length === 0 ? (
                <p className="text-xs text-[#475569] text-center py-6">No notes yet.</p>
              ) : (
              <ul className="space-y-2">
                {notes.slice(0, 5).map(note => (
                  <li key={note.id} onClick={() => setViewNote(note)}
                    className="p-3 bg-[#1E293B] rounded-xl border border-[#1E293B] hover:border-[#00E5FF]/30 hover:bg-[#1E293B]/80 transition-all cursor-pointer">
                    <p className="text-xs font-bold text-[#F8FAFC] mb-0.5">{note.title}</p>
                    <p className="text-[9px] text-[#94A3B8]">{new Date(note.updatedAt).toLocaleDateString()} &bull; {note.status}</p>
                  </li>
                ))}
              </ul>
              )}
            </motion.div>

            {isAdvanced ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">Recent Activity</h3>
                <p className="text-xs text-[#475569] text-center py-8 mt-2">No recent activity.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" /> Notifications</h3>
                <p className="text-xs text-[#475569] text-center py-8 mt-2">No notifications yet.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ─── EDIT MODAL ─── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl relative">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#00E5FF]">
                  {editSection === "basic" && "Basic Info"}
                  {editSection === "contact" && "Contact Info"}
                  {editSection === "professional" && "Professional Info"}
                  {editSection === "availability" && "Availability"}
                  {editSection === "security" && "Security"}
                </h2>
                <button onClick={closeEditor} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-all cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-1 px-6 pt-4 pb-2 border-b border-[#1E293B] shrink-0 overflow-x-auto">
                {(["basic", "contact", "professional", "availability", "security"] as const).map(s => (
                  <button key={s} onClick={() => { setEditSection(s); setErrors({}); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${editSection === s ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20" : "text-[#64748B] hover:text-[#94A3B8]"}`}>
                    {s === "basic" ? "Basic" : s === "contact" ? "Contact" : s === "professional" ? "Professional" : s === "availability" ? "Availability" : "Security"}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {editSection === "basic" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[#94A3B8] mb-2 font-bold uppercase tracking-wider text-[9px]">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1E293B] border border-[#1E293B] relative group">
                          <NexusImage src={profilePicPreview || profile.avatar || ""} alt="" className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-5 h-5 text-[#F8FAFC]" />
                            <input type="file" accept="image/*" onChange={handlePicUpload("profile")} className="hidden" />
                          </label>
                        </div>
                        <label className="px-4 h-9 bg-[#1E293B] border border-[#1E293B] rounded-xl text-[10px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2 cursor-pointer transition-all">
                          <Camera className="w-3.5 h-3.5" /> Upload Photo
                          <input type="file" accept="image/*" onChange={handlePicUpload("profile")} className="hidden" />
                        </label>
                        {profilePicPreview && <button type="button" onClick={() => setProfilePicPreview(null)} className="text-[10px] text-red-400 hover:underline cursor-pointer">Remove</button>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-2 font-bold uppercase tracking-wider text-[9px]">Cover Image (optional)</label>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-16 rounded-xl overflow-hidden bg-[#1E293B] border border-[#1E293B]">
                          <NexusImage src={coverPicPreview || profile.coverPic || ""} alt="" className="w-full h-full object-cover" />
                        </div>
                        <label className="px-4 h-9 bg-[#1E293B] border border-[#1E293B] rounded-xl text-[10px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-2 cursor-pointer transition-all">
                          <Camera className="w-3.5 h-3.5" /> Upload Cover
                          <input type="file" accept="image/*" onChange={handlePicUpload("cover")} className="hidden" />
                        </label>
                        {coverPicPreview && <button type="button" onClick={() => setCoverPicPreview(null)} className="text-[10px] text-red-400 hover:underline cursor-pointer">Remove</button>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Full Name *</label>
                      <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                        className={`w-full bg-[#0F172A] border ${errors.name ? "border-red-500/50" : "border-[#1E293B]"} p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all`} />
                      {errors.name && <p className="text-[9px] text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Professional Title *</label>
                      <input type="text" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                        className={`w-full bg-[#0F172A] border ${errors.title ? "border-red-500/50" : "border-[#1E293B]"} p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all`} />
                      {errors.title && <p className="text-[9px] text-red-400 mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Biography</label>
                      <textarea value={editForm.bio} rows={4} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))}
                        className="w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all leading-relaxed resize-none" />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={closeEditor} className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#F8FAFC] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/15 active:scale-95 transition-all cursor-pointer">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
                {editSection === "contact" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Email</label>
                      <div className="flex items-center gap-2">
                        <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                          className={`flex-1 bg-[#0F172A] border ${errors.email ? "border-red-500/50" : "border-[#1E293B]"} p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all`} />
                        <span className={`text-[9px] font-bold flex items-center gap-1 ${emailVerified ? "text-green-400" : "text-yellow-400"}`}>
                          {emailVerified ? <><CheckCircle className="w-3 h-3" /> Verified</> : <><AlertCircle className="w-3 h-3" /> Unverified</>}
                        </span>
                      </div>
                      {errors.email && <p className="text-[9px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Location</label>
                      <input type="text" value={editForm.location} onChange={e => setEditForm(p => ({ ...p, location: e.target.value }))}
                        className="w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all" />
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Website / Portfolio</label>
                      <input type="url" value={editForm.website} onChange={e => setEditForm(p => ({ ...p, website: e.target.value }))} placeholder="https://"
                        className="w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all" />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={closeEditor} className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#F8FAFC] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/15 active:scale-95 transition-all cursor-pointer">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
                {editSection === "professional" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[#94A3B8] mb-2 font-bold uppercase tracking-wider text-[9px]">Skills</label>
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                        {editForm.skills.map(s => (
                          <span key={s} className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                            {s} <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors cursor-pointer"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                        {editForm.skills.length === 0 && <span className="text-[10px] text-[#475569]">No skills added yet</span>}
                      </div>
                      <div className="relative">
                        <input type="text" value={skillInput} onChange={e => { setSkillInput(e.target.value); setShowSkillSuggestions(true); }}
                          onFocus={() => setShowSkillSuggestions(true)} onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                          placeholder="Type to add a skill..."
                          className="w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#00E5FF] transition-all" />
                        {showSkillSuggestions && filteredSkillSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[#111827] border border-[#1E293B] rounded-xl shadow-2xl z-10 max-h-40 overflow-y-auto custom-scrollbar">
                            {filteredSkillSuggestions.slice(0, 8).map(s => (
                              <button type="button" key={s} onClick={() => addSkill(s)}
                                className="w-full text-left px-3 py-2 text-xs text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-all cursor-pointer">{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Experience Level</label>
                      <select value={editForm.experienceLevel} onChange={e => setEditForm(p => ({ ...p, experienceLevel: e.target.value }))}
                        className="appearance-none w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all cursor-pointer"
                        style={{ WebkitAppearance: "none", MozAppearance: "none" }}>
                        {["Junior", "Mid-Level", "Senior", "Lead", "Principal"].map(level => (
                          <option key={level} value={level} className="bg-[#0F172A] text-[#F8FAFC]">{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Role</label>
                      <div className="w-full bg-[#0F172A] border border-[#1E293B] p-3 rounded-xl text-xs text-[#64748B] flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-[#00E5FF]" /> {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} (read-only)
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={closeEditor} className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#F8FAFC] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/15 active:scale-95 transition-all cursor-pointer">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
                {editSection === "availability" && (
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    <div>
                      <label className="block text-[#94A3B8] mb-2 font-bold uppercase tracking-wider text-[9px]">Status</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(["online", "busy", "offline"] as const).map(s => {
                          const Icon = s === "online" ? Wifi : s === "busy" ? MinusCircle : Moon;
                          const color = s === "online" ? "text-green-400 border-green-500/20 bg-green-500/10" : s === "busy" ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/10" : "text-[#64748B] border-[#1E293B] bg-[#1E293B]";
                          return (
                            <button type="button" key={s} onClick={() => setEditForm(p => ({ ...p, status: s }))}
                              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${editForm.status === s ? `${color} ring-1 ring-inset` : "text-[#475569] border-[#1E293B] hover:bg-[#1E293B]"}`}>
                              <Icon className="w-4 h-4" /> {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#94A3B8] mb-2 font-bold uppercase tracking-wider text-[9px]">Available for collaboration</label>
                      <button type="button" onClick={() => setEditForm(p => ({ ...p, availableForCollab: !p.availableForCollab }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer w-fit ${editForm.availableForCollab ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-[#1E293B] border-[#1E293B] text-[#64748B]"}`}>
                        {editForm.availableForCollab ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        <span className="text-xs font-bold">{editForm.availableForCollab ? "Yes, open to collaboration" : "Not available"}</span>
                      </button>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                      <button type="button" onClick={closeEditor} className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                      <button type="submit" className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#F8FAFC] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#00E5FF]/15 active:scale-95 transition-all cursor-pointer">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}
                {editSection === "security" && (
                  <div className="space-y-6">
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
                      <h4 className="text-xs font-bold text-[#F8FAFC] mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-[#00E5FF]" /> Change Password</h4>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Current Password</label>
                          <input type="password" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
                            className="w-full bg-[#111827] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all" />
                        </div>
                        <div>
                          <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">New Password</label>
                          <input type="password" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))}
                            className="w-full bg-[#111827] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all" />
                        </div>
                        <div>
                          <label className="block text-[#94A3B8] mb-1.5 font-bold uppercase tracking-wider text-[9px]">Confirm New Password</label>
                          <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                            className="w-full bg-[#111827] border border-[#1E293B] p-3 rounded-xl text-xs text-[#F8FAFC] focus:outline-none focus:border-[#00E5FF] transition-all" />
                        </div>
                        {passwordError && <p className="text-[10px] text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {passwordError}</p>}
                        <button type="submit" className="bg-[#1E293B] hover:bg-[#222] border border-[#1E293B] text-[#F8FAFC] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                          <Key className="w-3.5 h-3.5 inline mr-1.5" /> Update Password
                        </button>
                      </form>
                    </div>
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2"><Shield className="w-4 h-4 text-[#00E5FF]" /> Two-Factor Authentication</h4>
                          <p className="text-[10px] text-[#64748B] mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button type="button" onClick={() => setTwoFactorEnabled(p => !p)}
                          className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${twoFactorEnabled ? "bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.4)]" : "bg-[#1E293B]"}`}>
                          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${twoFactorEnabled ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2"><LogOut className="w-4 h-4 text-red-400" /> Active Sessions</h4>
                          <p className="text-[10px] text-[#64748B] mt-1">Sign out from all devices and browsers</p>
                        </div>
                        <button type="button" onClick={handleLogoutAll}
                          className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-red-500/20 transition-all cursor-pointer">Logout All</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Note View Modal ─── */}
      <AnimatePresence>
        {viewNote && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-xl w-full max-h-[75vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-sm font-bold text-[#F8FAFC] truncate">{viewNote.title}</h2>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${
                    viewNote.status === "Published" ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : viewNote.status === "Shared" ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }`}>{viewNote.status}</span>
                </div>
                <button onClick={() => setViewNote(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-all cursor-pointer shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {viewNote.content ? (
                  <div className="text-xs text-[#cbd5e1] leading-relaxed whitespace-pre-wrap">{viewNote.content}</div>
                ) : (
                  <p className="text-xs text-[#475569] text-center py-8">No content</p>
                )}
                <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center gap-2 text-[10px] text-[#475569]">
                  <Clock className="w-3 h-3" /> Updated {new Date(viewNote.updatedAt).toLocaleString()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
