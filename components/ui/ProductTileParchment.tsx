interface ProductTileParchmentProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProductTileParchment({ children, className = "" }: ProductTileParchmentProps) {
  return (
    <div className={`bg-canvas-parchment rounded-lg border border-hairline overflow-hidden ${className}`}>
      {children}
    </div>
  );
}