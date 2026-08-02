interface ButtonDarkUtilityProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function ButtonDarkUtility({ children, onClick, className = "" }: ButtonDarkUtilityProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 bg-surface-black text-body-on-dark button-utility rounded-md transition-all duration-200 hover:opacity-80 cursor-pointer select-none ${className}`}
    >
      {children}
    </button>
  );
}