export default function SubNavFrosted({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`fixed top-11 left-0 right-0 h-13 frosted z-40 flex items-center justify-between px-6 ${className}`}>
      {children}
    </div>
  );
}