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
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Projects</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage your projects</p>
        </div>
        <button onClick={() => router.push("/dashboard/portfolio")} className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Total Projects</span>
            <p className="text-2xl font-bold text-[#F8FAFC] mt-1">{loading ? "..." : total}</p>
          </div>
          <Layers className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Published</span>
            <p className="text-2xl font-bold text-[#00E5FF] mt-1">{loading ? "..." : published}</p>
          </div>
          <CheckSquare className="text-green-400 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Drafts</span>
            <p className="text-2xl font-bold text-[#00E5FF] mt-1">{loading ? "..." : total - published}</p>
          </div>
          <BarChart className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-[#475569] text-center py-20">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-[#475569]" />
          </div>
          <p className="text-xs text-[#94A3B8]">No projects yet</p>
          <p className="text-[10px] text-[#475569] mt-1">Click &ldquo;New Project&rdquo; to add one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-[#111827]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1E293B] shadow-md relative overflow-hidden group hover:border-[#00E5FF]/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00E5FF]/5 transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/dashboard/projects/${proj.id}`)}>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block ${proj.status === "published" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-[#1E293B] border border-[#1E293B] text-[#94A3B8]"}`}>
                {proj.status === "published" ? "Published" : "Draft"}
              </span>
              <h4 className="text-sm font-bold text-[#F8FAFC] mb-1 leading-snug">{proj.name}</h4>
              <p className="text-[#94A3B8] text-[11px] mb-4 leading-relaxed line-clamp-2">{proj.description}</p>
              <div className="flex items-center gap-2">
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#00E5FF]/20 transition-all">
                    <ExternalLink className="w-3 h-3" /> Visit Project
                  </a>
                ) : null}
                {proj.contributorsCount > 0 && <span className="text-[10px] text-[#94A3B8] font-medium">+{proj.contributorsCount} Contributors</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
