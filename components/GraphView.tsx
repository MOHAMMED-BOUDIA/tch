import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Plus, Minus, Maximize, Minimize, RotateCcw, RefreshCw, User, X, Send, Search,
  TrendingUp, TrendingDown, Compass, Award, Activity, Mail, Calendar, MapPin, Globe, MessageSquare
} from "lucide-react";
import { GraphNode, GraphConnection } from "@/lib/types";
import { API_URL } from "@/lib/client-env";

const API = API_URL;

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

function layoutNodes(nodes: { id: number; name: string; role: string; userId: string }[]): GraphNode[] {
  const centerX = 600;
  const centerY = 450;
  const radius = 280;
  return nodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      id: n.id,
      userId: n.userId,
      name: n.name,
      role: n.role || (n.name === "Nexus Assistant" ? "AI Assistant" : "coordinateur"),
      avatar: `https://i.pravatar.cc/80?u=${n.name.toLowerCase().replace(/\s+/g, ".")}@nexus.local`,
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

export default function GraphView({ searchQuery = "", onMessageUser, onViewProfile, viewMode = "graph", readOnly = false, fullScreen: controlledFullScreen, onFullScreenChange }: { searchQuery?: string; onMessageUser?: (node: GraphNode) => void; onViewProfile?: (node: GraphNode) => void; viewMode?: "graph" | "list"; readOnly?: boolean; fullScreen?: boolean; onFullScreenChange?: (full: boolean) => void }) {
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
      .then((data: { nodes: { id: number; name: string; role: string; userId: string }[]; connections: GraphConnection[] }) => {
        const laid = layoutNodes(data.nodes);
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
    setSelectedNode(node);
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
    if (readOnly) return;
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

  const fullScreen = controlledFullScreen ?? false;
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
  const handleRecenter = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const toggleFullScreen = () => { onFullScreenChange?.(!fullScreen); handleRecenter(); };

  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  zoomRef.current = zoom;
  panRef.current = pan;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.min(Math.max(zoomRef.current * factor, 0.4), 1.8);
      if (newZoom === zoomRef.current) return;
      const worldX = (mouseX - panRef.current.x) / zoomRef.current;
      const worldY = (mouseY - panRef.current.y) / zoomRef.current;
      setPan({ x: mouseX - worldX * newZoom, y: mouseY - worldY * newZoom });
      setZoom(newZoom);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [loading]);

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
      <div className="flex-1 h-full flex items-center justify-center bg-canvas-parchment">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xs bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          </div>
          <p className="caption text-ink-muted-48">Mapping connections...</p>
        </div>
      </div>
    );
  }

  const connectedNodeIds = hoveredNode
    ? new Set(getNodeConnections(hoveredNode.id).map(n => n.id))
    : null;

  return (
    <div className="flex-1 h-full overflow-hidden relative select-none bg-canvas-parchment"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { handleMouseUp(); setHoveredNode(null); }}
      ref={viewportRef}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.02] blur-[120px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-[1]">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary"
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

      <div className="absolute inset-0 cursor-grab active:cursor-grabbing z-10" onMouseDown={handleViewportMouseDown}>
        <div className="absolute" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: "3000px", height: "3000px" }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066cc" stopOpacity="0.08" />
                <stop offset="50%" stopColor="#0066cc" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0071e3" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="lineGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0066cc" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#0066cc" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0071e3" stopOpacity="0.5" />
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
                  <path d={path} stroke="#0066cc" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="4,8" fill="none" />
                  <path d={path} stroke="#0066cc" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="3,12" fill="none" className="animate-flow" />
                  {isHoveredConnection && (
                    <>
                      <path d={path} stroke="url(#lineGradHover)" strokeWidth="3.5" fill="none" filter="url(#edgeGlow)" />
                      <path d={path} stroke="#0066cc" strokeWidth="2" strokeOpacity="0.4" fill="none" filter="url(#edgeGlowStrong)" className="animate-flow" />
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
                className={`node-card absolute flex flex-col items-center z-10 ${readOnly ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
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
                        background: "radial-gradient(circle, rgba(0,102,204,0.25) 0%, rgba(0,113,227,0.08) 50%, transparent 70%)",
                      }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border border-primary/20"
                      animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.05, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    />
                  )}
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-canvas ${
                    isActive
                      ? "border-primary shadow-[0_0_25px_rgba(0,102,204,0.45)]"
                      : isHovered
                        ? "border-primary/60 shadow-[0_0_14px_rgba(0,102,204,0.2)]"
                        : "border-hairline"
                  }`}>
                    <img
                      src={node.avatar}
                      alt={node.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-canvas ${
                      node.status === "online"
                        ? "bg-primary shadow-[0_0_6px_rgba(0,102,204,0.6)]"
                        : "bg-ink-muted-48"
                    }`} />
                  </div>
                </div>
                <span className="mt-2 caption text-ink text-center leading-tight max-w-[80px] truncate">
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
            className="bg-canvas/90 backdrop-blur-md px-4 py-2 rounded-pill flex items-center gap-3 border border-hairline product-shadow"
          >
            <div className="flex -space-x-2">
              {filteredNodes.slice(0, 3).map((n) => (
                <div key={n.id} className="w-6 h-6 rounded-full border border-canvas overflow-hidden bg-canvas-parchment">
                  <img src={n.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <span className="caption-strong text-ink">{filteredNodes.length} collaborator{filteredNodes.length !== 1 ? "s" : ""}</span>
          </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-canvas/95 backdrop-blur-md p-1.5 rounded-pill flex items-center gap-1 border border-hairline product-shadow w-fit"
        >
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-canvas-parchment text-ink-muted-48 hover:text-primary rounded-xs transition-all duration-200 cursor-pointer" title="Zoom In">
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-hairline" />
              <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-canvas-parchment text-ink-muted-48 hover:text-primary rounded-xs transition-all duration-200 cursor-pointer" title="Zoom Out">
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-hairline" />
          <button onClick={handleRecenter} className="w-10 h-10 flex items-center justify-center hover:bg-canvas-parchment text-ink-muted-48 hover:text-primary rounded-xs transition-all duration-200 cursor-pointer" title="Reset View">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-6 bg-hairline" />
          <button onClick={toggleFullScreen} className="w-10 h-10 flex items-center justify-center hover:bg-canvas-parchment text-ink-muted-48 hover:text-primary rounded-xs transition-all duration-200 cursor-pointer" title={fullScreen ? "Exit Full Screen" : "Full Screen"}>
            {fullScreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </motion.div>
      </div>

      {showNoResults && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="bg-canvas/90 backdrop-blur-md border border-hairline rounded-sm px-8 py-6 text-center product-shadow">
            <div className="w-12 h-12 rounded-xs bg-canvas-parchment border border-hairline flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-ink-muted-48" />
            </div>
            <p className="body-strong text-ink">No results found</p>
            <p className="caption text-ink-muted-48 mt-1">No team members match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        </div>
      )}

<motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="absolute top-6 right-6 bg-canvas/95 backdrop-blur-xl p-4 rounded-sm w-64 border border-hairline product-shadow z-20"
        >
        <h4 className="fine-print font-bold uppercase tracking-widest text-ink-muted-48 mb-3.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" /> Active Node Metrics
        </h4>
        {activeNode ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-canvas-parchment border border-hairline flex-shrink-0">
                <img src={activeNode.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="min-w-0">
                <p className="caption-strong text-ink truncate leading-none">{activeNode.name}</p>
                <p className="fine-print text-ink-muted-48 mt-1 truncate">{activeNode.role}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2.5 border-t border-hairline">
              <div>
                <div className="flex justify-between items-center fine-print mb-1.5">
                  <span className="text-ink-muted-48 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Contribution</span>
                  <span className="text-primary font-bold flex items-center gap-1">
                    {activeNode.contribution}
                    <TrendingUp className="w-2.5 h-2.5 text-primary" />
                  </span>
                </div>
                <div className="h-1.5 bg-canvas-parchment rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
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
                      stroke="#0066cc"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-80"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex justify-between fine-print mb-1">
                  <span className="text-ink-muted-48 flex items-center gap-1"><Award className="w-3 h-3" /> Quality Index</span>
                  <span className="text-primary font-bold flex items-center gap-1">
                    98.5 <TrendingUp className="w-2.5 h-2.5 text-primary" />
                  </span>
                </div>
                <div className="h-1.5 bg-canvas-parchment rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: barsAnimated ? "98.5%" : 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  />
                </div>
              </div>
              <div className="flex justify-between fine-print pt-1">
                <span className="text-ink-muted-48 flex items-center gap-1"><Compass className="w-3 h-3" /> Focus Index</span>
                <span className="text-primary font-bold flex items-center gap-1">
                  A++ <TrendingUp className="w-2.5 h-2.5 text-primary" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-ink-muted-48 caption italic">Hover any node for telemetry.</p>
        )}
      </motion.div>

      {selectedNode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onMouseDown={() => { setSelectedNode(null); setChatSent(false); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-canvas/95 backdrop-blur-xl border border-hairline rounded-sm p-6 w-[380px] product-shadow max-h-[90vh] overflow-y-auto custom-scrollbar"
            onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-hairline bg-canvas">
                  <img src={selectedNode.avatar} alt="" className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-canvas ${selectedNode.status === "online" ? "bg-primary" : "bg-ink-muted-48"}`} />
                </div>
                <div>
                  <h3 className="body-strong text-ink">{selectedNode.name}</h3>
                  <p className="fine-print text-ink-muted-48 mt-0.5">{selectedNode.role}</p>
                  <span className={`fine-print font-bold mt-1 inline-block ${selectedNode.status === "online" ? "text-primary" : "text-ink-muted-48"}`}>
                    {selectedNode.status === "online" ? "● Online" : "● Away"}
                  </span>
                </div>
              </div>
              <button onClick={() => { setSelectedNode(null); setChatSent(false); }} className="w-7 h-7 rounded-full hover:bg-canvas-parchment flex items-center justify-center text-ink-muted-48 hover:text-ink transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mb-4 px-1">
              <div className="flex items-center gap-2.5 caption text-ink-muted-48">
                <Mail className="w-3.5 h-3.5 text-ink-muted-48" />
                <span>{selectedNode.name.toLowerCase().replace(" ", ".")}@nexus.io</span>
              </div>
              <div className="flex items-center gap-2.5 caption text-ink-muted-48">
                <MapPin className="w-3.5 h-3.5 text-ink-muted-48" />
                <span>Remote · Available</span>
              </div>
            </div>
            <div className="mb-4 pt-3 border-t border-hairline px-1">
              <h4 className="fine-print font-bold uppercase tracking-widest text-ink-muted-48 mb-2.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Connections ({getNodeConnections(selectedNode.id).length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {getNodeConnections(selectedNode.id).map(conn => (
                  <div key={conn.id} className="flex items-center gap-1.5 bg-canvas-parchment rounded-xs px-2.5 py-1.5 border border-hairline">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-canvas">
                      <img src={conn.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="fine-print text-ink font-medium">{conn.name.split(" ")[0]}</span>
                  </div>
                ))}
                {getNodeConnections(selectedNode.id).length === 0 && (
                  <span className="fine-print text-ink-muted-48 italic">No direct connections</span>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-hairline px-1 space-y-2">
              <button onClick={() => { onViewProfile?.(selectedNode); setSelectedNode(null); setChatSent(false); }} className="w-full bg-primary hover:bg-primary-focus text-white caption-strong h-9 rounded-xs transition-all duration-200 cursor-pointer">
                View Full Profile
              </button>
              <button onClick={() => { onMessageUser?.(selectedNode); setSelectedNode(null); }} className="w-full bg-canvas-parchment hover:bg-canvas-parchment border border-hairline h-9 rounded-xs caption text-ink hover:text-ink transition-all duration-200 cursor-pointer">
                Open Chat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}