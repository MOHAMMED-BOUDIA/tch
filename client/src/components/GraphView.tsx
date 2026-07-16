import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, Minus, Maximize, RefreshCw, User, X, Send,
  TrendingUp, Compass, Award, Activity, Mail, Calendar, MapPin, Globe, MessageSquare
} from "lucide-react";
import { GraphNode, GraphConnection } from "../types";

const API = import.meta.env.VITE_API_URL || "";

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
      avatar: "",
      status: "online" as const,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      contribution: `${(85 + Math.random() * 15).toFixed(1)}%`,
    };
  });
}

export default function GraphView({ onMessageUser, onViewProfile }: { onMessageUser?: (name: string) => void; onViewProfile?: (node: GraphNode) => void }) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [connections, setConnections] = useState<GraphConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/graph`)
      .then((r) => r.json())
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
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [messageText, setMessageText] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const lastClickTime = useRef(0);
  const lastClickNodeId = useRef<number | null>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);

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
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
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
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, node: GraphNode) => {
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setActiveNode(node);
    dragStartOffset.current = { x: (e.clientX / zoom) - node.x, y: (e.clientY / zoom) - node.y };
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
  const handleRecenter = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const getNodeConnections = (nodeId: number): GraphNode[] => {
    const connectedIds = connections.filter(c => c.from === nodeId || c.to === nodeId).map(c => c.from === nodeId ? c.to : c.from);
    return nodes.filter(n => connectedIds.includes(n.id));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setChatSent(true);
    setMessageText("");
    setTimeout(() => setChatSent(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-[#FEF3C8]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#c9953a]/10 border border-[#c9953a]/30 flex items-center justify-center mx-auto">
            <RefreshCw className="w-5 h-5 text-[#c9953a] animate-spin" />
          </div>
          <p className="text-xs text-[#8a8a8a]">Mapping connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-hidden relative select-none bg-[#FEF3C8]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={viewportRef}
    >
      <div className="absolute inset-0 subtle-grid pointer-events-none opacity-20"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
      />

      <div className="absolute inset-0 cursor-grab active:cursor-grabbing" onMouseDown={handleViewportMouseDown}>
        <div className="absolute" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0", width: "3000px", height: "3000px" }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c9953a" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#c9953a" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c9953a" stopOpacity="0.05" />
              </linearGradient>
              <filter id="lightningGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="lightningGlowStrong">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;
              const x1 = fromNode.x + 32;
              const y1 = fromNode.y + 32;
              const x2 = toNode.x + 32;
              const y2 = toNode.y + 32;
              const isActiveConnection = activeNode && (conn.from === activeNode.id || conn.to === activeNode.id);
              return (
                <g key={idx}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1.5" className="animate-flow" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9953a" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4,8" />
                  {isActiveConnection && (
                    <>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9953a" strokeWidth="3" strokeOpacity="0.6" filter="url(#lightningGlow)" className="animate-pulse" />
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" filter="url(#lightningGlowStrong)" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => {
            const isActive = activeNode?.id === node.id;
            return (
              <motion.div key={node.id} className="node-card absolute flex flex-col items-center cursor-grab active:cursor-grabbing transition-all z-10"
                style={{ left: node.x, top: node.y }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onMouseEnter={() => setActiveNode(node)}
                onClick={(e) => handleNodeClick(e, node)}
              >
                <div className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex items-center justify-center bg-white text-lg ${
                  isActive ? "border-[#c9953a] shadow-[0_0_20px_rgba(201,149,58,0.3)]" : "border-[#e8e4df] hover:border-[#d5d0c8]"
                }`}>
                  <User className="w-7 h-7 text-[#c9953a]" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f0f] ${node.status === "online" ? "bg-green-500" : "bg-slate-500"}`} />
                </div>
                <span className="mt-2 text-[10px] font-semibold text-[#1a1a1a] text-center leading-tight max-w-[80px] truncate">
                  {node.name.split(" ")[0]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-20">
        <div className="glass-card bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-[#e8e4df] shadow-lg">
          <div className="flex -space-x-2">
            {nodes.slice(0, 3).map((n) => (
              <div key={n.id} className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#f8f6f3] flex items-center justify-center">
                <User className="w-3 h-3 text-[#c9953a]" />
              </div>
            ))}
          </div>
          <span className="text-[11px] font-bold text-[#4a4a4a]">{nodes.length} collaborators</span>
        </div>

        <div className="glass-card bg-white/95 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-[#e8e4df] shadow-2xl w-fit">
          <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center hover:bg-[#f8f6f3] text-[#6a6a6a] hover:text-[#c9953a] rounded-xl transition-all cursor-pointer" title="Zoom In">
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#e8e4df]" />
          <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center hover:bg-[#f8f6f3] text-[#6a6a6a] hover:text-[#c9953a] rounded-xl transition-all cursor-pointer" title="Zoom Out">
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#e8e4df]" />
          <button onClick={handleRecenter} className="w-10 h-10 flex items-center justify-center hover:bg-[#f8f6f3] text-[#6a6a6a] hover:text-[#c9953a] rounded-xl transition-all cursor-pointer" title="Recenter Map">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="absolute top-6 right-6 glass-card bg-white/95 backdrop-blur-xl p-4 rounded-2xl w-64 border border-[#e8e4df] shadow-2xl z-20">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a8a] mb-3.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#c9953a] animate-pulse" /> Active Node Metrics
        </h4>
        {activeNode ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f8f6f3] border border-[#e8e4df] flex items-center justify-center">
                <User className="w-5 h-5 text-[#c9953a]" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1a1a1a] truncate leading-none">{activeNode.name}</p>
                <p className="text-[9px] text-[#6a6a6a] mt-1 truncate">{activeNode.role}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2.5 border-t border-[#e8e4df]">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[#6a6a6a] flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Contribution</span>
                <span className="text-[#c9953a] font-bold">{activeNode.contribution}</span>
              </div>
              <div className="h-1.5 bg-[#f8f6f3] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c9953a] to-[#00b0ff] rounded-full shadow-[0_0_8px_rgba(201,149,58,0.4)]" style={{ width: activeNode.contribution }} />
              </div>
              <div className="flex justify-between text-[10px] mt-2">
                <span className="text-[#6a6a6a] flex items-center gap-1"><Award className="w-3 h-3" /> Quality Index</span>
                <span className="text-green-400 font-bold">98.5</span>
              </div>
              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-[#6a6a6a] flex items-center gap-1"><Compass className="w-3 h-3" /> Focus Index</span>
                <span className="text-[#2d2d2d] font-bold">A++</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[#6a6a6a] text-xs italic">Hover any node for telemetry.</p>
        )}
      </div>

      {selectedNode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onMouseDown={() => { setSelectedNode(null); setChatSent(false); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-xl border border-[#e8e4df] rounded-3xl p-6 w-[380px] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#e8e4df] bg-white flex items-center justify-center">
                  <User className="w-7 h-7 text-[#c9953a]" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f0f] ${selectedNode.status === "online" ? "bg-green-500" : "bg-slate-500"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1a1a1a]">{selectedNode.name}</h3>
                  <p className="text-[10px] text-[#6a6a6a] mt-0.5">{selectedNode.role}</p>
                  <span className={`text-[9px] font-bold mt-1 inline-block ${selectedNode.status === "online" ? "text-green-400" : "text-[#8a8a8a]"}`}>
                    {selectedNode.status === "online" ? "● Online" : "● Away"}
                  </span>
                </div>
              </div>
              <button onClick={() => { setSelectedNode(null); setChatSent(false); }} className="w-7 h-7 rounded-full hover:bg-[#f8f6f3] flex items-center justify-center text-[#8a8a8a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 mb-4 px-1">
              <div className="flex items-center gap-2.5 text-[11px] text-[#6a6a6a]">
                <Mail className="w-3.5 h-3.5 text-[#8a8a8a]" />
                <span>{selectedNode.name.toLowerCase().replace(" ", ".")}@nexus.io</span>
              </div>
              <div className="flex items-center gap-2.5 text-[11px] text-[#6a6a6a]">
                <MapPin className="w-3.5 h-3.5 text-[#8a8a8a]" />
                <span>Remote · Available</span>
              </div>
            </div>
            <div className="mb-4 pt-3 border-t border-[#e8e4df] px-1">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8a8a8a] mb-2.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Connections ({getNodeConnections(selectedNode.id).length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {getNodeConnections(selectedNode.id).map(conn => (
                  <div key={conn.id} className="flex items-center gap-1.5 bg-[#f8f6f3] rounded-lg px-2.5 py-1.5 border border-[#e8e4df]">
                    <div className="w-5 h-5 rounded-md overflow-hidden bg-white flex items-center justify-center">
                      <User className="w-3 h-3 text-[#c9953a]" />
                    </div>
                    <span className="text-[10px] text-[#4a4a4a] font-medium">{conn.name.split(" ")[0]}</span>
                  </div>
                ))}
                {getNodeConnections(selectedNode.id).length === 0 && (
                  <span className="text-[10px] text-[#8a8a8a] italic">No direct connections</span>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-[#e8e4df] px-1">
              <button onClick={() => { onViewProfile?.(selectedNode); setSelectedNode(null); setChatSent(false); }} className="w-full bg-[#c9953a]/10 hover:bg-[#c9953a]/20 border border-[#c9953a]/20 h-9 rounded-xl text-[11px] text-[#c9953a] font-bold transition-all cursor-pointer mb-3">
                View Full Profile
              </button>
              <button onClick={() => { onMessageUser?.(selectedNode.name); setSelectedNode(null); }} className="w-full bg-[#f8f6f3] hover:bg-[#e8e4df] border border-[#e8e4df] h-9 rounded-xl text-[11px] text-[#4a4a4a] hover:text-[#1a1a1a] font-bold transition-all cursor-pointer">
                Open Chat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
