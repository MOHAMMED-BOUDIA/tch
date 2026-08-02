"use client";

import { motion } from "motion/react";

const NODES = [
  { id: 0, x: 380, y: 180, label: "Alex" },
  { id: 1, x: 220, y: 290, label: "Jordan" },
  { id: 2, x: 540, y: 290, label: "Elena" },
  { id: 3, x: 300, y: 400, label: "Marcus" },
  { id: 4, x: 460, y: 400, label: "Sarah" },
  { id: 5, x: 380, y: 500, label: "Priya" },
];

const EDGES = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4],
];

function nodePath(id: number): string {
  const n = NODES[id];
  return `${n.x},${n.y}`;
}

export default function GraphPreview({ dark = false }: { dark?: boolean }) {
  const strokeColor = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const strokeActive = dark ? "rgba(41,151,255,0.4)" : "rgba(0,102,204,0.3)";
  const fillColor = dark ? "#2a2a2c" : "#ffffff";
  const borderColor = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)";
  const textColor = dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)";
  const accentColor = "#0066cc";

  return (
    <div className="relative w-full max-w-[760px] mx-auto aspect-[760/620]">
      <svg viewBox="0 0 760 620" className="w-full h-full">
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="3" dy="5" stdDeviation="15" floodOpacity="0.22" />
          </filter>
        </defs>

        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke={strokeColor}
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
          />
        ))}

        {NODES.map((n) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r="38"
            fill={fillColor}
            stroke={borderColor}
            strokeWidth="1"
            filter="url(#shadow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: n.id * 0.08, ease: "easeOut" }}
            whileHover={{ scale: 1.08, stroke: accentColor, strokeWidth: 2 }}
          />
        ))}

        {NODES.map((n) => (
          <motion.circle
            key={`pulse-${n.id}`}
            cx={n.x}
            cy={n.y}
            r="42"
            fill="none"
            stroke={accentColor}
            strokeWidth="1"
            opacity="0"
            animate={{
              opacity: [0, 0.25, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: n.id * 0.3, ease: "easeInOut" }}
          />
        ))}

        {NODES.map((n) => (
          <motion.foreignObject
            key={`label-${n.id}`}
            x={n.x - 30}
            y={n.y + 46}
            width="60"
            height="20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + n.id * 0.08 }}
          >
            <div className="flex justify-center">
              <span
                className="text-[11px] font-medium tracking-tight leading-none"
                style={{ color: textColor }}
              >
                {n.label}
              </span>
            </div>
          </motion.foreignObject>
        ))}

        {NODES.map((n) => (
          <motion.circle
            key={`glow-${n.id}`}
            cx={n.x}
            cy={n.y}
            r="60"
            fill="url(#node-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: n.id * 0.4, ease: "easeInOut" }}
          />
        ))}

        {NODES.filter(n => n.id < 4).map((n) => (
          <g key={`avatar-${n.id}`}>
            <clipPath id={`clip-${n.id}`}>
              <circle cx={n.x} cy={n.y} r="18" />
            </clipPath>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="18"
              fill={accentColor}
              opacity="0.1"
              initial={{ r: 0 }}
              animate={{ r: 18 }}
              transition={{ duration: 0.4, delay: 0.3 + n.id * 0.08 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
