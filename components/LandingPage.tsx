import { useState } from "react";
import { motion } from "motion/react";
import {
  Bolt, Shield, ChevronRight, MessageSquare, Globe, Database,
  Activity, Zap, BarChart, Users, Cloud, ArrowRight,
  CheckCircle, Star, Cpu, Workflow, LayoutDashboard, Layers,
  Sparkles, Network, Twitter, Github, Linkedin,
} from "lucide-react";
import ButtonPrimary from "./ui/ButtonPrimary";
import ButtonSecondaryPill from "./ui/ButtonSecondaryPill";
import ProductTileLight from "./ui/ProductTileLight";
import ProductTileParchment from "./ui/ProductTileParchment";
import ProductTileDark from "./ui/ProductTileDark";
import StoreUtilityCard from "./ui/StoreUtilityCard";
import ConfiguratorOptionChip from "./ui/ConfiguratorOptionChip";
import Footer from "./ui/Footer";

interface Props {
  onGetStarted: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
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
    <div className="min-h-screen bg-canvas text-ink font-body overflow-x-hidden">
      <Nav onGetStarted={onGetStarted} />
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductPreviewSection />
      <BenefitsSection onGetStarted={onGetStarted} />
      <TestimonialsSection />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}

/* ===============================================================
   NAV
   =============================================================== */
