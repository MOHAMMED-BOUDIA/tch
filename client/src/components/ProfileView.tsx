import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import type { Project, Note, Activity as ProfileActivity } from "../types";

const COVER_BANNER = "https://lh3.googleusercontent.com/aida-public/AB6AXuAgmCtKeo7BXCQqpo6mZKPeaOk3MsPnNqULQKi36hjXl_TjCdfCmkJDdXoQzWSTGTGIykGd_WVWCLyI9-UzQ_NcJDyguxlaQdyoCQ99yfHxAHR9nuUlUXob1vVsFCCONNIwegi5murEW8YkH1R6JmcfAwlRA89tfdD0HBKS5DiKVY1v2mBGS09pJQNqL91vvJjg5Z_kOnDtUrD4p2ojeLNAMNFIP8_GBn24nOqqrjDCN2-62kdo1b64cKnH619km8FUUbkScwD9WCzK";
const PROFILE_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuB2V_sxDq3DOHSTQP8fIFkMRLjcO10-lJkRUH-Ov7JssRfq80eaUo7029AEuTVpTmOYZwvSeT5uduWa3hGS0fAIINQBkiPBPOvcpNlscGXJGNfKExupdoiXioYsDlzJuYCmVz1KB2K0-jWFL-1ZuLYwhMRWivAAmOPHzgqUK6Rr88wZnBX-Md2GaNNFV-u3GfFlgJEjp1RM5o86qR4EWjUabLgEfASkVIQKQBktEachzyMjVnda9kNeTijR2E5H0SfvwCEOoRKW2_06";
const SARAH_CHEN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGh8_IZ7zOk6A22VBMzUKVrpkdmFTpCkpwdnq7OSAKsAFBC6uVvquMrckC_rl6AUmg3zxvHNCI8qRBbuT7Nl6zhqOSvqzeBeOyOcddZdb9dj7KC4a8PBDeVo-Wbhool7K0FzKx4rq2Nl96rGDrxxNzD6eS5cNoMbKVBhi4QXX2wI1_KnBBYVWkSXLeSVCQ7IhRutEf4MyZYw2C5PMAOBsLCNNsG34f3Xxy27GYv_4RU4611U3ZNUwBPpT2uuuU-5BLCdpp2GVrICm-";
const MARCUS_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCehcfhNjJ_tUDQsSiuzAxAvzkmgsSHPEm2jPor6CSDl1essQWi65M9yCbnYzl4wXHhJ768QTmwMThPF5V_NXX4sPRyo3fLUtBtxiCf4LHmyfxG72U2CFMnOA0tfECuCyeBt-nL3DZo3-GNU10cs1gMulGyQi4EmdHMglebsh_xOf8_gNv9KOd8LSshWWMgEjIVw2HRl3-T9Q84e1je2a3FuHbj6JNNjeiU26D1wcVA4prJpmmm8HtflPSH9th2jkqZICcM7fhyR9Hs";
const PORTFOLIO_1 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwYEhBqOqBZl3w3INsiZttRD-Etpd0WX5_B-aThv8gnqtrlyiMrvpKyQaz1ez45HnKBcm_879BmQGo64vagR1vwJ-qBL8eAj54RXdce9T1fWlkuV2TADi5iucECiy6K-W2wRsiWudVCZPhnsKje97wp8o_1cSD7vflOh5cFxvESv96rTn4T_bwnXCGmkmOKcnqDh5Nima-8FiFnIQ4CjJ4QiU46d97agHLP1IE9VJrhNyokT54-rX7ypvVkkFLAt5UrwoH8PUJg24M";
const PORTFOLIO_2 = "https://lh3.googleusercontent.com/aida-public/AB6AXuB5_bh5j2uJZ7aGGr-W_iVbWJ4_8iIO3OrmysAwgcHIGY1qgnLGf8qrc7y4WtIsyrf5rCEZLo02EeTFywRLrNMbtygEly2L0lXzYDlo7bipAVEYDdSRJOZN-21oyZwowXEJKaDHmUYeqbElxcrbWkq3TCghzjd1Pi9WVo-MfK6KoVhPgVEd5Qsj5bELnlx-hcC8CWAwl0peN8ehjnqV0hpLhCctPu0qmHOXCjk75z9zsilNH1kCIFHKdYaFZEob4YXsnNd3vn27xsJx";
const PORTFOLIO_3 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFoGSMJQS3Wd2VRK2EicCAgZ20ql14FDlCzgcF31NfgfDJH7UYLsxTP7ffCshLXIulMhzWrqCn_tNguwGtzSH8dZSY6DpJbMFnGNI9lSY-vsmPz4wtL0hODZu8jLHQ90hbTYj9m5hCAUpUXa4UcX8whEg5rv8puQvbph8xT3Plm0p8uUfdH4MlI6C9Ev0aJ8vVeDZ6WxkX9xsJN9tq_MfVir6qcHEV0Bn_XB32Zctax2qBOeJLABcfXxMjVOcyiQbHI1SkFp2bniwQ";
const PORTFOLIO_4 = "https://lh3.googleusercontent.com/aida-public/AB6AXuCnkKfh1vCB59qBNpCyBwf1OaFFRwlHWMLIhDxSIPR6gMNN8bP7JQGu6lhA1NGB6TlgSRvmCh8HGJliq4-2L4KBjQ0x5SDSIIHq9UE4x2G1_7-VmEYG5kI9g--MyQzE_JG49irPC7t5RBNkKdoY1MsN1cNL0JWNNOJWMBETpLQGOcHfBqasHRT0wn_34iGbkTX4RQH0P7vSTKB0vF9Z9uO5fYLjClyZPCwB62SMEqQfSQaEWEfsW1tYxQfHfQ4kIH2S1ncNPMsX7mtI";
const PORTFOLIO_5 = "https://lh3.googleusercontent.com/aida-public/AB6AXuDibqGF6Ofm7ms2-ntHI9H8bP-4JkSIFryXaRbmB8k6Am0mhPBftFNAgYRfFnz8RnRvl2v6KqKBvJQqGrhdJ6XKD8MW0v_5vRC5yAIUGJ5fNT1YjCDqWDFC8YymOZXIYTFdQ-TFr6IR65vLNBsNvFrmYJq0MhfHU7LAEcTKyMpv-V5aTb1FqspSUYw7l4mHkQZ_h8UQGX-UfV07HGQQqW0p5aNj1r1O4yYJnxUlApeBqAVJL55xSIEoX5EYxbKihSNqy_nmd06G4Aq2";

