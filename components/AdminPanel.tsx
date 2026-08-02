import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Users, Shield, MessageSquare, Activity, Search, X, ChevronDown,
  Sliders, LogOut, UserPlus, UserMinus, Trash2, Eye, Edit3,
  BarChart, Clock, Globe, Server, ToggleLeft, ToggleRight,
  Mail, AlertTriangle, CheckCircle, Circle, Bot, Filter, TrendingUp,
} from "lucide-react";
import SearchInput from "./ui/SearchInput";

const API = "/api/admin";

function api(path: string, options?: RequestInit) {
  const token = localStorage.getItem("user_token");
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

interface Stats {
  totalUsers: number; totalAdmins: number; totalCoordinators: number;
  totalRegularUsers: number; totalBots: number;
  messagesToday: number; messagesThisWeek: number; totalMessages: number;
  totalGroups: number; activeChatGroups: number; suspendedUsers: number;
  userGrowth: { _id: string; count: number }[];
  activityTrend: { _id: string; count: number }[];
}

interface AdminUser {
  id: string; username: string; email: string; name?: string;
  role: string; status: string; lastLogin?: string; createdAt: string;
}

interface AdminGroup {
  id: string; name: string; memberCount: number;
  messageCount: number; createdAt: string;
}

interface AdminLog {
  id: string; type: string; action: string; details?: string;
  ip?: string; user: { id: string; name: string; username: string; email: string } | null;
  createdAt: string;
}

interface ChatMessage {
  id: string; content: string;
  sender: { id: string; name: string; username: string; email: string } | null;
  createdAt: string; edited: boolean; deleted: boolean;
}

function MiniChart({ data, color }: { data: { _id: string; count: number }[]; color: string }) {
  if (!data.length) return <div className="h-12 flex items-center justify-center fine-print text-ink-muted-48">No data</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  const w = 200; const h = 48;
  const len = Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => `${(i / len) * w},${h - (d.count / max) * (h - 4) - 2}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      {data.map((d, i) => (
        <circle key={i} cx={(i / len) * w} cy={h - (d.count / max) * (h - 4) - 2} r="2" fill={color} opacity="0.6" />
      ))}
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: any; color: string; sub?: string }) {
  return (
    <div className="bg-canvas-parchment border border-hairline rounded-sm p-5 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-xs flex items-center justify-center" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="display-md text-ink">{value}</p>
      {sub && <p className="fine-print text-ink-muted-48 mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === "active" ? "bg-green-500/10 text-green-600 border-green-500/20"
    : status === "suspended" ? "bg-red-500/10 text-red-500 border-red-500/20"
    : status === "admin" ? "bg-primary/10 text-primary border-primary/20"
    : status === "coordinator" ? "bg-purple-500/10 text-purple-600 border-purple-500/20"
    : status === "user" ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
    : "bg-canvas-parchment text-ink-muted-48 border-hairline";
  return (
    <span className={`fine-print font-bold px-2 py-0.5 rounded-xs border ${color}`}>
      {status}
    </span>
  );
}

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-canvas-parchment border border-hairline rounded-xs caption text-ink px-2 py-1 outline-none focus:border-primary cursor-pointer transition-all"
    >
      <option value="user">User</option>
      <option value="coordinator">Coordinator</option>
      <option value="admin">Admin</option>
    </select>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-canvas border border-hairline rounded-sm product-shadow w-full max-w-2xl max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
            <h2 className="body-strong text-ink">{title}</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-ink transition-all cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </motion.div>
      </div>
    </>
  );
}

function ConfirmDialog({ open, onClose, onConfirm, title, message }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-canvas border border-hairline rounded-sm product-shadow w-full max-w-sm p-6">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="body-strong text-ink text-center mb-2">{title}</h3>
          <p className="caption text-ink-muted-48 text-center mb-5">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 h-9 bg-canvas-parchment text-ink caption-strong rounded-xs border border-hairline transition-all cursor-pointer">Cancel</button>
            <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 h-9 bg-red-500/10 text-red-500 caption-strong rounded-xs border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer">Confirm</button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<"overview" | "users" | "groups" | "settings" | "logs">("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "users", label: "Users", icon: Users },
    { id: "groups", label: "Groups", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Sliders },
    { id: "logs", label: "Logs", icon: Clock },
  ] as const;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-hairline">
        <div>
          <h1 className="display-md text-ink flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" />
            Admin Panel
          </h1>
          <p className="caption text-ink-muted-48 mt-1">System administration and platform management</p>
        </div>
      </div>

      <div className="flex gap-1 bg-canvas-parchment p-1 rounded-xs border border-hairline w-fit">
        {tabs.map(t => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xs caption-strong transition-all duration-200 cursor-pointer ${active ? "text-white" : "text-ink-muted-48 hover:text-ink"}`}>
              {active && <motion.div layoutId="admin-tab-bg" className="absolute inset-0 bg-primary rounded-xs" />}
              <span className="relative z-10 flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "users" && <UsersTab />}
      {tab === "groups" && <GroupsTab />}
      {tab === "settings" && <SettingsTab />}
      {tab === "logs" && <LogsTab />}
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api("/stats");
      if (res.ok) setStats(await res.json());
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <div className="caption text-ink-muted-48 py-8 text-center">Loading stats...</div>;
  if (!stats) return <div className="caption text-red-500 py-8 text-center">Failed to load stats</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#0066cc" sub={`${stats.totalCoordinators} coordinators · ${stats.totalAdmins} admins`} />
        <StatCard label="Messages Today" value={stats.messagesToday} icon={MessageSquare} color="#22C55E" sub={`${stats.messagesThisWeek} this week`} />
        <StatCard label="Active Chat Groups" value={stats.activeChatGroups} icon={Activity} color="#A855F7" sub={`${stats.totalGroups} total groups`} />
        <StatCard label="System Status" value={stats.suspendedUsers > 0 ? "Warning" : "Optimal"} icon={Shield} color={stats.suspendedUsers > 0 ? "#F59E0B" : "#22C55E"} sub={`${stats.suspendedUsers} suspended users`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-canvas-parchment border border-hairline rounded-sm p-5">
          <h3 className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary" /> User Growth (30 days)
          </h3>
          <MiniChart data={stats.userGrowth} color="#0066cc" />
        </div>
        <div className="bg-canvas-parchment border border-hairline rounded-sm p-5">
          <h3 className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-green-500" /> Message Activity (this week)
          </h3>
          <MiniChart data={stats.activityTrend} color="#22C55E" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Messages" value={stats.totalMessages.toLocaleString()} icon={Mail} color="#3B82F6" />
        <StatCard label="Total Groups" value={stats.totalGroups} icon={Globe} color="#F59E0B" />
        <StatCard label="Active Regular Users" value={stats.totalRegularUsers} icon={UserPlus} color="#A855F7" />
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "user", status: "active", sendWelcome: false });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState("");

  const fetchUsers = useCallback(async () => {
    try { setLoading(true); const res = await api("/users"); if (res.ok) setUsers(await res.json()); } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (id: string) => { await api(`/users/${id}/suspend`, { method: "PATCH" }); fetchUsers(); };
  const handleActivate = async (id: string) => { await api(`/users/${id}/activate`, { method: "PATCH" }); fetchUsers(); };
  const handleRole = async (id: string, role: string) => { await api(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }); fetchUsers(); };
  const handleDelete = async (id: string) => { await api(`/users/${id}`, { method: "DELETE" }); fetchUsers(); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.email.trim() || !createForm.password) {
      setCreateError("Email and password are required");
      return;
    }
    if (createForm.password.length < 6) {
      setCreateError("Password must be at least 6 characters");
      return;
    }
    setCreating(true);
    try {
      const res = await api("/users", { method: "POST", body: JSON.stringify(createForm) });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create user");
        return;
      }
      setCreateSuccess(`Account created for ${data.name || data.email}`);
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "", role: "user", status: "active", sendWelcome: false });
      fetchUsers();
      setTimeout(() => setCreateSuccess(""), 3000);
    } catch {
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="caption text-ink-muted-48 py-8 text-center">Loading users...</div>;

  return (
    <div className="space-y-4">
      {createSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 caption font-bold px-4 py-3 rounded-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {createSuccess}
        </div>
      )}

      <div className="flex items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="flex-1 max-w-xs" />
        <div className="flex items-center gap-2 bg-canvas-parchment border border-hairline rounded-xs px-3 h-9">
          <Filter className="w-3.5 h-3.5 text-ink-muted-48" />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none bg-canvas-parchment caption text-ink outline-none cursor-pointer transition-all">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="coordinator">Coordinator</option>
            <option value="user">User</option>
            <option value="bot">Bot</option>
          </select>
        </div>
        <span className="fine-print text-ink-muted-48">{filtered.length} users</span>
        <div className="flex-1" />
        <button onClick={() => { setCreateError(""); setCreateForm({ name: "", email: "", password: "", role: "user", status: "active", sendWelcome: false }); setShowCreate(true); }}
          className="bg-primary hover:bg-primary-focus text-white caption-strong px-4 py-2 rounded-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer">
          <UserPlus className="w-3.5 h-3.5" /> Create Account
        </button>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3">User</th>
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3">Email</th>
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Last Login</th>
                <th className="fine-print font-bold text-ink-muted-48 uppercase tracking-wider px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-hairline hover:bg-canvas-parchment/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center fine-print font-bold text-ink-muted-48">
                        {(u.name || u.username)[0].toUpperCase()}
                      </div>
                      <span className="caption-strong text-ink">{u.name || u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 caption text-ink-muted-48">{u.email}</td>
                  <td className="px-4 py-3"><RoleSelect value={u.role} onChange={v => handleRole(u.id, v)} /></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 fine-print text-ink-muted-48 hidden lg:table-cell">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewUser(u)} title="View" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-primary transition-all cursor-pointer">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {u.status === "active" ? (
                        <button onClick={() => handleSuspend(u.id)} title="Suspend" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-yellow-500 transition-all cursor-pointer">
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button onClick={() => handleActivate(u.id)} title="Activate" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-green-500 transition-all cursor-pointer">
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => setConfirmDelete(u)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-red-500 transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 caption text-ink-muted-48">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User Profile">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-canvas-parchment border border-hairline flex items-center justify-center display-md font-bold text-ink-muted-48">
                {(viewUser.name || viewUser.username)[0].toUpperCase()}
              </div>
              <div>
                <p className="body-strong text-ink">{viewUser.name || viewUser.username}</p>
                <p className="caption text-ink-muted-48">@{viewUser.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
                <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Email</span>
                <p className="caption text-ink mt-1">{viewUser.email}</p>
              </div>
              <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
                <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Role</span>
                <p className="caption text-ink mt-1 capitalize">{viewUser.role}</p>
              </div>
              <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
                <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Status</span>
                <p className="caption text-ink mt-1">{viewUser.status}</p>
              </div>
              <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
                <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Last Login</span>
                <p className="caption text-ink mt-1">{viewUser.lastLogin ? new Date(viewUser.lastLogin).toLocaleString() : "Never"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showCreate} onClose={() => { if (!creating) setShowCreate(false); }} title="Create Account">
        <form onSubmit={handleCreate} className="space-y-5">
          {createError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 caption font-bold px-4 py-3 rounded-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {createError}
            </div>
          )}

          <div>
            <label className="block text-ink-muted-48 mb-1.5 font-bold uppercase tracking-wider fine-print">Full Name</label>
            <input type="text" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe"
              className="w-full bg-canvas-parchment border border-hairline p-3 rounded-xs caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary transition-all" />
          </div>

          <div>
            <label className="block text-ink-muted-48 mb-1.5 font-bold uppercase tracking-wider fine-print">Email *</label>
            <input type="email" value={createForm.email} onChange={e => setCreateForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@nexus.io" required
              className="w-full bg-canvas-parchment border border-hairline p-3 rounded-xs caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary transition-all" />
          </div>

          <div>
            <label className="block text-ink-muted-48 mb-1.5 font-bold uppercase tracking-wider fine-print">Password *</label>
            <input type="password" value={createForm.password} onChange={e => setCreateForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" required
              className="w-full bg-canvas-parchment border border-hairline p-3 rounded-xs caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-ink-muted-48 mb-1.5 font-bold uppercase tracking-wider fine-print">Role</label>
              <select value={createForm.role} onChange={e => setCreateForm(p => ({ ...p, role: e.target.value }))}
                className="appearance-none w-full bg-canvas-parchment border border-hairline p-3 rounded-xs caption text-ink outline-none focus:border-primary transition-all cursor-pointer">
                <option value="user">User</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-ink-muted-48 mb-1.5 font-bold uppercase tracking-wider fine-print">Status</label>
              <select value={createForm.status} onChange={e => setCreateForm(p => ({ ...p, status: e.target.value }))}
                className="appearance-none w-full bg-canvas-parchment border border-hairline p-3 rounded-xs caption text-ink outline-none focus:border-primary transition-all cursor-pointer">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 p-3 bg-canvas-parchment border border-hairline rounded-xs cursor-pointer hover:border-primary/30 transition-all">
            <input type="checkbox" checked={createForm.sendWelcome} onChange={e => setCreateForm(p => ({ ...p, sendWelcome: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary cursor-pointer" />
            <span className="caption text-ink-muted-48 font-medium">Send welcome email</span>
          </label>

          <div className="flex gap-3 justify-end pt-2 border-t border-hairline">
            <button type="button" onClick={() => setShowCreate(false)} disabled={creating}
              className="bg-canvas-parchment hover:bg-canvas-parchment border border-hairline text-ink-muted-48 hover:text-ink px-5 py-2.5 rounded-xs caption-strong transition-all disabled:opacity-40 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={creating}
              className="bg-primary hover:bg-primary-focus text-white px-5 py-2.5 rounded-xs caption-strong flex items-center gap-1.5 active:scale-95 transition-all disabled:opacity-40 cursor-pointer">
              {creating ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => confirmDelete && handleDelete(confirmDelete.id)}
        title="Delete User" message={`Are you sure you want to delete "${confirmDelete?.name || confirmDelete?.username}"? This action cannot be undone.`} />
    </div>
  );
}

function GroupsTab() {
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[] | null>(null);
  const [chatGroupName, setChatGroupName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<AdminGroup | null>(null);

  const fetchGroups = useCallback(async () => {
    try { setLoading(true); const res = await api("/groups"); if (res.ok) setGroups(await res.json()); } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const handleDeleteGroup = async (id: string) => { await api(`/groups/${id}`, { method: "DELETE" }); fetchGroups(); setChatMessages(null); };
  const viewChatLogs = async (g: AdminGroup) => {
    setChatGroupName(g.name);
    try { const res = await api(`/groups/${g.id}/messages`); if (res.ok) setChatMessages(await res.json()); } catch { }
  };

  if (loading) return <div className="caption text-ink-muted-48 py-8 text-center">Loading groups...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-canvas border border-hairline rounded-sm">
        <div className="px-5 py-4 border-b border-hairline">
          <h3 className="body-strong text-ink">Chat Groups</h3>
        </div>
        <div className="divide-y divide-hairline">
          {groups.map(g => (
            <div key={g.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-canvas-parchment/50 transition-colors">
              <div>
                <p className="caption-strong text-ink">{g.name}</p>
                <p className="fine-print text-ink-muted-48 mt-0.5">{g.memberCount} members · {g.messageCount.toLocaleString()} messages</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => viewChatLogs(g)} title="View Messages" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-primary transition-all cursor-pointer">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(g)} title="Delete Group" className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-red-500 transition-all cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {groups.length === 0 && <div className="text-center py-8 caption text-ink-muted-48">No groups found</div>}
        </div>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm flex flex-col max-h-[500px]">
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
          <h3 className="body-strong text-ink">{chatMessages ? `# ${chatGroupName}` : "Chat Logs"}</h3>
          {chatMessages && <button onClick={() => setChatMessages(null)} className="fine-print text-ink-muted-48 hover:text-ink transition-all cursor-pointer">Close</button>}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {chatMessages === null ? (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-hairline mx-auto mb-3" />
              <p className="caption text-ink-muted-48">Select a group to view chat logs</p>
            </div>
          ) : chatMessages.length === 0 ? (
            <p className="caption text-ink-muted-48 text-center py-8">No messages in this group</p>
          ) : (
            chatMessages.map(m => (
              <div key={m.id} className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
                <div className="flex items-center gap-2 mb-1">
                  <span className="fine-print font-semibold text-primary">{m.sender?.name || m.sender?.username || "Unknown"}</span>
                  <span className="fine-print text-ink-muted-48">{new Date(m.createdAt).toLocaleString()}</span>
                  {m.edited && <span className="fine-print text-ink-muted-48">(edited)</span>}
                </div>
                <p className="caption text-ink">{m.deleted ? <span className="italic text-ink-muted-48">[deleted]</span> : m.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { if (confirmDelete) handleDeleteGroup(confirmDelete.id); }}
        title="Delete Group" message={`Are you sure you want to delete "${confirmDelete?.name}" and all its messages? This cannot be undone.`} />
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [broadcast, setBroadcast] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try { setLoading(true); const res = await api("/settings"); if (res.ok) setSettings(await res.json()); } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const toggleSetting = async (key: string) => {
    setSaving(key);
    const newValue = settings[key] === "true" ? "false" : "true";
    await api("/settings", { method: "PATCH", body: JSON.stringify({ key, value: newValue }) });
    setSettings(prev => ({ ...prev, [key]: newValue }));
    setSaving(null);
  };

  const handleBroadcast = async () => {
    if (!broadcast.trim()) return;
    const res = await api("/broadcast", { method: "POST", body: JSON.stringify({ content: broadcast }) });
    if (res.ok) { setBroadcastSent(true); setBroadcast(""); setTimeout(() => setBroadcastSent(false), 3000); }
  };

  if (loading) return <div className="caption text-ink-muted-48 py-8 text-center">Loading settings...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-canvas border border-hairline rounded-sm">
          <div className="px-5 py-4 border-b border-hairline">
            <h3 className="body-strong text-ink">Platform Controls</h3>
          </div>
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="caption-strong text-ink">User Registrations</p>
                <p className="fine-print text-ink-muted-48 mt-0.5">Allow new users to create accounts</p>
              </div>
              <button onClick={() => toggleSetting("registrations_enabled")} disabled={saving === "registrations_enabled"}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${settings["registrations_enabled"] === "true" ? "bg-primary" : "bg-hairline"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${settings["registrations_enabled"] === "true" ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="caption-strong text-ink">Maintenance Mode</p>
                <p className="fine-print text-ink-muted-48 mt-0.5">Disable access for non-admin users</p>
              </div>
              <button onClick={() => toggleSetting("maintenance_mode")} disabled={saving === "maintenance_mode"}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${settings["maintenance_mode"] === "true" ? "bg-yellow-500" : "bg-hairline"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${settings["maintenance_mode"] === "true" ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-canvas border border-hairline rounded-sm">
          <div className="px-5 py-4 border-b border-hairline">
            <h3 className="body-strong text-ink">System Information</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between caption">
              <span className="text-ink-muted-48">Node Version</span>
              <span className="text-ink font-mono">{navigator.userAgent.includes("Node") ? "Server" : "Client"}</span>
            </div>
            <div className="flex items-center justify-between caption">
              <span className="text-ink-muted-48">API Status</span>
              <span className="text-green-600 flex items-center gap-1.5"><Circle className="w-2 h-2 fill-green-600" /> Connected</span>
            </div>
            <div className="flex items-center justify-between caption">
              <span className="text-ink-muted-48">Environment</span>
              <span className="text-ink font-mono">Development</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-canvas border border-hairline rounded-sm">
          <div className="px-5 py-4 border-b border-hairline">
            <h3 className="body-strong text-ink">Broadcast Message</h3>
            <p className="fine-print text-ink-muted-48 mt-0.5">Send an announcement to all chat groups</p>
          </div>
          <div className="p-5 space-y-3">
            <textarea value={broadcast} onChange={e => setBroadcast(e.target.value)} placeholder="Type your broadcast message..."
              className="w-full h-24 bg-canvas-parchment border border-hairline rounded-xs p-3 caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary transition-all resize-none" />
            <button onClick={handleBroadcast} disabled={!broadcast.trim()}
              className="w-full h-9 bg-primary text-white caption-strong rounded-xs hover:bg-primary-focus disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer">
              Send Broadcast
            </button>
            {broadcastSent && <p className="fine-print text-green-600 text-center">Broadcast sent successfully!</p>}
          </div>
        </div>

        <div className="bg-canvas border border-hairline rounded-sm">
          <div className="px-5 py-4 border-b border-hairline">
            <h3 className="body-strong text-ink">Role Management</h3>
          </div>
          <div className="p-5 space-y-3 caption text-ink-muted-48">
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div><span className="text-ink font-semibold">Admin</span> — Full system access, user management, settings</div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <div><span className="text-ink font-semibold">Coordinator</span> — Chat access, network graph, analytics</div>
            </div>
            <div className="flex items-start gap-3">
              <UserPlus className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div><span className="text-ink font-semibold">User</span> — Limited access, profile only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsTab() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = typeFilter !== "all" ? `?type=${typeFilter}` : "";
      const res = await api(`/logs${params}`);
      if (res.ok) setLogs(await res.json());
    } catch { } finally { setLoading(false); }
  }, [typeFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const typeIcon: Record<string, any> = { admin_action: Shield, login: LogOut, security: AlertTriangle };
  const typeColor: Record<string, string> = { admin_action: "#0066cc", login: "#22C55E", security: "#F59E0B" };

  if (loading) return <div className="caption text-ink-muted-48 py-8 text-center">Loading logs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-canvas-parchment border border-hairline rounded-xs px-3 h-9">
          <Filter className="w-3.5 h-3.5 text-ink-muted-48" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="appearance-none bg-canvas-parchment caption text-ink outline-none cursor-pointer transition-all">
            <option value="all">All Types</option>
            <option value="admin_action">Admin Actions</option>
            <option value="login">Logins</option>
            <option value="security">Security</option>
          </select>
        </div>
        <span className="fine-print text-ink-muted-48">{logs.length} entries</span>
      </div>

      <div className="bg-canvas border border-hairline rounded-sm">
        <div className="divide-y divide-hairline max-h-[500px] overflow-y-auto custom-scrollbar">
          {logs.map(l => {
            const Icon = typeIcon[l.type] || Clock;
            const color = typeColor[l.type] || "#7a7a7a";
            return (
              <div key={l.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-canvas-parchment/50 transition-colors">
                <div className="w-7 h-7 rounded-xs flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="caption-strong text-ink font-medium truncate">{l.action}</p>
                  <p className="fine-print text-ink-muted-48 mt-0.5">
                    {l.user ? `${l.user.name || l.user.username} (${l.user.email})` : "System"} · {new Date(l.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={l.type} />
              </div>
            );
          })}
          {logs.length === 0 && <div className="text-center py-8 caption text-ink-muted-48">No logs found</div>}
        </div>
      </div>
    </div>
  );
}