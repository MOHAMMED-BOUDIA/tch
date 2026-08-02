import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-canvas-parchment border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-ink-muted-48" />
            <span className="fine-print text-ink-muted-48">Nexus Pro</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="fine-print text-ink-muted-48 hover:text-ink transition-colors">Privacy</a>
            <a href="#" className="fine-print text-ink-muted-48 hover:text-ink transition-colors">Terms</a>
            <a href="#" className="fine-print text-ink-muted-48 hover:text-ink transition-colors">Contact</a>
          </div>
          <p className="fine-print text-ink-muted-48">
            &copy; {new Date().getFullYear()} Nexus Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}