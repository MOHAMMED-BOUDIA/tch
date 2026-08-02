interface FloatingStickyBarProps {
  children: React.ReactNode;
  className?: string;
}

export default function FloatingStickyBar({ children, className = "" }: FloatingStickyBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 frosted border-t border-hairline z-30 px-6 py-3 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {children}
      </div>
    </div>
  );
}