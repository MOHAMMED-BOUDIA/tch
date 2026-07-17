import { useState } from "react";
import { motion } from "motion/react";
import {
  Bolt, Shield, ChevronRight, MessageSquare, Globe, Database,
  Activity, Zap, BarChart, Users, Cloud, ArrowRight,
  CheckCircle, Star, Twitter, Github, Linkedin, Play,
  Cpu, Network, RefreshCw, Box, Sparkles,
  Workflow, LayoutDashboard, Layers
} from "lucide-react";

interface Props {
  onGetStarted: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, staggerChildren: 0.1 },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col overflow-x-hidden">
      <Nav onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <BenefitsSection onGetStarted={onGetStarted} />
      <TestimonialsSection />
      <CTASection onGetStarted={onGetStarted} />
      <FooterSection />
    </div>
  );
}

/* ===============================================================
   NAV
   =============================================================== */
function Nav({ onGetStarted }: Props) {
  return (
    <header className="h-16 flex items-center px-6 border-b border-[#1E293B] bg-[#111827]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
          <Bolt className="text-[#00E5FF] fill-[#00E5FF]/50 w-5 h-5" />
        </div>
        <h1 className="text-sm font-light tracking-tighter text-[#F8FAFC] uppercase leading-none">
          STG<span className="font-black text-[#00E5FF]">OS</span>
        </h1>
      </div>
      <div className="flex-1" />

      <nav className="hidden md:flex items-center gap-6 mr-6">
        {["Features", "How It Works", "Benefits", "Testimonials"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs text-[#94A3B8] hover:text-[#00E5FF] transition-colors font-medium"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(label.toLowerCase().replace(/\s+/g, "-"))?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={onGetStarted}
          className="h-9 px-5 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.97] shadow-lg shadow-black/30 cursor-pointer"
        >
          Explore the Network <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}

/* ===============================================================
   HERO
   =============================================================== */
function HeroSection({ onGetStarted }: Props) {
  return (
    <section className="relative min-h-[95vh] flex flex-col px-6 pt-20 pb-10 overflow-hidden">
      {/* Dark navy gradient background — matches dashboard theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0F172A] via-[#111827] to-[#0F172A] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-[#00E5FF]/3 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/2 blur-[120px] pointer-events-none" />

      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ─── LEFT: Content ─── */}
          <div className="max-w-xl space-y-8">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-1.5 bg-[#00E5FF]/8 border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-flex items-center gap-2 backdrop-blur-sm">
                <Sparkles className="w-3 h-3" /> Real-Time Collaboration Intelligence
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#F8FAFC] tracking-tight leading-[0.95]">
                Where Conversations<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#3B82F6] to-[#00E5FF]">
                  Become Connections.
                </span>
              </h1>
              <p className="text-base md:text-lg text-[#94A3B8] leading-relaxed max-w-lg">
                Every message builds a relationship. Visualize your team&apos;s interactions,
                track collaboration flows, and manage your network in one unified platform.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <button
                onClick={onGetStarted}
                className="h-13 px-8 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-sm font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#00E5FF]/25 hover:shadow-xl hover:shadow-[#00E5FF]/35 cursor-pointer"
              >
                Explore the Network <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onGetStarted}
                className="h-13 px-8 bg-[#1E293B]/60 hover:bg-[#00E5FF]/10 text-white text-sm font-bold rounded-xl border border-[#334155] transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 backdrop-blur-sm"
              >
                Start Collaborating
              </button>
            </motion.div>
          </div>

          {/* ─── RIGHT: Network Visualization ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex items-center justify-center"
          >
            {/* Glass card wrapping the graph */}
            <div className="relative w-full max-w-lg aspect-square rounded-3xl bg-[#111827]/60 backdrop-blur-sm border border-[#1E293B] shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.04)_0%,_transparent_60%)] pointer-events-none" />
              <NetworkGraph />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Trust Indicators ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10 max-w-5xl mx-auto w-full mt-8 lg:mt-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Built for Coordinators & Teams" },
            { icon: MessageSquare, label: "Real-Time Messaging" },
            { icon: Activity, label: "Dynamic Relationship Mapping" },
            { icon: Shield, label: "Secure Role-Based Access" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111827]/60 backdrop-blur-sm border border-[#1E293B]/80 shadow-sm"
            >
              <Icon className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span className="text-[11px] font-semibold text-[#cbd5e1] leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Network Graph SVG ─── */
const AVATAR_SIZE = 34;
const AVATAR_R = AVATAR_SIZE / 2;
const LINE_R = AVATAR_R + 1;

const nodes = [
  { id: "sarah", cx: 0.5, cy: 0.13, avatar: "https://i.pravatar.cc/80?u=sarah.chen@nexora" },
  { id: "alex", cx: 0.16, cy: 0.37, avatar: "https://i.pravatar.cc/80?u=alex.rivera@nexora" },
  { id: "jordan", cx: 0.84, cy: 0.37, avatar: "https://i.pravatar.cc/80?u=jordan.smith@nexora" },
  { id: "elena", cx: 0.27, cy: 0.72, avatar: "https://i.pravatar.cc/80?u=elena.rodriguez@nexora" },
  { id: "mark", cx: 0.73, cy: 0.72, avatar: "https://i.pravatar.cc/80?u=mark.johnson@nexora" },
  { id: "nexus", cx: 0.5, cy: 0.93, avatar: "https://i.pravatar.cc/80?u=nexus.bot@nexora" },
];

const edges = [
  { from: "sarah", to: "alex", cp: { x: 0.3, y: 0.18 } },
  { from: "sarah", to: "jordan", cp: { x: 0.7, y: 0.18 } },
  { from: "sarah", to: "elena", cp: { x: 0.38, y: 0.35 } },
  { from: "alex", to: "jordan", cp: { x: 0.5, y: 0.22 } },
  { from: "alex", to: "elena", cp: { x: 0.2, y: 0.52 } },
  { from: "alex", to: "mark", cp: { x: 0.3, y: 0.6 } },
  { from: "jordan", to: "elena", cp: { x: 0.65, y: 0.45 } },
  { from: "jordan", to: "mark", cp: { x: 0.8, y: 0.55 } },
  { from: "elena", to: "mark", cp: { x: 0.5, y: 0.65 } },
  { from: "elena", to: "nexus", cp: { x: 0.35, y: 0.82 } },
  { from: "mark", to: "nexus", cp: { x: 0.65, y: 0.82 } },
];

function NetworkGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const toC = (v: number) => v * 300;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const buildEdgeCurve = (
    from: { cx: number; cy: number },
    to: { cx: number; cy: number },
    cp: { x: number; y: number }
  ) => {
    const fx = toC(from.cx);
    const fy = toC(from.cy);
    const tx = toC(to.cx);
    const ty = toC(to.cy);

    const dx = tx - fx;
    const dy = ty - fy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;

    const x1 = fx + ux * LINE_R;
    const y1 = fy + uy * LINE_R;
    const x2 = tx - ux * LINE_R;
    const y2 = ty - uy * LINE_R;

    const cpx = toC(cp.x);
    const cpy = toC(cp.y);
    return { d: `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`, x1, y1, x2, y2 };
  };

  const isConnected = (nodeId: string, edge: { from: string; to: string }) =>
    edge.from === nodeId || edge.to === nodeId;

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="lineGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.8" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="auraFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ringGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="pulseGrad">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lineBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lineActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lineHoverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
        </linearGradient>

        {nodes.map((n) => (
          <clipPath key={`clip-${n.id}`} id={`clip-${n.id}`}>
            <circle cx={toC(n.cx)} cy={toC(n.cy)} r={AVATAR_R} />
          </clipPath>
        ))}
      </defs>

      {/* ── Curved lines ── */}
      {edges.map((edge) => {
        const fromN = nodeMap.get(edge.from)!;
        const toN = nodeMap.get(edge.to)!;
        const { d } = buildEdgeCurve(fromN, toN, edge.cp);
        const connected = hoveredNode && (isConnected(hoveredNode, edge) || hoveredNode === edge.from || hoveredNode === edge.to);
        const dimmed = hoveredNode !== null && !connected;
        const hoverBoost = hoveredNode && connected ? 1 : 0;
        const isActive = (edge.from === "sarah" && edge.to === "alex") || (edge.from === "alex" && edge.to === "jordan");

        return (
          <g key={`${edge.from}-${edge.to}`}>
            <path
              d={d}
              fill="none"
              stroke="url(#lineBaseGrad)"
              strokeWidth={dimmed ? 1 : 2.5}
              strokeOpacity={dimmed ? 0.06 : 0.25}
              filter="url(#auraFilter)"
              style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
            />

            <path
              d={d}
              fill="none"
              stroke={hoveredNode && connected ? "url(#lineHoverGrad)" : "url(#lineActiveGrad)"}
              strokeWidth={dimmed ? 1 : hoveredNode && connected ? 3 : 2}
              strokeOpacity={dimmed ? 0.05 : hoverBoost ? 0.9 : 0.5}
              filter="url(#lineGlowFilter)"
              style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
            />

            {isActive && !dimmed && (
              <path
                d={d}
                fill="none"
                stroke="#00E5FF"
                strokeWidth={1.5}
                strokeOpacity={0.5}
                filter="url(#lineGlowFilter)"
                className="animate-flow"
                strokeDasharray="4, 12"
              >
                <animate
                  attributeName="stroke-opacity"
                  values={hoveredNode ? "0.8" : "0.5"}
                  dur="0.3s"
                  fill="freeze"
                />
              </path>
            )}
          </g>
        );
      })}

      {/* ── Pulse rings ── */}
      {["sarah", "alex", "elena"].map((id, i) => {
        const n = nodeMap.get(id)!;
        return (
          <circle
            key={`pulse-${id}`}
            cx={toC(n.cx)}
            cy={toC(n.cy)}
            r={AVATAR_R + 10}
            fill="url(#pulseGrad)"
            className="animate-ping"
            style={{ animationDuration: "3s", animationDelay: `${i * 0.35}s` }}
          />
        );
      })}

      {/* ── Travelling message dot ── */}
      <g filter="url(#dotGlow)">
        <circle r={4} fill="#00E5FF" opacity={0.5}>
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path={buildEdgeCurve(nodeMap.get("sarah")!, nodeMap.get("alex")!, { x: 0.3, y: 0.18 }).d}
          />
        </circle>
        <circle r={1.5} fill="white" opacity={0.9}>
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path={buildEdgeCurve(nodeMap.get("sarah")!, nodeMap.get("alex")!, { x: 0.3, y: 0.18 }).d}
          />
        </circle>
      </g>

      {/* ── Floating animation on central node ── */}
      <animateTransform
        xlinkHref="#sarah-group"
        attributeName="transform"
        type="translate"
        values="0,0; 0,-3; 0,0"
        dur="3s"
        repeatCount="indefinite"
      />

      {/* ── Avatar nodes ── */}
      {nodes.map((node) => {
        const cx = toC(node.cx);
        const cy = toC(node.cy);
        const hovered = hoveredNode === node.id;
        const scale = hovered ? 1.12 : 1;

        return (
          <g
            key={node.id}
            id={node.id === "sarah" ? "sarah-group" : undefined}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle
              cx={cx}
              cy={cy}
              r={AVATAR_R + 4}
              fill="none"
              stroke="#00E5FF"
              strokeWidth={hovered ? 1.5 : 1}
              strokeOpacity={hovered ? 0.5 : 0.15}
              filter="url(#ringGlow)"
              style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
            />

            <circle
              cx={cx}
              cy={cy}
              r={AVATAR_R + 1}
              fill="none"
              stroke="#334155"
              strokeWidth={hovered ? 1.5 : 1}
              strokeOpacity={hovered ? 0.8 : 0.3}
              style={{ transition: "stroke-width 0.3s, stroke-opacity 0.3s" }}
            />

            <g
              transform={`translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`}
              style={{ transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            >
              <foreignObject
                x={cx - AVATAR_R}
                y={cy - AVATAR_R}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                clipPath={`url(#clip-${node.id})`}
              >
                <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full">
                  <img
                    src={node.avatar}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                </div>
              </foreignObject>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ===============================================================
   FEATURES
   =============================================================== */
const features = [
  { icon: MessageSquare, title: "Real-time Messaging", desc: "Instant team chat with threading, reactions, and rich embeds for seamless collaboration." },
  { icon: Globe, title: "Graph Intelligence", desc: "Visualize team networks, project dependencies, and organizational relationships in real time." },
  { icon: Database, title: "Project Hub", desc: "Centralize milestones, tasks, and deployments with live tracking and automated status updates." },
  { icon: Activity, title: "System Monitor", desc: "Monitor infrastructure health, deployment pipelines, and performance metrics from one dashboard." },
  { icon: Zap, title: "Automation Engine", desc: "Trigger workflows, alerts, and cross-service actions with configurable event-driven rules." },
  { icon: Shield, title: "Enterprise Security", desc: "Role-based access, end-to-end encryption, and SOC 2 compliant audit trails built in." },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="px-3 py-1 bg-[#111827] border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-block shadow-sm">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Everything you need to scale
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Purpose-built tools that give your team full visibility and control.
          </p>
        </motion.div>

        <motion.div
          {...stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              {...staggerItem}
              className="group relative bg-[#111827] border border-[#1E293B] rounded-2xl p-6 transition-all duration-500 hover:border-[#00E5FF]/30 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00E5FF]/0 via-transparent to-[#3B82F6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-[#00E5FF]/20" />

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mb-4 group-hover:bg-[#00E5FF]/15 group-hover:border-[#00E5FF]/30 transition-colors">
                  <Icon className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <h3 className="text-sm font-bold text-[#F8FAFC] mb-2">{title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ===============================================================
   HOW IT WORKS
   =============================================================== */
const steps = [
  { icon: Cpu, step: "01", title: "Connect Your Stack", desc: "Integrate with your existing tools — Slack, Jira, GitHub, and 200+ more in one click." },
  { icon: Workflow, step: "02", title: "Configure Workflows", desc: "Define custom automation rules, alerts, and dashboards tailored to your team's needs." },
  { icon: LayoutDashboard, step: "03", title: "Go Live", desc: "Deploy instantly with zero downtime. Your team gains real-time visibility from day one." },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative px-6 py-28 border-t border-[#1E293B]/50">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="px-3 py-1 bg-[#111827] border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-block shadow-sm">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Go from zero to operational
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Three simple steps to transform how your team operates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />

          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#111827] border border-[#1E293B] flex items-center justify-center mb-5 relative z-10 shadow-lg shadow-black/30">
                <Icon className="w-6 h-6 text-[#00E5FF]" />
              </div>
              <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest mb-2">{step}</span>
              <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{title}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   PRODUCT PREVIEW
   =============================================================== */
function ProductPreviewSection() {
  return (
    <section className="relative px-6 py-28 border-t border-[#1E293B]/50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#00E5FF]/3 blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div {...fadeUp} className="text-center mb-14 space-y-3">
          <span className="px-3 py-1 bg-[#111827] border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-block shadow-sm">
            Real Teams, Real Conversations
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Built for human connection
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            Nexus brings your team together — across every message, every project, every breakthrough.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative group"
        >
          {/* Neon glow behind */}
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-[#00E5FF]/15 via-transparent to-[#3B82F6]/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />

          {/* Image card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#1E293B]">
            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
              alt="Team collaborating around a table"
              className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
              loading="lazy"
            />

            {/* Warm gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#00E5FF]/10 to-transparent pointer-events-none" />

            {/* Subtle dark vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />

            {/* Inner glow top edge */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent" />

            {/* Floating chat bubble overlay */}
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 backdrop-blur-xl bg-[#111827]/80 rounded-2xl px-4 py-3 shadow-lg border border-white/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#F8FAFC]">Live conversation</p>
                <p className="text-[8px] text-[#94A3B8]">12 team members active</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
            </div>

            {/* Soft glowing accent dot */}
            <div className="absolute top-8 right-12 w-3 h-3 rounded-full bg-[#00E5FF]/40 blur-sm animate-ping" style={{ animationDuration: "3s" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ===============================================================
   BENEFITS
   =============================================================== */
function BenefitsSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="benefits" className="relative px-6 py-28 border-t border-[#1E293B]/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
          <span className="px-3 py-1 bg-[#111827] border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-block shadow-sm">
              Why Nexus
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight leading-tight">
              Cut through the noise.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]">
                Focus on what matters.
              </span>
            </h2>
            <p className="text-[#94A3B8] leading-relaxed">
              Legacy tools scatter your workflow across a dozen tabs. Nexus brings
              everything — chat, projects, analytics, and infrastructure — into one
              unified command center designed for speed and clarity.
            </p>

            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: "Reduce context switching by 60%" },
                { icon: CheckCircle, text: "Real-time visibility across all projects" },
                { icon: CheckCircle, text: "Enterprise-grade security & compliance" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  <span className="text-sm text-[#cbd5e1]">{text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onGetStarted}
              className="h-12 px-8 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-sm font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-black/30 cursor-pointer"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Right: illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-[#00E5FF]/5 via-transparent to-[#3B82F6]/5 rounded-3xl blur-3xl pointer-events-none" />
            <div className="backdrop-blur-xl bg-[#111827]/80 border border-[#1E293B] rounded-3xl p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/30 to-transparent" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1E293B]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
                    <Layers className="w-5 h-5 text-[#0F172A]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F8FAFC]">Unified View</p>
                    <p className="text-[9px] text-[#94A3B8]">All systems. One screen.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { color: "from-[#00E5FF]/20 to-[#3B82F6]/20", w: "w-3/4" },
                    { color: "from-green-400/20 to-green-500/20", w: "w-1/2" },
                    { color: "from-[#00E5FF]/20 to-[#3B82F6]/20", w: "w-5/6" },
                    { color: "from-purple-400/20 to-purple-500/20", w: "w-2/3" },
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#1E293B]" />
                      <div className={`h-3 rounded-lg bg-gradient-to-r ${bar.color} ${bar.w}`} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#1E293B] rounded-xl p-4 border border-[#1E293B]">
                    <Cpu className="w-4 h-4 text-[#00E5FF] mb-2" />
                    <p className="text-[10px] font-bold text-[#F8FAFC]">Low Latency</p>
                    <p className="text-[8px] text-[#94A3B8]">&lt;15ms response time</p>
                  </div>
                  <div className="bg-[#1E293B] rounded-xl p-4 border border-[#1E293B]">
                    <Cloud className="w-4 h-4 text-green-400 mb-2" />
                    <p className="text-[10px] font-bold text-[#F8FAFC]">Cloud Native</p>
                    <p className="text-[8px] text-[#94A3B8]">99.99% uptime SLA</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   TESTIMONIALS
   =============================================================== */
const testimonials = [
  {
    quote: "Nexus completely transformed how our engineering team coordinates. We went from daily fire drills to proactive operations in two weeks.",
    name: "Sarah Chen",
    role: "VP of Engineering, TechCorp",
    avatar: "SC",
    color: "from-[#00E5FF] to-[#3B82F6]",
  },
  {
    quote: "The graph intelligence feature alone saved us hours of manual dependency mapping. It's like having a sixth sense for project health.",
    name: "Marcus Johnson",
    role: "CTO, DataFlow Inc.",
    avatar: "MJ",
    color: "from-green-500 to-green-700",
  },
  {
    quote: "We evaluated a dozen platforms before Nexus. Nothing else comes close to the combination of real-time chat, analytics, and infra monitoring.",
    name: "Priya Patel",
    role: "Director of Ops, CloudBase",
    avatar: "PP",
    color: "from-[#00E5FF] to-[#3B82F6]",
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative px-6 py-28 border-t border-[#1E293B]/50">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="px-3 py-1 bg-[#111827] border border-[#00E5FF]/20 rounded-full text-[10px] font-bold text-[#00E5FF] uppercase tracking-widest inline-block shadow-sm">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Trusted by industry leaders
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            See what teams are saying about their Nexus experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, avatar, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#111827]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 hover:border-[#00E5FF]/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.08)]"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[#00E5FF] text-[#00E5FF]" />
                ))}
              </div>

              <p className="text-xs text-[#cbd5e1] leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F8FAFC]">{name}</p>
                  <p className="text-[9px] text-[#94A3B8]">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===============================================================
   CTA
   =============================================================== */
function CTASection({ onGetStarted }: Props) {
  return (
    <section className="relative px-6 py-28 overflow-hidden">
      {/* Gradient glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.08)_0%,_rgba(59,130,246,0.04)_40%,_transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto text-center space-y-8"
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#F8FAFC] tracking-tight leading-tight">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]">transform</span> your workflow?
        </h2>
        <p className="text-lg text-[#94A3B8] max-w-lg mx-auto">
          Join thousands of teams already using Nexus. No credit card required.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={onGetStarted}
            className="h-14 px-10 bg-[#00E5FF] hover:bg-[#3B82F6] text-[#0F172A] text-base font-bold rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-[#94A3B8]">Free 14-day trial · No credit card · Cancel anytime</p>
      </motion.div>
    </section>
  );
}

/* ===============================================================
   FOOTER
   =============================================================== */
const productLinks = ["Features", "Pricing", "Integrations", "Changelog", "API Docs"];
const companyLinks = ["About", "Blog", "Careers", "Press", "Contact"];
const socialIcons = [
  { key: "twitter", icon: Twitter, href: "#" },
  { key: "github", icon: Github, href: "#" },
  { key: "linkedin", icon: Linkedin, href: "#" },
];

function FooterSection() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#111827]/60">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + desc */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                <Bolt className="text-[#00E5FF] fill-[#00E5FF]/50 w-4 h-4" />
              </div>
              <span className="text-sm font-light tracking-tighter text-[#F8FAFC] uppercase">
          STG<span className="font-black text-[#00E5FF]">OS</span>
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] leading-relaxed max-w-xs">
              The unified command center for modern enterprises. Real-time collaboration,
              project intelligence, and operational awareness — all in one place.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-[#F8FAFC] uppercase tracking-widest">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[11px] text-[#94A3B8] hover:text-[#00E5FF] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-[#F8FAFC] uppercase tracking-widest">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[11px] text-[#94A3B8] hover:text-[#00E5FF] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + legal */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-[#F8FAFC] uppercase tracking-widest">Connect</h4>
            <div className="flex items-center gap-3">
              {socialIcons.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-[9px] text-[#94A3B8] pt-2">
              &copy; 2026 STGOS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