const initialProjects: Project[] = [
  { id: "p1", name: "Project Aether", status: "Active Now", description: "Next-gen real-time synchronization engine for distributed workspace collaboration.", contributorsCount: 12 },
  { id: "p2", name: "Vortex Core", status: "Archived", description: "High-frequency data streaming middleware achieving < 2ms latency on global edge nodes.", contributorsCount: 8, performanceScore: "99% Performance Score" }
];

const initialNotes: Note[] = [
  { id: "n1", title: "Review of WebGPU specs", updatedAt: "Updated 2 hours ago", status: "Draft" },
  { id: "n2", title: "Scalability Bottleneck Analysis", updatedAt: "Updated Yesterday", status: "Shared with Engineering" }
];

const initialActivities: ProfileActivity[] = [
  { id: "a1", type: "push", text: "Pushed 4 commits to Aether-Core/main", time: "12 minutes ago", color: "bg-blue-500" },
  { id: "a2", type: "endorse", text: "Endorsed Sarah Chen for System Design", time: "4 hours ago", color: "bg-green-500" },
  { id: "a3", type: "publish", text: "Published article 'The Future of Edge Computing'", time: "2 days ago", color: "bg-[#00E5FF]" }
];

const AVAILABLE_SKILLS = [
  "System Architecture", "Three.js / WebGL", "Go Microservices",
  "UI/UX Vision", "Product Strategy", "React / TypeScript",
  "Node.js", "Kubernetes", "GraphQL", "Rust", "Python",
  "Machine Learning", "DevOps", "PostgreSQL", "Redis"
];

