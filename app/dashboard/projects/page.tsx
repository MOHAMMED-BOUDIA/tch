"use client";

import { Plus, Layers, CheckSquare, BarChart } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Enterprise Projects</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Manage and track live milestones and active deployments</p>
        </div>
        <button className="bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-black/30 cursor-pointer">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Total Projects</span><p className="text-2xl font-bold text-[#F8FAFC] mt-1">24 Active</p></div>
          <Layers className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Task Completion</span><p className="text-2xl font-bold text-[#00E5FF] mt-1">88.4% Completed</p></div>
          <CheckSquare className="text-green-400 w-8 h-8 opacity-80" />
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20 flex items-center justify-between">
          <div><span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">System Deployments</span><p className="text-2xl font-bold text-[#00E5FF] mt-1">100% Stable</p></div>
          <BarChart className="text-[#00E5FF] w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
}
