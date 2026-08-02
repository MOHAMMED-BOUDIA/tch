interface ButtonPearlCapsuleProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ButtonPearlCapsule({ children, onClick, className = "" }: ButtonPearlCapsuleProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-5 py-2 bg-surface-pearl text-primary button-utility rounded-pill border border-hairline transition-all duration-200 hover:bg-primary hover:text-white cursor-pointer select-none ${className}`}
    >
      {children}
    </button>
  );
}