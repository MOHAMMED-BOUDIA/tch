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
        <p className="caption text-ink-muted-48">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="caption text-ink-muted-48">Project not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[900px] mx-auto overflow-y-auto h-full custom-scrollbar">
      <button onClick={() => router.push("/dashboard/projects")} className="flex items-center gap-1.5 caption text-ink-muted-48 hover:text-ink transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="bg-canvas rounded-sm border border-hairline product-shadow p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editing ? (
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-canvas-parchment border border-hairline rounded-xs px-4 py-2 display-md text-ink outline-none focus:border-primary"
              />
            ) : (
              <h1 className="display-md text-ink">{project.name}</h1>
            )}
            <span className={`fine-print font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-pill mt-2 inline-block ${
              project.status === "published" ? "bg-primary/10 border border-primary/20 text-primary" : "bg-canvas-parchment border border-hairline text-ink-muted-48"
            }`}>
              {project.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white button-utility rounded-pill hover:bg-primary-focus transition-all cursor-pointer"
          >
            {editing ? (saving ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save</>) : <><Edit3 className="w-3.5 h-3.5" /> Edit</>}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block fine-print font-bold uppercase tracking-wider text-ink-muted-48 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full bg-canvas-parchment border border-hairline rounded-xs px-4 py-2.5 caption text-ink outline-none focus:border-primary resize-none"
              />
            </div>
            <div>
              <label className="block fine-print font-bold uppercase tracking-wider text-ink-muted-48 mb-1.5">Link</label>
              <input
                value={form.link}
                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                className="w-full bg-canvas-parchment border border-hairline rounded-xs px-4 py-2.5 caption text-ink outline-none focus:border-primary"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setEditing(false); setForm({ name: project.name, description: project.description, link: project.link || "" }); }} className="px-4 py-2 bg-canvas-parchment text-ink-muted-48 button-utility rounded-pill border border-hairline hover:text-ink transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="body text-ink-muted-80 leading-relaxed">{project.description}</p>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-primary/5 text-primary border border-primary/20 px-4 py-2 rounded-pill fine-print font-bold hover:bg-primary/10 transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Visit Project
              </a>
            )}
          </>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-hairline">
          <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
            <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Contributors</span>
            <p className="body-strong text-ink mt-1">{project.contributorsCount || 0}</p>
          </div>
          {project.performanceScore && (
            <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
              <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Performance</span>
              <p className="body-strong text-primary mt-1">{project.performanceScore}</p>
            </div>
          )}
          <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
            <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Created</span>
            <p className="caption text-ink mt-1">{new Date(project.createdAt).toLocaleDateString()}</p>
          </div>
          {project.createdBy && (
            <div className="bg-canvas-parchment rounded-xs p-3 border border-hairline">
              <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Owner</span>
              <p className="caption text-ink mt-1">{project.createdBy.name || project.createdBy.username}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}