interface ButtonSecondaryPillProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ButtonSecondaryPill({ children, onClick, className = "" }: ButtonSecondaryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-5 py-1.5 bg-white text-ink button-large rounded-pill border border-hairline transition-all duration-200 hover:bg-canvas-parchment cursor-pointer select-none ${className}`}
    >
      {children}
    </button>
  );
}