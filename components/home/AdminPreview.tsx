import { Shield, Users, MessageSquare } from "lucide-react";

const USERS_TABLE = [
  { name: "Alex Chen", email: "alex@nexus.io", role: "Admin", status: "Active" },
  { name: "Jordan Lee", email: "jordan@nexus.io", role: "Coordinator", status: "Active" },
  { name: "Elena Garcia", email: "elena@nexus.io", role: "User", status: "Active" },
  { name: "Marcus Kim", email: "marcus@nexus.io", role: "User", status: "Suspended" },
];

export default function AdminPreview() {
  return (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="flex gap-3 mb-4">
        {[
          { icon: Users, label: "Total Users", value: "247" },
          { icon: MessageSquare, label: "Active Groups", value: "18" },
          { icon: Shield, label: "System Status", value: "Healthy" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex-1 bg-canvas-parchment rounded-sm p-3.5 text-left border border-hairline">
              <Icon className="w-3.5 h-3.5 text-primary mb-2" />
              <div className="text-lg font-semibold text-ink tracking-tight">{s.value}</div>
              <div className="text-[10px] text-ink-muted-48 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-canvas rounded-sm border border-hairline overflow-hidden">
        <div className="grid grid-cols-4 gap-0 text-[10px] font-semibold text-ink-muted-48 uppercase tracking-wider px-3.5 py-2.5 border-b border-hairline bg-canvas-parchment">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {USERS_TABLE.map((u) => (
          <div key={u.name} className="grid grid-cols-4 gap-0 px-3.5 py-2.5 border-b border-hairline last:border-0 text-[11px]">
            <span className="font-medium text-ink">{u.name}</span>
            <span className="text-ink-muted-48">{u.email}</span>
            <span className="text-ink-muted-48">{u.role}</span>
            <span className={u.status === "Active" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
              {u.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
