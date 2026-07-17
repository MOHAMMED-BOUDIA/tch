import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Plus, Minus, Maximize, RefreshCw, User, X, Send, Search,
  TrendingUp, TrendingDown, Compass, Award, Activity, Mail, Calendar, MapPin, Globe, MessageSquare
} from "lucide-react";
import { GraphNode, GraphConnection } from "../types";

const API = import.meta.env.VITE_API_URL || "";

function buildBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const cpOffset = Math.max(dist * 0.35, 40);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const nx = -dy / dist;
  const ny = dx / dist;
  const cpx1 = x1 + nx * cpOffset;
  const cpy1 = y1 + ny * cpOffset;
  const cpx2 = x2 + nx * cpOffset;
  const cpy2 = y2 + ny * cpOffset;
  return `M${x1},${y1} C${cpx1},${cpy1} ${cpx2},${cpy2} ${x2},${y2}`;
}

function generateSparkline(): string {
  const pts = Array.from({ length: 8 }, () => Math.random() * 12 + 4);
  return pts.map((v, i) => `${i * 7},${24 - v}`).join(" ");
}

function layoutNodes(names: string[]): GraphNode[] {
  const centerX = 600;
  const centerY = 450;
  const radius = 280;
  return names.map((name, i) => {
    const angle = (2 * Math.PI * i) / names.length - Math.PI / 2;
    return {
      id: i + 1,
      name,
      role: name === "Nexus Assistant" ? "AI Assistant" : "coordinateur",
      avatar: `https://i.pravatar.cc/80?u=${name.toLowerCase().replace(/\s+/g, ".")}@nexus.local`,
      status: "online" as const,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      contribution: `${(85 + Math.random() * 15).toFixed(1)}%`,
    };
  });
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 1 + Math.random() * 2,
  dur: 8 + Math.random() * 12,
  delay: Math.random() * 6,
  opacity: 0.1 + Math.random() * 0.2,
}));

