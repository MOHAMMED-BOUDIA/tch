import { Bolt, Search, Bell, User } from "lucide-react";

const COMPONENTS = [
  { name: "Primary Button", type: "pill" },
  { name: "Ghost Pill", type: "ghost" },
  { name: "Utility Button", type: "utility" },
  { name: "Pearl Capsule", type: "pearl" },
  { name: "Search Input", type: "search" },
  { name: "Status Chip", type: "chip" },
  { name: "Frosted Nav", type: "frosted" },
  { name: "Footer Dense", type: "footer" },
  { name: "Icon Circular", type: "icon" },
  { name: "Product Tile", type: "tile" },
  { name: "Utility Card", type: "card" },
  { name: "Option Chip", type: "option" },
  { name: "Nav Link", type: "link" },
  { name: "Floating Bar", type: "float" },
];

export default function DesignPreview() {
  return (
    <div className="w-full max-w-[760px] mx-auto">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
        {COMPONENTS.map((c) => (
          <div
            key={c.name}
            className="bg-canvas rounded-sm border border-hairline p-2.5 text-center flex flex-col items-center gap-1.5"
          >
            {c.type === "pill" && (
              <div className="w-full h-6 rounded-pill bg-primary" />
            )}
            {c.type === "ghost" && (
              <div className="w-full h-6 rounded-pill border border-primary" />
            )}
            {c.type === "utility" && (
              <div className="w-full h-6 rounded-xs bg-ink" />
            )}
            {c.type === "pearl" && (
              <div className="w-full h-6 rounded-md bg-surface-pearl border border-divider-soft" />
            )}
            {c.type === "search" && (
              <div className="w-full h-6 rounded-pill border border-hairline flex items-center justify-center">
                <Search className="w-2 h-2 text-ink-muted-48" />
              </div>
            )}
            {c.type === "chip" && (
              <div className="w-full h-5 rounded-pill border border-hairline bg-canvas-parchment" />
            )}
            {c.type === "frosted" && (
              <div className="w-full h-6 rounded-xs frosted" />
            )}
            {c.type === "footer" && (
              <div className="w-full h-5 bg-canvas-parchment" />
            )}
            {c.type === "icon" && (
              <div className="w-6 h-6 rounded-full bg-surface-chip-translucent flex items-center justify-center">
                <Bell className="w-2.5 h-2.5 text-ink" />
              </div>
            )}
            {c.type === "tile" && (
              <div className="w-full h-6 bg-surface-tile-1 border border-white/10" />
            )}
            {c.type === "card" && (
              <div className="w-full h-6 bg-canvas rounded-xs border border-hairline" />
            )}
            {c.type === "option" && (
              <div className="w-full h-5 rounded-pill bg-canvas border border-hairline" />
            )}
            {c.type === "link" && (
              <div className="w-3 h-3 bg-primary rounded-xs" />
            )}
            {c.type === "float" && (
              <div className="w-full h-5 frosted rounded-xs" />
            )}
            <span className="text-[8px] text-ink-muted-48 leading-tight">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