const TOP_CONNECTIONS = [
  { name: "Sarah Chen", role: "Lead Frontend Designer", avatar: SARAH_CHEN_AVATAR, interaction: 47 },
  { name: "Marcus Thorne", role: "Cloud Infrastructure Lead", avatar: MARCUS_AVATAR, interaction: 34 },
  { name: "Elena Rodriguez", role: "Product Manager", avatar: PORTFOLIO_5, interaction: 28 },
];

const RECENT_INTERACTIONS = [
  { user: "Sarah Chen", action: "commented on Project Aether design review", time: "12m ago", type: "comment" },
  { user: "Marcus Thorne", action: "shared a deployment report in Engineering", time: "1h ago", type: "share" },
  { user: "Elena Rodriguez", action: "assigned you to Sprint Review task", time: "3h ago", type: "task" },
  { user: "Jordan Smith", action: "approved your merge request in Vortex-Core", time: "5h ago", type: "approve" },
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
    name: "Alex Rivera",
    title: "Principal Systems Architect & Creative Technologist",
    location: "Palo Alto, California",
    bio: "Crafting high-performance digital ecosystems at the intersection of architecture and human experience. 10+ years of experience scaling distributed systems and leading multidisciplinary design teams at Nexus. Passionate about WebGL, generative AI, and sustainable infrastructure.",
    email: "alex@nexus.local",
    website: "https://alexrivera.dev",
    experienceLevel: "Senior",
    role: "coordinator",
    status: "online",
    availableForCollab: true,
    skills: ["System Architecture", "Three.js / WebGL", "Go Microservices", "UI/UX Vision", "Product Strategy"],
  });
  const [emailVerified] = useState(true);
  const [activityData] = useState([12, 18, 8, 22, 14, 28, 20, 32, 24, 40, 36, 44, 38, 48]);
  const [collabScore] = useState(87);
  const [activeSessions] = useState(2);

  const networkStats = useMemo(() => ({
    connections: 128,
    messagesSent: 1452,
    activeConversations: 8,
    activityLevel: activityData.reduce((a, b) => a + b, 0) > 200 ? "High" : activityData.reduce((a, b) => a + b, 0) > 100 ? "Medium" : "Low" as string,
  }), [activityData]);

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

  const navigate = useNavigate();
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
    if (isOwnProfile) {
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setProfile({ ...editForm }); setIsEditing(false);
    setSuccessMsg("Profile updated successfully!");
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
  const handlePicUpload = (type: "profile" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => { if (type === "profile") setProfilePicPreview(reader.result as string); else setCoverPicPreview(reader.result as string); }; reader.readAsDataURL(file); }
  };
  const toggleFollow = (id: string) => setFollowedState(prev => ({ ...prev, [id]: !prev[id] }));

  const statusIcon = profile.status === "online" ? Wifi : profile.status === "busy" ? MinusCircle : Moon;
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
          <NexusImage src={coverPicPreview || COVER_BANNER} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
        </div>

        <div className="max-w-[1300px] mx-auto px-6 md:px-12 -mt-16 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-[#1E293B]">
            {/* Avatar with glow ring */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#00E5FF] blur-xl opacity-30 animate-pulse" />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-[#00E5FF]/40 bg-[#1E293B] overflow-hidden shadow-2xl shadow-[#00E5FF]/10">
                <NexusImage src={profilePicPreview || PROFILE_AVATAR} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-1">
              <div className="flex items-center gap-2.5 justify-center md:justify-start flex-wrap">
                <h1 className="text-xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight leading-tight">{profile.name}</h1>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border ${roleColor}`}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-bold ${statusColor}`}>
                  <statusIcon className="w-3 h-3" />
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
                <CollaborationScore score={collabScore} />
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
                  <Sparkline data={activityData} />
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
                <span className={`flex items-center gap-1.5 text-[11px] font-bold ${statusColor}`}><statusIcon className="w-3.5 h-3.5" /> {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}</span>
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
                <span className="text-[9px] text-[#475569]">Last active 12m ago</span>
              </div>
              <div className="p-5 space-y-5">
                {/* Top 3 Connections */}
                <div>
                  <p className="text-[9px] text-[#475569] uppercase tracking-wider font-bold mb-3">Most Interacted</p>
                  <div className="flex items-center gap-4">
                    {TOP_CONNECTIONS.map((c, i) => (
                      <div key={c.name} className="flex items-center gap-3 bg-[#0F172A] rounded-xl pl-2 pr-3 py-2 border border-[#1E293B] flex-1 min-w-0">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1E293B] border border-[#1E293B]">
                            <NexusImage src={c.avatar} alt={c.name} />
                          </div>
                          <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${i === 0 ? "bg-[#00E5FF] text-[#0F172A]" : i === 1 ? "bg-purple-500 text-white" : "bg-[#64748B] text-white"}`}>
                            {i + 1}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#F8FAFC] truncate">{c.name}</p>
                          <p className="text-[9px] text-[#64748B]">{c.interaction} interactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Most Active Group */}
                <div className="bg-[#0F172A] rounded-xl p-3.5 border border-[#1E293B]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
                        <Hash className="w-4 h-4 text-[#00E5FF]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#F8FAFC]">Most Active Group</p>
                        <p className="text-[10px] text-[#64748B]">Engineering · 204 messages this week</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-green-400 font-bold flex items-center gap-1"><Wifi className="w-3 h-3" /> Active now</span>
                  </div>
                </div>

                {/* Recent Interactions */}
                <div>
                  <p className="text-[9px] text-[#475569] uppercase tracking-wider font-bold mb-3">Recent Interactions</p>
                  <div className="space-y-1">
                    {RECENT_INTERACTIONS.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#0F172A]/50 transition-colors">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1E293B] border border-[#1E293B] shrink-0 mt-0.5">
                          <NexusImage src={[SARAH_CHEN_AVATAR, MARCUS_AVATAR, PORTFOLIO_5, PORTFOLIO_4][i]} alt={item.user} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#cbd5e1]">
                            <span className="font-bold text-[#F8FAFC]">{item.user}</span> {item.action}
                          </p>
                          <p className="text-[9px] text-[#475569] mt-0.5">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <div key={proj.id} onClick={() => navigate(`/projects/${proj.id}`)}
                    className="h-36 rounded-xl overflow-hidden group relative border border-[#1E293B] cursor-pointer hover:shadow-lg hover:shadow-[#00E5FF]/10 transition-all duration-300">
                    <NexusImage src={proj.image || [PORTFOLIO_1, PORTFOLIO_2, PORTFOLIO_3][i] || PORTFOLIO_1} alt={proj.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
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
                onClick={() => navigate(`/projects/${proj.id}`)}
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
                <div className="border-l-2 border-[#1E293B] ml-1.5 pl-4 space-y-4 relative mt-4">
                  {initialActivities.map(act => (
                    <div key={act.id} className="relative">
                      <div className={`absolute -left-[22px] top-1 w-2 h-2 rounded-full ${act.color} ring-4 ring-[#0f0f0f]`} />
                      <p className="text-[11px] text-[#cbd5e1] font-medium leading-normal">{act.text}</p>
                      <p className="text-[9px] text-[#94A3B8] mt-0.5 font-medium">{act.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5"><Bell className="w-3.5 h-3.5" /> Notifications</h3>
                <div className="mt-4 space-y-2">
                  {[
                    { title: "Welcome to Nexus!", desc: "Your account has been created successfully.", time: "1d ago" },
                    { title: "Profile updated", desc: "Your profile information was updated.", time: "3d ago" },
                    { title: "New feature available", desc: "Check out the new private messaging system.", time: "5d ago" },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#1E293B] border border-[#1E293B]">
                      <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
                        <Bell className="w-3.5 h-3.5 text-[#00E5FF]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#F8FAFC]">{n.title}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{n.desc}</p>
                        <p className="text-[9px] text-[#475569] mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                          <NexusImage src={profilePicPreview || PROFILE_AVATAR} alt="" className="w-full h-full object-cover" />
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
                          <NexusImage src={coverPicPreview || COVER_BANNER} alt="" className="w-full h-full object-cover" />
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