export default function GraphView({ searchQuery = "", onMessageUser, onViewProfile, viewMode = "graph" }: { searchQuery?: string; onMessageUser?: (node: GraphNode) => void; onViewProfile?: (node: GraphNode) => void; viewMode?: "graph" | "list" }) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [connections, setConnections] = useState<GraphConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    fetch(`${API}/api/graph`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load graph");
        return r.json();
      })
      .then((data: { nodes: { id: number; name: string; role: string }[]; connections: GraphConnection[] }) => {
        const names = data.nodes.map((n) => n.name);
        const laid = layoutNodes(names);
        setNodes(laid);
        setConnections(data.connections);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [messageText, setMessageText] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const lastClickTime = useRef(0);
  const lastClickNodeId = useRef<number | null>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const panVelocity = useRef({ x: 0, y: 0 });
  const panAnimFrame = useRef<number>(0);

  const q = searchQuery.toLowerCase().trim();
  const filteredNodes = q
    ? nodes.filter(n => n.name.toLowerCase().includes(q) || n.role.toLowerCase().includes(q))
    : nodes;

  useEffect(() => {
    setShowNoResults(q !== "" && filteredNodes.length === 0);
    if (q) {
      setHoveredNode(null);
      setSelectedNode(null);
    }
  }, [q, filteredNodes.length]);

  useEffect(() => {
    if (activeNode) {
      const t = setTimeout(() => setBarsAnimated(true), 100);
      return () => clearTimeout(t);
    }
    setBarsAnimated(false);
  }, [activeNode]);

  const handleNodeClick = (e: React.MouseEvent, node: GraphNode) => {
    const now = Date.now();
    if (lastClickNodeId.current === node.id && now - lastClickTime.current < 300) {
      setSelectedNode(node);
      lastClickTime.current = 0;
      lastClickNodeId.current = null;
    } else {
      lastClickTime.current = now;
      lastClickNodeId.current = node.id;
    }
  };

  const handleViewportMouseDown = (e: React.MouseEvent) => {
    if (draggingNodeId !== null || (e.target as HTMLElement).closest(".node-card")) return;
    setIsPanning(true);
    panVelocity.current = { x: 0, y: 0 };
    cancelAnimationFrame(panAnimFrame.current);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan({ x: dx, y: dy });
      panVelocity.current = { x: dx - pan.x, y: dy - pan.y };
    } else if (draggingNodeId !== null) {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (rect) {
        const clientXOnCanvas = (e.clientX - rect.left - pan.x) / zoom;
        const clientYOnCanvas = (e.clientY - rect.top - pan.y) / zoom;
        setNodes(prev => prev.map(node => {
          if (node.id === draggingNodeId) {
            return { ...node, x: Math.round(clientXOnCanvas - dragStartOffset.current.x), y: Math.round(clientYOnCanvas - dragStartOffset.current.y) };
          }
          return node;
        }));
      }
    }
  };

  const handleMouseUp = () => {
    if (isPanning) {
      const vx = panVelocity.current.x * 0.12;
      const vy = panVelocity.current.y * 0.12;
      if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
        let inertiaPan = { x: pan.x, y: pan.y };
        let velX = vx;
        let velY = vy;
        const step = () => {
          velX *= 0.92;
          velY *= 0.92;
          inertiaPan = { x: inertiaPan.x + velX, y: inertiaPan.y + velY };
          setPan({ ...inertiaPan });
          if (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1) {
            panAnimFrame.current = requestAnimationFrame(step);
          }
        };
        panAnimFrame.current = requestAnimationFrame(step);
      }
    }
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setActiveNode(node);
    dragStartOffset.current = { x: (e.clientX / zoom) - node.x, y: (e.clientY / zoom) - node.y };
  };

  const handleNodeMouseEnter = (node: GraphNode) => {
    setHoveredNode(node);
    setActiveNode(node);
  };

  const handleNodeMouseLeave = () => {
    setHoveredNode(null);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
  const handleRecenter = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const getNodeConnections = useCallback((nodeId: number): GraphNode[] => {
    const connectedIds = connections.filter(c => c.from === nodeId || c.to === nodeId).map(c => c.from === nodeId ? c.to : c.from);
    return nodes.filter(n => connectedIds.includes(n.id));
  }, [connections, nodes]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setChatSent(true);
    setMessageText("");
    setTimeout(() => setChatSent(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-[#0F172A]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto">
            <RefreshCw className="w-5 h-5 text-[#00E5FF] animate-spin" />
          </div>
          <p className="text-xs text-[#94A3B8]">Mapping connections...</p>
        </div>
      </div>
    );
  }

  const connectedNodeIds = hoveredNode
    ? new Set(getNodeConnections(hoveredNode.id).map(n => n.id))
    : null;

  return (
    <div className="flex-1 h-full overflow-hidden relative select-none bg-gradient-to-b from-[#0F172A] via-[#0b1322] to-[#0F172A]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { handleMouseUp(); setHoveredNode(null); }}
      ref={viewportRef}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#00E5FF]/[0.025] blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#3B82F6]/[0.015] blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00E5FF]/[0.01] blur-[80px]" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#00E5FF]"
            style={{
              width: p.r * 2,
              height: p.r * 2,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -15, 0, 10, 0],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity, p.opacity * 0.7, p.opacity],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 subtle-grid pointer-events-none opacity-10 z-[1]"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      />

      <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10" onMouseDown={handleViewportMouseDown}>
        <div className="absolute" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: "3000px", height: "3000px" }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="lineGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
              </linearGradient>
              <filter id="edgeGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="edgeGlowStrong">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {connections.filter(c => filteredNodes.some(n => n.id === c.from) && filteredNodes.some(n => n.id === c.to)).map((conn, idx) => {
              const fromNode = filteredNodes.find(n => n.id === conn.from);
              const toNode = filteredNodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + 32;
              const y1 = fromNode.y + 32;
              const x2 = toNode.x + 32;
              const y2 = toNode.y + 32;
              const path = buildBezierPath(x1, y1, x2, y2);
              const isHoveredConnection = hoveredNode && (conn.from === hoveredNode.id || conn.to === hoveredNode.id);
              const isFaded = connectedNodeIds !== null && !isHoveredConnection;
              return (
                <g key={idx} opacity={isFaded ? 0.1 : 1} style={{ transition: "opacity 0.3s ease" }}>
                  <path d={path} stroke="url(#lineGrad)" strokeWidth="2" fill="none" />
                  <path d={path} stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="4,8" fill="none" />
                  <path d={path} stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="3,12" fill="none" className="animate-flow" />
                  {isHoveredConnection && (
                    <>
                      <path d={path} stroke="url(#lineGradHover)" strokeWidth="3.5" fill="none" filter="url(#edgeGlow)" />
                      <path d={path} stroke="#00E5FF" strokeWidth="2" strokeOpacity="0.4" fill="none" filter="url(#edgeGlowStrong)" className="animate-flow" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {filteredNodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const isActive = activeNode?.id === node.id;
            const isFaded = connectedNodeIds !== null && !isHovered && !connectedNodeIds.has(node.id);
            const nodeOpacity = isFaded ? 0.3 : 1;
            return (
              <motion.div
                key={node.id}
                className="node-card absolute flex flex-col items-center cursor-grab active:cursor-grabbing z-10"
                style={{ left: node.x, top: node.y, opacity: nodeOpacity }}
                animate={{ scale: isHovered ? 1.08 : isActive ? 1.04 : 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onMouseEnter={() => handleNodeMouseEnter(node)}
                onMouseLeave={handleNodeMouseLeave}
                onClick={(e) => handleNodeClick(e, node)}
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      className="absolute -inset-3 rounded-full"
                      animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.05, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        background: "radial-gradient(circle, rgba(0,229,255,0.25) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
                      }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-[#00E5FF]/20"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.05, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                  )}
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-[#111827] ${
                    isActive
                      ? "border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.45)]"
                      : isHovered
                        ? "border-[#00E5FF]/60 shadow-[0_0_14px_rgba(0,229,255,0.2)]"
                        : "border-[#1E293B]"
                  }`}>
                    <img
                      src={node.avatar}
                      alt={node.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0F172A] ${
                      node.status === "online"
                        ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                        : "bg-slate-500"
                    }`} />
                  </div>
                </div>
                <span className="mt-2 text-[10px] font-semibold text-[#F8FAFC] text-center leading-tight max-w-[80px] truncate">
                  {node.name.split(" ")[0]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card bg-[#111827]/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-[#1E293B] shadow-lg"
        >
          <div className="flex -space-x-2">
            {filteredNodes.slice(0, 3).map((n) => (
              <div key={n.id} className="w-6 h-6 rounded-full border border-[#0F172A] overflow-hidden bg-[#0F172A]">
                <img src={n.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <span className="text-[11px] font-bold text-[#cbd5e1]">{filteredNodes.length} collaborator{filteredNodes.length !== 1 ? "s" : ""}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card bg-[#111827]/95 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-[#1E293B] shadow-2xl w-fit"
        >
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#00E5FF] rounded-xl transition-all duration-200 cursor-pointer" title="Zoom In">
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#1E293B]" />
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#00E5FF] rounded-xl transition-all duration-200 cursor-pointer" title="Zoom Out">
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#1E293B]" />
          <button onClick={handleRecenter} className="w-10 h-10 flex items-center justify-center hover:bg-[#0F172A] text-[#94A3B8] hover:text-[#00E5FF] rounded-xl transition-all duration-200 cursor-pointer" title="Recenter Map">
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {showNoResults && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-[#111827]/90 backdrop-blur-md border border-[#1E293B] rounded-2xl px-8 py-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#1E293B] border border-[#1E293B] flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-[#475569]" />
            </div>
            <p className="text-sm font-bold text-[#F8FAFC]">No results found</p>
            <p className="text-[11px] text-[#94A3B8] mt-1">No team members match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="absolute top-6 right-6 glass-card bg-[#111827]/95 backdrop-blur-xl p-4 rounded-2xl w-64 border border-[#1E293B] shadow-2xl z-20"
      >
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00E5FF]" /> Active Node Metrics
        </h4>
        {activeNode ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#0F172A] border border-[#1E293B] flex-shrink-0">
                <img src={activeNode.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#F8FAFC] truncate leading-none">{activeNode.name}</p>
                <p className="text-[9px] text-[#94A3B8] mt-1 truncate">{activeNode.role}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2.5 border-t border-[#1E293B]">
              <div>
                <div className="flex justify-between items-center text-[10px] mb-1.5">
                  <span className="text-[#94A3B8] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Contribution</span>
                  <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                    {activeNode.contribution}
                    <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                  </span>
                </div>
                <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] rounded-full shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                    initial={{ width: 0 }}
                    animate={{ width: barsAnimated ? activeNode.contribution : 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-2 pl-1">
                  <svg width="56" height="24" viewBox="0 0 56 24" className="opacity-60">
                    <polyline
                      points={generateSparkline()}
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#94A3B8] flex items-center gap-1"><Award className="w-3 h-3" /> Quality Index</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    98.5 <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                  </span>
                </div>
                <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: barsAnimated ? "98.5%" : 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] pt-1">
                <span className="text-[#94A3B8] flex items-center gap-1"><Compass className="w-3 h-3" /> Focus Index</span>
                <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                  A++ <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#94A3B8] text-xs italic">Hover any node for telemetry.</p>
        )}
      </motion.div>

      {selectedNode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onMouseDown={() => { setSelectedNode(null); setChatSent(false); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111827]/95 backdrop-blur-xl border border-[#1E293B] rounded-3xl p-6 w-[380px] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#1E293B] bg-[#111827]">
                  <img src={selectedNode.avatar} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0F172A] ${selectedNode.status === "online" ? "bg-green-500" : "bg-slate-500"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#F8FAFC]">{selectedNode.name}</h3>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{selectedNode.role}</p>
                  <span className={`text-[9px] font-bold mt-1 inline-block ${selectedNode.status === "online" ? "text-green-400" : "text-[#94A3B8]"}`}>
                    {selectedNode.status === "online" ? "● Online" : "● Away"}
                  </span>
                </div>
              </div>
              <button onClick={() => { setSelectedNode(null); setChatSent(false); }} className="w-7 h-7 rounded-full hover:bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mb-4 px-1">
              <div className="flex items-center gap-2.5 text-[11px] text-[#94A3B8]">
                <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>{selectedNode.name.toLowerCase().replace(" ", ".")}@nexus.io</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-[#94A3B8]">
                <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span>Remote · Available</span>
              </div>
            </div>
            <div className="mb-4 pt-3 border-t border-[#1E293B] px-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Connections ({getNodeConnections(selectedNode.id).length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {getNodeConnections(selectedNode.id).map(conn => (
                  <div key={conn.id} className="flex items-center gap-1.5 bg-[#0F172A] rounded-lg px-2.5 py-1.5 border border-[#1E293B]">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-[#111827]">
                      <img src={conn.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-[10px] text-[#cbd5e1] font-medium">{conn.name.split(" ")[0]}</span>
                  </div>
                ))}
                {getNodeConnections(selectedNode.id).length === 0 && (
                  <span className="text-[10px] text-[#94A3B8] italic">No direct connections</span>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-[#1E293B] px-1">
              <button onClick={() => { onViewProfile?.(selectedNode); setSelectedNode(null); setChatSent(false); }} className="w-full bg-[#00E5FF]/10 hover:bg-[#3B82F6]/20 border border-[#00E5FF]/20 h-9 rounded-xl text-[11px] text-[#00E5FF] font-bold transition-all duration-200 cursor-pointer mb-3">
                View Full Profile
              </button>
              <button onClick={() => { onMessageUser?.(selectedNode); setSelectedNode(null); }} className="w-full bg-[#0F172A] hover:bg-[#1E293B] border border-[#1E293B] h-9 rounded-xl text-[11px] text-[#cbd5e1] hover:text-[#F8FAFC] transition-all duration-200 cursor-pointer">
                Open Chat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
