"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Edit3, Save } from "lucide-react";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", link: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(`/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setProject(data);
          setForm({ name: data.name, description: data.description, link: data.link || "" });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("user_token");
    if (!token || !form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setEditing(false);
      }
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-[#475569]">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-[#475569]">Project not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[900px] mx-auto overflow-y-auto h-full custom-scrollbar">
      <button onClick={() => router.push("/dashboard/projects")} className="flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-xs transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="bg-[#111827]/80 backdrop-blur-md rounded-2xl border border-[#1E293B] shadow-md p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editing ? (
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-2 text-lg font-bold text-[#F8FAFC] outline-none focus:border-[#00E5FF]/40"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">{project.name}</h1>
            )}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-2 inline-block ${
              project.status === "published" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-[#1E293B] border border-[#1E293B] text-[#94A3B8]"
            }`}>
              {project.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {editing ? (saving ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save</>) : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] outline-none focus:border-[#00E5FF]/40 resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1.5">Link</label>
              <input
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-[#F8FAFC] outline-none focus:border-[#00E5FF]/40"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setEditing(false); setForm({ name: project.name, description: project.description, link: project.link || "" }); }} className="bg-[#1E293B] text-[#94A3B8] px-4 py-2 rounded-xl text-xs font-bold hover:text-[#F8FAFC] transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#cbd5e1] leading-relaxed">{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00E5FF]/20 transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Visit Project
              </a>
            )}
          </>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#1E293B]">
          <div className="bg-[#0F172A] rounded-xl p-3 border border-[#1E293B]">
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Contributors</span>
            <p className="text-sm font-bold text-[#F8FAFC] mt-1">{project.contributorsCount || 0}</p>
          </div>
          {project.performanceScore && (
            <div className="bg-[#0F172A] rounded-xl p-3 border border-[#1E293B]">
              <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Performance</span>
              <p className="text-sm font-bold text-[#00E5FF] mt-1">{project.performanceScore}</p>
            </div>
          )}
          <div className="bg-[#0F172A] rounded-xl p-3 border border-[#1E293B]">
            <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Created</span>
            <p className="text-xs text-[#F8FAFC] mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          {project.createdBy && (
            <div className="bg-[#0F172A] rounded-xl p-3 border border-[#1E293B]">
              <span className="text-[9px] uppercase font-bold text-[#64748B] tracking-wider">Owner</span>
              <p className="text-xs text-[#F8FAFC] mt-1">{project.createdBy.name || project.createdBy.username}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
