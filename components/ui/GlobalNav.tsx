export default function GlobalNav({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-11 frosted z-50 flex items-center justify-center gap-6">
      {children}
    </nav>
  );
}

export function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={`nav-link transition-colors duration-200 ${
        active ? "text-ink" : "text-ink-muted-48 hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}

export function NavLogo({ label }: { label: string }) {
  return (
    <span className="nav-link font-semibold text-ink tracking-normal">{label}</span>
  );
}