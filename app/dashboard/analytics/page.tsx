"use client";

import { Users, MessageSquare, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-[#1E293B]">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Platform Analytics</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Real-time collaboration intelligence and system metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">Weekly Activity</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#94A3B8] mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasEvent = [8, 14, 24].includes(day);
              const isHigh = [14, 24].includes(day);
              return (
                <div key={day} className={`p-3 rounded-xl border relative font-medium transition-all ${hasEvent ? 'bg-[#00E5FF]/10 border-[#00E5FF]/20 text-[#00E5FF]' : 'bg-[#1E293B] border-[#1E293B] text-[#cbd5e1]'}`}>
                  {day}
                  {hasEvent && <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-[#00E5FF]' : 'bg-[#00E5FF]/40'}`} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><Users className="w-3 h-3 text-[#00E5FF]" /> Active Users</span>
                <span className="text-xs font-bold text-[#F8FAFC]">128</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-[#00E5FF]" /> Messages Today</span>
                <span className="text-xs font-bold text-[#F8FAFC]">1,842</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl border border-[#1E293B]">
                <span className="text-[10px] text-[#94A3B8] flex items-center gap-1.5"><Activity className="w-3 h-3 text-[#00E5FF]" /> System Uptime</span>
                <span className="text-xs font-bold text-green-400">99.97%</span>
              </div>
            </div>
          </div>
          <div className="bg-[#111827] p-6 rounded-2xl border border-[#1E293B] shadow-sm shadow-black/20">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Trending</h3>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">Collaboration velocity increased 23% this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
