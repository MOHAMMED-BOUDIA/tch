import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ExternalLink, Plus, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { API_URL } from "@/lib/client-env";

const API = API_URL;

export default function UserPortfolio() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", link: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("user_token") || "");
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProjects(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { if (token) fetchProjects(); }, [token]);

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
      <div className="flex justify-between items-center pb-4 border-b border-hairline">
        <div>
          <h1 className="display-md text-ink">Project</h1>
          <p className="caption text-ink-muted-48 mt-1">Your projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-focus text-white caption-strong px-4 py-2 rounded-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {loading ? (
        <p className="caption text-ink-muted-48 text-center py-20">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-xs bg-canvas-parchment border border-hairline flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-ink-muted-48" />
          </div>
          <p className="body text-ink-muted-48">No projects yet</p>
          <p className="caption text-ink-muted-48 mt-1">{'Click "New Project" to add one'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj, i) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => router.push(`/dashboard/projects/${proj.id}`)}
              className="bg-canvas p-5 rounded-sm border border-hairline product-shadow relative overflow-hidden group hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <span className={`fine-print font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill mb-3 inline-block ${proj.status === "published" ? "bg-primary/10 border border-primary/20 text-primary" : "bg-canvas-parchment border border-hairline text-ink-muted-48"}`}>
                {proj.status === "published" ? "Published" : "Draft"}
              </span>
              <h4 className="body-strong text-ink mb-1 leading-snug">{proj.name}</h4>
              <p className="caption text-ink-muted-48 mb-4 leading-relaxed line-clamp-2">{proj.description}</p>
              <div className="flex items-center gap-2">
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="bg-primary/5 text-primary border border-primary/20 px-3 py-1.5 rounded-pill fine-print font-bold flex items-center gap-1 hover:bg-primary/10 transition-all">
                    <ExternalLink className="w-3 h-3" /> Visit Project
                  </a>
                ) : (
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full border border-canvas bg-canvas-parchment" />
                    <div className="w-6 h-6 rounded-full border border-canvas bg-canvas-parchment" />
                    <div className="w-6 h-6 rounded-full border border-canvas bg-canvas-parchment" />
                  </div>
                )}
                {proj.performanceScore ? <span className="fine-print text-primary font-bold">{proj.performanceScore}</span> : proj.contributorsCount > 0 && <span className="fine-print text-ink-muted-48 font-medium">+{proj.contributorsCount} Contributors</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-canvas border border-hairline rounded-sm p-6 w-full max-w-lg pointer-events-auto product-shadow">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="body-strong text-ink">New Project</h2>
                  <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-xs text-ink-muted-48 hover:bg-canvas-parchment hover:text-ink transition-all cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block fine-print font-bold uppercase tracking-wider text-ink-muted-48 mb-1.5">Name</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full h-10 bg-canvas-parchment border border-hairline rounded-xs px-3.5 caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary" placeholder="Project name" />
                  </div>
                  <div>
                    <label className="block fine-print font-bold uppercase tracking-wider text-ink-muted-48 mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                      className="w-full bg-canvas-parchment border border-hairline rounded-xs px-3.5 py-2.5 caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary resize-none" placeholder="Brief description" />
                  </div>
                  <div>
                    <label className="block fine-print font-bold uppercase tracking-wider text-ink-muted-48 mb-1.5">Link</label>
                    <input value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                      className="w-full h-10 bg-canvas-parchment border border-hairline rounded-xs px-3.5 caption text-ink placeholder:text-ink-muted-48 outline-none focus:border-primary" placeholder="https://..." />
                  </div>
                  {error && <p className="fine-print text-red-500">{error}</p>}
                  <button type="submit" disabled={saving}
                    className="w-full h-10 bg-primary hover:bg-primary-focus text-white caption-strong rounded-xs active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer">
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