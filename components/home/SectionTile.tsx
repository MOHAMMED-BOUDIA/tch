interface SectionTileProps {
  background: "light" | "parchment" | "dark";
  children: React.ReactNode;
  className?: string;
}

const bgMap: Record<string, string> = {
  light: "bg-canvas",
  parchment: "bg-canvas-parchment",
  dark: "bg-surface-tile-1",
};

export default function SectionTile({ background, children, className = "" }: SectionTileProps) {
  return (
    <section className={`${bgMap[background]} text-center py-[80px] px-6 ${className}`}>
      <div className="max-w-[980px] mx-auto">{children}</div>
    </section>
  );
}
