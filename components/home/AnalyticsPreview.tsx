import { TrendingUp, Users, BarChart4 } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_DATA = [65, 78, 92, 85, 110, 45, 30];

const METRICS = [
  { label: "Active Users", value: "128", icon: Users },
  { label: "Messages Today", value: "1,842", icon: BarChart4 },
  { label: "Collab Velocity", value: "+23%", icon: TrendingUp },
];

export default function AnalyticsPreview() {
  const maxVal = Math.max(...WEEK_DATA);
  return (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="flex gap-3 mb-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="flex-1 bg-surface-tile-2 rounded-sm p-3.5 text-left border border-white/5"
            >
              <Icon className="w-3.5 h-3.5 text-primary mb-2" />
              <div className="text-[22px] font-semibold text-body-on-dark tracking-tight">{m.value}</div>
              <div className="text-[10px] text-body-muted mt-0.5">{m.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-tile-2 rounded-sm p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-body-on-dark">Weekly Activity</span>
          <span className="text-[10px] text-body-muted">This week</span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {WEEK_DATA.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full bg-primary/30 rounded-sm"
                style={{
                  height: `${(v / maxVal) * 100}%`,
                  minHeight: "8px",
                }}
              />
              <span className="text-[9px] text-body-muted">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
