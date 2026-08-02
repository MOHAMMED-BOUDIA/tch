interface ProductTileLightProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProductTileLight({ children, className = "" }: ProductTileLightProps) {
  return (
    <div className={`bg-canvas rounded-lg border border-hairline overflow-hidden ${className}`}>
      {children}
    </div>
  );
}