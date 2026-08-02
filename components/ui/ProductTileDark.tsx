interface ProductTileDarkProps {
  children: React.ReactNode;
  className?: string;
}

export default function ProductTileDark({ children, className = "" }: ProductTileDarkProps) {
  return (
    <div className={`bg-surface-tile-1 rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}