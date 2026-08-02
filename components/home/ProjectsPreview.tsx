import { FolderKanban, ArrowUpRight } from "lucide-react";

const PROJECTS = [
  { name: "Nexus Dashboard", status: "Published", score: 94 },
  { name: "Graph Engine", status: "Published", score: 88 },
  { name: "Chat API", status: "Draft", score: 72 },
  { name: "Mobile App", status: "Draft", score: 65 },
];

export default function ProjectsPreview() {
  return (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="grid grid-cols-2 gap-3">
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            className="bg-canvas rounded-sm border border-hairline p-4 text-left product-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-pill ${
                  p.status === "Published"
                    ? "bg-primary/10 text-primary"
                    : "bg-canvas-parchment text-ink-muted-48"
                }`}
              >
                {p.status}
              </span>
            </div>
            <h3 className="text-[13px] font-semibold text-ink">{p.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 bg-canvas-parchment rounded-pill overflow-hidden">
                <div
                  className="h-full bg-primary rounded-pill"
                  style={{ width: `${p.score}%` }}
                />
              </div>
              <span className="text-[10px] text-ink-muted-48">{p.score}%</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-medium">
              <span>View details</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
