"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Layers, CheckSquare, BarChart, ExternalLink, Eye } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setProjects(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = projects.length;
  const published = projects.filter((p) => p.status === "published").length;

  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-hairline">
        <div>
          <h1 className="display-md text-ink">Projects</h1>
          <p className="caption text-ink-muted-48 mt-1">Manage your projects</p>
        </div>
        <button onClick={() => router.push("/dashboard/portfolio")} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white button-utility rounded-pill hover:bg-primary-focus active:scale-95 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-canvas-parchment p-5 rounded-sm border border-hairline flex items-center justify-between">
          <div>
            <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Total Projects</span>
            <p className="display-md text-ink mt-1">{loading ? "..." : total}</p>
          </div>
          <Layers className="text-primary w-8 h-8 opacity-80" />
        </div>
        <div className="bg-canvas-parchment p-5 rounded-sm border border-hairline flex items-center justify-between">
          <div>
            <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Published</span>
            <p className="display-md text-primary mt-1">{loading ? "..." : published}</p>
          </div>
          <CheckSquare className="text-primary w-8 h-8 opacity-80" />
        </div>
        <div className="bg-canvas-parchment p-5 rounded-sm border border-hairline flex items-center justify-between">
          <div>
            <span className="fine-print uppercase font-bold text-ink-muted-48 tracking-wider">Drafts</span>
            <p className="display-md text-primary mt-1">{loading ? "..." : total - published}</p>
          </div>
          <BarChart className="text-primary w-8 h-8 opacity-80" />
        </div>
      </div>

      {loading ? (
        <p className="caption text-ink-muted-48 text-center py-20">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-xs bg-canvas-parchment border border-hairline flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-ink-muted-48" />
          </div>
          <p className="caption text-ink-muted-48">No projects yet</p>
          <p className="fine-print text-ink-muted-48 mt-1">Click &ldquo;New Project&rdquo; to add one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-canvas p-5 rounded-sm border border-hairline product-shadow relative overflow-hidden group hover:border-primary/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/dashboard/projects/${proj.id}`)}>
              <span className={`fine-print font-bold uppercase tracking-wider px-2 py-0.5 rounded-pill mb-3 inline-block ${proj.status === "published" ? "bg-primary/10 border border-primary/20 text-primary" : "bg-canvas-parchment border border-hairline text-ink-muted-48"}`}>
                {proj.status === "published" ? "Published" : "Draft"}
              </span>
              <h4 className="body-strong text-ink mb-1 leading-snug">{proj.name}</h4>
              <p className="caption text-ink-muted-48 mb-4 leading-relaxed line-clamp-2">{proj.description}</p>
              <div className="flex items-center gap-2">
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-primary/5 text-primary border border-primary/20 px-3 py-1.5 rounded-pill fine-print font-bold flex items-center gap-1 hover:bg-primary/10 transition-all">
                    <ExternalLink className="w-3 h-3" /> Visit Project
                  </a>
                ) : null}
                {proj.contributorsCount > 0 && <span className="fine-print text-ink-muted-48 font-medium">+{proj.contributorsCount} Contributors</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}