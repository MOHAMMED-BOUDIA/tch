interface StoreUtilityCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function StoreUtilityCard({ children, className = "", onClick }: StoreUtilityCardProps) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`bg-surface-pearl rounded-sm border border-hairline p-5 transition-all duration-200 hover:shadow-sm ${
        onClick ? "cursor-pointer text-left" : ""
      } ${className}`}
    >
      {children}
    </Comp>
  );
}