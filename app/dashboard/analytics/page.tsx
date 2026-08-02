"use client";

import { Users, MessageSquare, Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-[1300px] mx-auto space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex justify-between items-center pb-4 border-b border-hairline">
        <div>
          <h1 className="display-md text-ink">Platform Analytics</h1>
          <p className="caption text-ink-muted-48 mt-1">Real-time collaboration intelligence and system metrics</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-canvas-parchment p-6 rounded-sm border border-hairline">
          <h3 className="caption-strong uppercase tracking-widest text-primary mb-4">Weekly Activity</h3>
          <div className="grid grid-cols-7 gap-2 text-center caption-strong text-ink-muted-48 mb-2">
            <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center caption">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const hasEvent = [8, 14, 24].includes(day);
              const isHigh = [14, 24].includes(day);
              return (
                <div key={day} className={`p-3 rounded-xs border relative font-medium transition-all ${hasEvent ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-canvas border-hairline text-ink-muted-48'}`}>
                  {day}
                  {hasEvent && <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-primary' : 'bg-primary/40'}`} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-canvas-parchment p-6 rounded-sm border border-hairline">
            <h3 className="caption-strong uppercase tracking-widest text-primary mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-canvas rounded-xs border border-hairline">
                <span className="fine-print text-ink-muted-48 flex items-center gap-1.5"><Users className="w-3 h-3 text-primary" /> Active Users</span>
                <span className="caption-strong text-ink">128</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-canvas rounded-xs border border-hairline">
                <span className="fine-print text-ink-muted-48 flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-primary" /> Messages Today</span>
                <span className="caption-strong text-ink">1,842</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-canvas rounded-xs border border-hairline">
                <span className="fine-print text-ink-muted-48 flex items-center gap-1.5"><Activity className="w-3 h-3 text-primary" /> System Uptime</span>
                <span className="caption-strong text-primary">99.97%</span>
              </div>
            </div>
          </div>
          <div className="bg-canvas-parchment p-6 rounded-sm border border-hairline">
            <h3 className="caption-strong uppercase tracking-widest text-ink-muted-48 mb-3">Trending</h3>
            <p className="caption text-ink-muted-48 leading-relaxed">Collaboration velocity increased 23% this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
}