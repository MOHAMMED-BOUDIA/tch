import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ExternalLink, Plus, X } from "lucide-react";
import type { Project } from "../types";

const API = import.meta.env.VITE_API_URL || "";

export default function UserPortfolio() {
  const navigate = useNavigate();
  const token = localStorage.getItem("user_token") || "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", link: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setError("Name and description are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), description: form.description.trim(), link: form.link.trim() }),
      });
      if (res.ok) {
        setForm({ name: "", description: "", link: "" });
        setShowForm(false);
        await fetchProjects();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create project");
      }
    } catch { setError("Failed to create project"); }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Project</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Your projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-[#475569] text-center py-20">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-[#475569]" />
          </div>
          <p className="text-xs text-[#94A3B8]">No projects yet</p>
          <p className="text-[10px] text-[#475569] mt-1">Click "New Project" to add one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj, i) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md relative overflow-hidden group hover:border-[#00E5FF]/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00E5FF]/5 transition-all duration-300 cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><span className="text-[#00E5FF] text-6xl">&#9881;</span></div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block ${proj.status === "published" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-[#1E293B] border border-[#1E293B] text-[#94A3B8]"}`}>
                {proj.status === "published" ? "Published" : "Draft"}
              </span>
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

      <AnimatePresence>
        {showForm && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 w-full max-w-lg pointer-events-auto shadow-2xl">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-sm font-bold text-[#F8FAFC]">New Project</h2>
                  <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#1E293B] hover:text-[#F8FAFC] transition-all cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Name</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-10 bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40" placeholder="Project name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                      className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40 resize-none" placeholder="Brief description" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Link</label>
                    <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                      className="w-full h-10 bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 text-xs text-[#F8FAFC] placeholder:text-[#475569] outline-none focus:border-[#00E5FF]/40" placeholder="https://..." />
                  </div>
                  {error && <p className="text-[10px] text-red-400">{error}</p>}
                  <button type="submit" disabled={saving}
                    className="w-full h-10 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs font-bold rounded-xl active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer">
                    {saving ? "Creating..." : "Create Project"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
