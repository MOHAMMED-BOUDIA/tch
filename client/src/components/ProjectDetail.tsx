import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Clock, Activity } from "lucide-react";
import { Project } from "../types";

function api(path: string) {
  const token = localStorage.getItem("user_token");
  return fetch(`/api${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    api(`/projects/${projectId}`)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(setProject)
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#0F172A]">
      <div className="text-xs text-[#475569]">Loading project...</div>
    </div>
  );

  if (error || !project) return (
    <div className="flex-1 flex items-center justify-center bg-[#0F172A]">
      <div className="text-center space-y-4">
        <p className="text-sm text-[#64748B]">{error || "Project not found"}</p>
        <button onClick={() => navigate("/settings")} className="text-[10px] text-[#00E5FF] font-bold hover:underline cursor-pointer">Back to Profile</button>
      </div>
    </div>
  );

  const statusColor = project.status === "Active Now" ? "bg-green-500/10 text-green-400 border-green-500/20"
    : project.status === "Archived" ? "bg-[#1E293B] text-[#64748B] border-[#1E293B]"
    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0F172A]">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 py-8 space-y-8">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-bold transition-all cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 shadow-md">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusColor}`}>{project.status}</span>
                {project.performanceScore && (
                  <span className="text-[10px] text-[#00E5FF] font-bold">{project.performanceScore}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-[#F8FAFC] tracking-tight mb-3">{project.name}</h1>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#1E293B]">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-bold text-[#F8FAFC]">{project.contributorsCount}</span> Contributors
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <Activity className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-bold text-[#F8FAFC]">{project.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
