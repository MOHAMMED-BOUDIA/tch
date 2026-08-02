interface ButtonPrimaryProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function ButtonPrimary({ children, onClick, className = "", href }: ButtonPrimaryProps) {
  const base = "inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white button-large rounded-pill transition-all duration-200 hover:bg-primary-focus cursor-pointer select-none";
  if (href) {
    return <a href={href} className={`${base} ${className}`}>{children}</a>;
  }
  return <button onClick={onClick} className={`${base} ${className}`}>{children}</button>;
}