function Nav({ onGetStarted }: Props) {
  return (
    <header className="h-11 flex items-center px-6 frosted sticky top-0 z-50 border-b border-hairline">
      <div className="flex items-center gap-2">
        <Bolt className="w-4 h-4 text-primary" />
        <span className="caption-strong text-ink">Nexus Pro</span>
      </div>
      <div className="flex-1" />
      <nav className="hidden md:flex items-center gap-6 mr-6">
        {["Features", "How It Works", "Benefits", "Testimonials"].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="nav-link text-ink-muted-48 hover:text-ink transition-colors"
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
        <ButtonPrimary onClick={onGetStarted}>
          Explore the Network <ArrowRight className="w-3.5 h-3.5" />
        </ButtonPrimary>
      </div>
    </header>
  );
}

/* ===============================================================
   HERO
   =============================================================== */
function HeroSection({ onGetStarted }: Props) {
  return (
    <section className="relative min-h-[90vh] flex flex-col px-6 pt-24 pb-16 overflow-hidden bg-canvas">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
                <Sparkles className="w-3 h-3" /> Real-Time Collaboration Intelligence
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5"
            >
              <h1 className="hero-display text-ink">
                Where Conversations<br />
                <span className="text-primary">Become Connections.</span>
              </h1>
              <p className="body text-ink-muted-48 max-w-lg">
                Every message builds a relationship. Visualize your team&apos;s interactions,
                track collaboration flows, and manage your network in one unified platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <ButtonPrimary onClick={onGetStarted}>
                Explore the Network <ArrowRight className="w-4 h-4" />
              </ButtonPrimary>
              <ButtonSecondaryPill onClick={onGetStarted}>
                Start Collaborating
              </ButtonSecondaryPill>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-square rounded-lg border border-hairline product-shadow overflow-hidden bg-canvas-parchment">
              <NetworkGraph />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-5xl mx-auto w-full mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Built for Coordinators & Teams" },
            { icon: MessageSquare, label: "Real-Time Messaging" },
            { icon: Activity, label: "Dynamic Relationship Mapping" },
            { icon: Shield, label: "Secure Role-Based Access" },
          ].map(({ icon: Icon, label }) => (
            <StoreUtilityCard key={label}>
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="caption-strong text-ink">{label}</span>
              </div>
            </StoreUtilityCard>
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
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0066cc" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lineBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#0066cc" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lineActiveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0066cc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="lineHoverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066cc" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#0066cc" stopOpacity="1" />
          <stop offset="100%" stopColor="#0071e3" stopOpacity="0.6" />
        </linearGradient>

        {nodes.map((n) => (
          <clipPath key={`clip-${n.id}`} id={`clip-${n.id}`}>
            <circle cx={toC(n.cx)} cy={toC(n.cy)} r={AVATAR_R} />
          </clipPath>
        ))}
      </defs>

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
                stroke="#0066cc"
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

      <g filter="url(#dotGlow)">
        <circle r={4} fill="#0066cc" opacity={0.5}>
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

      <animateTransform
        xlinkHref="#sarah-group"
        attributeName="transform"
        type="translate"
        values="0,0; 0,-3; 0,0"
        dur="3s"
        repeatCount="indefinite"
      />

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
              stroke="#0066cc"
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
              stroke="#e0e0e0"
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
                <div className="w-full h-full">
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
    <section id="features" className="px-6 py-28 bg-canvas-parchment">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
            Platform Features
          </span>
          <h2 className="display-md text-ink">Everything you need to scale</h2>
          <p className="body text-ink-muted-48 max-w-xl mx-auto">
            Purpose-built tools that give your team full visibility and control.
          </p>
        </motion.div>

        <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} {...staggerItem}>
              <ProductTileLight className="p-6">
                <div className="w-10 h-10 rounded-xs bg-primary/5 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="body-strong text-ink mb-2">{title}</h3>
                <p className="caption text-ink-muted-48">{desc}</p>
              </ProductTileLight>
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
    <section id="how-it-works" className="px-6 py-28 border-t border-hairline">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
            How It Works
          </span>
          <h2 className="display-md text-ink">Go from zero to operational</h2>
          <p className="body text-ink-muted-48 max-w-xl mx-auto">
            Three simple steps to transform how your team operates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-xs bg-canvas-parchment border border-hairline flex items-center justify-center mb-5 relative z-10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="caption-strong text-primary mb-2">{step}</span>
              <h3 className="body-strong text-ink mb-2">{title}</h3>
              <p className="caption text-ink-muted-48 max-w-xs">{desc}</p>
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
    <section className="px-6 py-28 border-t border-hairline overflow-hidden bg-canvas-parchment">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-14 space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
            Real Teams, Real Conversations
          </span>
          <h2 className="display-md text-ink">Built for human connection</h2>
          <p className="body text-ink-muted-48 max-w-xl mx-auto">
            Nexus brings your team together — across every message, every project, every breakthrough.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="rounded-lg overflow-hidden product-shadow border border-hairline">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
              alt="Team collaborating around a table"
              className="w-full aspect-[16/9] md:aspect-[21/9] object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 frosted rounded-md px-4 py-3 shadow-sm border border-hairline flex items-center gap-3">
              <div className="w-8 h-8 rounded-xs bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="caption-strong text-ink">Live conversation</p>
                <p className="fine-print text-ink-muted-48">12 team members active</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
            </div>
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
    <section id="benefits" className="px-6 py-28 border-t border-hairline">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
              Why Nexus
            </span>
            <h2 className="display-md text-ink leading-tight">
              Cut through the noise.<br />
              <span className="text-primary">Focus on what matters.</span>
            </h2>
            <p className="body text-ink-muted-48">
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
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="body text-ink">{text}</span>
                </div>
              ))}
            </div>

            <ButtonPrimary onClick={onGetStarted}>
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </ButtonPrimary>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ProductTileParchment className="p-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-hairline">
                  <div className="w-10 h-10 rounded-xs bg-primary flex items-center justify-center">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="body-strong text-ink">Unified View</p>
                    <p className="caption text-ink-muted-48">All systems. One screen.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { color: "bg-primary/20", w: "w-3/4" },
                    { color: "bg-ink-muted-48/20", w: "w-1/2" },
                    { color: "bg-primary/20", w: "w-5/6" },
                    { color: "bg-primary/10", w: "w-2/3" },
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-hairline" />
                      <div className={`h-3 rounded-xs ${bar.color} ${bar.w}`} />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <StoreUtilityCard>
                    <Cpu className="w-4 h-4 text-primary mb-2" />
                    <p className="caption-strong text-ink">Low Latency</p>
                    <p className="fine-print text-ink-muted-48">&lt;15ms response time</p>
                  </StoreUtilityCard>
                  <StoreUtilityCard>
                    <Cloud className="w-4 h-4 text-primary mb-2" />
                    <p className="caption-strong text-ink">Cloud Native</p>
                    <p className="fine-print text-ink-muted-48">99.99% uptime SLA</p>
                  </StoreUtilityCard>
                </div>
              </div>
            </ProductTileParchment>
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
  },
  {
    quote: "The graph intelligence feature alone saved us hours of manual dependency mapping. It's like having a sixth sense for project health.",
    name: "Marcus Johnson",
    role: "CTO, DataFlow Inc.",
    avatar: "MJ",
  },
  {
    quote: "We evaluated a dozen platforms before Nexus. Nothing else comes close to the combination of real-time chat, analytics, and infra monitoring.",
    name: "Priya Patel",
    role: "Director of Ops, CloudBase",
    avatar: "PP",
  },
];

function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-28 border-t border-hairline bg-canvas-parchment">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-pill caption-strong text-primary">
            Testimonials
          </span>
          <h2 className="display-md text-ink">Trusted by industry leaders</h2>
          <p className="body text-ink-muted-48 max-w-xl mx-auto">
            See what teams are saying about their Nexus experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, avatar }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductTileLight className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>

                <p className="body text-ink mb-6">&ldquo;{quote}&rdquo;</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xs bg-primary flex items-center justify-center text-white caption-strong">
                    {avatar}
                  </div>
                  <div>
                    <p className="caption-strong text-ink">{name}</p>
                    <p className="fine-print text-ink-muted-48">{role}</p>
                  </div>
                </div>
              </ProductTileLight>
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
    <section className="px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center space-y-8"
      >
        <h2 className="display-md text-ink leading-tight">
          Ready to <span className="text-primary">transform</span> your workflow?
        </h2>
        <p className="body text-ink-muted-48 max-w-lg mx-auto">
          Join thousands of teams already using Nexus. No credit card required.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <ButtonPrimary onClick={onGetStarted}>
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </ButtonPrimary>
        </div>
        <p className="fine-print text-ink-muted-48">Free 14-day trial · No credit card · Cancel anytime</p>
      </motion.div>
    </section>
  );
}