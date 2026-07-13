import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, Minus, Maximize, RefreshCw, User, X, Send,
  TrendingUp, Compass, Award, Activity, Mail, Calendar, MapPin, Globe, MessageSquare
} from "lucide-react";
import NexusImage from "./NexusImage";
import { GraphNode, GraphConnection } from "../types";

// Premium avatars for nodes from screenshots
const ELENA_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBzypB21QDrHktur9BrowqJojmnnp7uKE5qjPq29xPq-zU0ChFQz1e_HDx1OZkpa4VDdoLO-0soTai0ENNn4g-OCQtGng_ul4BynKcioVImWbiOAyDsDaeBC5nK0J7tNqvKnJ0uHtUJbQoSibQITc-HOXKSLPmXnGMyoP9H7jWuEkXl1ohAzX6B6iRgn4EaBOTKKBbvGJ9FeoLztibCOa9ty02Ynj_6sVBI08tDvKLhaT8Zh6LgPqnE8FUrXXGTLjgjW_Gjf0ud9ZmR";
const JORDAN_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuClYXObW99yxYxGY8rMxsl30viLA3pSMvDdIAaAIR5SUSliYUaehdQuOMbp3lEFS7K7lza_8qQZgc4lxCLt1gNbsoQFMU2tEfuWWflJYnxT2Lu3j4VrO8qzZ4Aaoiop2WrYE7yloxPjjEyLlrjUzOv_E66DGTvlWUgG0of4W-Ciicx-ZfUW1eWG_sWuxMliuNwVEsgktVipsvwRGA26Ep5ri0IMFOQoeiLd8nhbVWukMl8LRi47fAA4ifBAaaCpiDEC8AOSCZ6G0tkW";
const AISHA_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuAL8bMpniCoatRk7DcLFZYq2P0EyCBWt_Me_n0ZgOOqhYtBqeF64cyVrbBFBetjRaceVhll0E7tC_2xJcd5SOxBA61nHM9ZSCqNkzEianIz3WqgyBs3LWRR6kRau8C25WLFn5ElEHlDVv9zrLXuGlf72csjVNFTrqJvpAPsyEAJ98UwC5edKC8tCE_xyLIfUR8FbkFywtDpUwNZ_1n8_KfK7nTDIdiwqSrhQpjdehzUWFzt_CNyNzsywB17HaR1BVhpzsFabdBEDRiK";
const MARKUS_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuCJtq9yKbScYV3AMahQJCSnd0yW5ifl3IMC2NPGw3mFY07EqPZ0Bu4nHOFRW5SnSey1DYlxwcy_NwW8qwQvK3acaP3zvD9_kxrivo0QqUzbi-K8dnblULem7SilBfV_Eu5NDk1MRroDbNAKU7Zx5a-cSUwBcmgsybTiXRoY0lJUvoMxERuwuBjGFnGeBwktBtaDvs2iQyUcNGc83XbZwVNog6bhkkwHG7v1a__4Fhb5D9zkZY-Vm6B78sN7gTIK8wi-m_gYbiaNwJqV";
const SARAH_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBfiaayXWFHV5R9zhV4hWbs51C3MTgzcWYrkw-iPlWYJJ6BSzRjhHdKdpOcWQfmYqMKGktQChv2i_gQlWlRTZt1otw6ZhLYnSpnSLYZkN2U6apFnh8UYGoJY44H1mEx8stmG3iYuegb3IDFsaqgv3rShC24Vu0lSvy0mzPH2bzkiuVNo1VEtKiJ4y9EYW3rB0nsPCpep3JTv2dVDYDf4Y9TxNZmCoX7EyFSAatErZXShyS0R7GAXKhtcwc_v0MU6b0cMdhfIjVv6iAl";

export default function GraphView({ onMessageUser, onViewProfile }: { onMessageUser?: (name: string) => void; onViewProfile?: (node: GraphNode) => void }) {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 1, name: "Elena Rodriguez", role: "Lead Product Designer", avatar: ELENA_AVATAR, status: "online", x: 400, y: 350, contribution: "98.2%" },
    { id: 2, name: "Jordan Smith", role: "Senior Dev-Ops", avatar: JORDAN_AVATAR, status: "online", x: 750, y: 250, contribution: "94.8%" },
    { id: 3, name: "Aisha Khan", role: "ML Researcher", avatar: AISHA_AVATAR, status: "away", x: 600, y: 550, contribution: "91.5%" },
    { id: 4, name: "Markus Weber", role: "Chief Operations", avatar: MARKUS_AVATAR, status: "online", x: 250, y: 500, contribution: "89.0%" },
    { id: 5, name: "Sarah Jenkins", role: "Board Director", avatar: SARAH_AVATAR, status: "online", x: 380, y: 150, contribution: "96.4%" },
    { id: 6, name: "David Chen", role: "Full Stack Engineer", avatar: JORDAN_AVATAR, status: "online", x: 900, y: 400, contribution: "92.1%" },
    { id: 7, name: "Maria Lopez", role: "UX Researcher", avatar: ELENA_AVATAR, status: "online", x: 550, y: 700, contribution: "87.3%" },
    { id: 8, name: "James Wilson", role: "Data Analyst", avatar: MARKUS_AVATAR, status: "away", x: 150, y: 300, contribution: "85.6%" },
    { id: 9, name: "Priya Patel", role: "Backend Engineer", avatar: AISHA_AVATAR, status: "online", x: 700, y: 100, contribution: "93.7%" },
    { id: 10, name: "Tom Harrison", role: "QA Lead", avatar: SARAH_AVATAR, status: "online", x: 100, y: 650, contribution: "88.4%" },
    { id: 11, name: "Lisa Kim", role: "Product Manager", avatar: ELENA_AVATAR, status: "online", x: 950, y: 500, contribution: "95.1%" },
    { id: 12, name: "Omar Farouk", role: "Security Engineer", avatar: MARKUS_AVATAR, status: "away", x: 300, y: 80, contribution: "90.2%" },
    { id: 13, name: "Emma Thompson", role: "Frontend Developer", avatar: SARAH_AVATAR, status: "online", x: 800, y: 620, contribution: "91.8%" },
    { id: 14, name: "Carlos Mendez", role: "DevOps Engineer", avatar: JORDAN_AVATAR, status: "online", x: 480, y: 200, contribution: "86.5%" },
    { id: 15, name: "Yuki Tanaka", role: "AI Engineer", avatar: AISHA_AVATAR, status: "online", x: 680, y: 780, contribution: "94.2%" },
    { id: 16, name: "Rachel Adams", role: "Marketing Lead", avatar: ELENA_AVATAR, status: "away", x: 100, y: 200, contribution: "82.9%" },
    { id: 17, name: "Daniel Lee", role: "Mobile Developer", avatar: JORDAN_AVATAR, status: "online", x: 1050, y: 300, contribution: "89.7%" },
    { id: 18, name: "Fatima Al-Rashid", role: "Data Scientist", avatar: AISHA_AVATAR, status: "online", x: 500, y: 900, contribution: "95.3%" },
    { id: 19, name: "Alex Brown", role: "Technical Writer", avatar: MARKUS_AVATAR, status: "away", x: 200, y: 750, contribution: "80.1%" },
    { id: 20, name: "Hannah Müller", role: "UI Designer", avatar: SARAH_AVATAR, status: "online", x: 850, y: 450, contribution: "90.8%" },
  ]);

  const connections: GraphConnection[] = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 4, to: 5 },
    { from: 3, to: 2 },
    { from: 6, to: 2 },
    { from: 6, to: 11 },
    { from: 7, to: 3 },
    { from: 7, to: 15 },
    { from: 8, to: 4 },
    { from: 8, to: 16 },
    { from: 9, to: 5 },
    { from: 9, to: 14 },
    { from: 10, to: 7 },
    { from: 10, to: 19 },
    { from: 11, to: 17 },
    { from: 12, to: 5 },
    { from: 12, to: 9 },
    { from: 13, to: 6 },
    { from: 13, to: 20 },
    { from: 14, to: 1 },
    { from: 15, to: 18 },
    { from: 16, to: 4 },
    { from: 17, to: 11 },
    { from: 18, to: 7 },
    { from: 19, to: 10 },
    { from: 20, to: 1 },
  ];

  // Pan and Zoom coordinates
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Hovered node details
  const [activeNode, setActiveNode] = useState<GraphNode | null>(nodes[0]);
  
  // Dragging single node
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  
  // Double-click detail
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [messageText, setMessageText] = useState("");
  const [chatSent, setChatSent] = useState(false);
  const lastClickTime = useRef(0);
  const lastClickNodeId = useRef<number | null>(null);

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
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Pan workspace handlers
  const handleViewportMouseDown = (e: React.MouseEvent) => {
    // Prevent triggering pan if node drag has initiated
    if (draggingNodeId !== null || (e.target as HTMLElement).closest(".node-card")) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingNodeId !== null) {
      // Move active node relative to zoom ratio
      const rect = viewportRef.current?.getBoundingClientRect();
      if (rect) {
        // Calculate new coordinate accounting for zoom and pan offsets
        const clientXOnCanvas = (e.clientX - rect.left - pan.x) / zoom;
        const clientYOnCanvas = (e.clientY - rect.top - pan.y) / zoom;

        setNodes(prev => prev.map(node => {
          if (node.id === draggingNodeId) {
            return {
              ...node,
              x: Math.round(clientXOnCanvas - dragStartOffset.current.x),
              y: Math.round(clientYOnCanvas - dragStartOffset.current.y)
            };
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
    
    // Position of cursor relative to node coordinates
    dragStartOffset.current = {
      x: (e.clientX / zoom) - node.x,
      y: (e.clientY / zoom) - node.y
    };
  };

  // Zoom Operations
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));
  const handleRecenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeConnections = (nodeId: number): GraphNode[] => {
    const connectedIds = connections
      .filter(c => c.from === nodeId || c.to === nodeId)
      .map(c => c.from === nodeId ? c.to : c.from);
    return nodes.filter(n => connectedIds.includes(n.id));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setChatSent(true);
    setMessageText("");
    setTimeout(() => setChatSent(false), 2000);
  };

  return (
    <div 
      className="flex-1 h-full overflow-hidden relative select-none bg-[#050505]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={viewportRef}
    >
      {/* Subtle radial grid mapping the viewport */}
      <div 
        className="absolute inset-0 subtle-grid pointer-events-none opacity-20"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0"
        }}
      />

      {/* Main Draggable Workspace Area */}
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleViewportMouseDown}
      >
        <div 
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: "3000px",
            height: "3000px"
          }}
        >
          {/* Connecting lines rendered via SVG in the background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#00f2ff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.05" />
              </linearGradient>
              <filter id="lightningGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="lightningGlowStrong">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              // Connect from center of icon nodes (64px wide, ~80px tall including name)
              const x1 = fromNode.x + 32;
              const y1 = fromNode.y + 32;
              const x2 = toNode.x + 32;
              const y2 = toNode.y + 32;

              const isActiveConnection = activeNode && (conn.from === activeNode.id || conn.to === activeNode.id);

              return (
                <g key={idx}>
                  {/* Base subtle line */}
                  <line 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="url(#lineGrad)" strokeWidth="1.5"
                    className="animate-flow" 
                  />
                  <line 
                    x1={x1} y1={y1} x2={x2} y2={y2} 
                    stroke="#00f2ff" strokeWidth="1"
                    strokeOpacity="0.15" strokeDasharray="4,8"
                  />
                  {/* Lightning glow for active connections */}
                  {isActiveConnection && (
                    <>
                      <line
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#00f2ff" strokeWidth="3"
                        strokeOpacity="0.6" filter="url(#lightningGlow)"
                        className="animate-pulse"
                      />
                      <line
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke="#ffffff" strokeWidth="1.5"
                        strokeOpacity="0.4" filter="url(#lightningGlowStrong)"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Dynamic Nodes Mapping - Icon with name underneath */}
          {nodes.map((node) => {
            const isActive = activeNode?.id === node.id;
            return (
              <motion.div
                key={node.id}
                className="node-card absolute flex flex-col items-center cursor-grab active:cursor-grabbing transition-all z-10"
                style={{
                  left: node.x,
                  top: node.y,
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onMouseEnter={() => setActiveNode(node)}
                onClick={(e) => handleNodeClick(e, node)}
              >
                <div
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    isActive ? "border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.3)]" : "border-[#333] hover:border-[#555]"
                  }`}
                  style={{
                    background: "#0f0f0f",
                  }}
                >
                  <NexusImage src={node.avatar} alt={node.name} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f0f] ${
                    node.status === "online" ? "bg-green-500" : "bg-slate-500"
                  }`} />
                </div>
                <span className="mt-2 text-[10px] font-semibold text-white text-center leading-tight max-w-[80px] truncate">
                  {node.name.split(" ")[0]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas UI Controls Overlays */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-3 z-20">
        <div className="glass-card bg-[#0f0f0f]/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 border border-[#222] shadow-lg">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#161616] overflow-hidden">
              <NexusImage src={ELENA_AVATAR} alt="Elena" />
            </div>
            <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#161616] overflow-hidden">
              <NexusImage src={JORDAN_AVATAR} alt="Jordan" />
            </div>
            <div className="w-6 h-6 rounded-full border border-[#0f0f0f] bg-[#161616] overflow-hidden">
              <NexusImage src={SARAH_AVATAR} alt="Sarah" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-300">12 active collaborators</span>
        </div>

        <div className="glass-card bg-[#0f0f0f]/95 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1 border border-[#222] shadow-2xl w-fit">
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#161616] text-slate-400 hover:text-[#00f2ff] rounded-xl transition-all cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#222]" />
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#161616] text-slate-400 hover:text-[#00f2ff] rounded-xl transition-all cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#222]" />
          <button 
            onClick={handleRecenter}
            className="w-10 h-10 flex items-center justify-center hover:bg-[#161616] text-slate-400 hover:text-[#00f2ff] rounded-xl transition-all cursor-pointer"
            title="Recenter Map"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Node Statistics Dashboard on the right */}
      <div className="absolute top-6 right-6 glass-card bg-[#0f0f0f]/95 backdrop-blur-xl p-4 rounded-2xl w-64 border border-[#222] shadow-2xl z-20">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3.5 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00f2ff] animate-pulse" /> Active Node Metrics
        </h4>
        {activeNode ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#161616] border border-[#222]">
                <NexusImage src={activeNode.avatar} alt={activeNode.name} />
              </div>
              <div>
                <p className="font-bold text-xs text-white truncate leading-none">{activeNode.name}</p>
                <p className="text-[9px] text-slate-400 mt-1 truncate">{activeNode.role}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2.5 border-t border-[#222]">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Contribution</span>
                <span className="text-[#00f2ff] font-bold">{activeNode.contribution}</span>
              </div>
              <div className="h-1.5 bg-[#161616] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00f2ff] to-[#00b0ff] rounded-full shadow-[0_0_8px_rgba(0,242,255,0.4)]" 
                  style={{ width: activeNode.contribution }}
                />
              </div>

              <div className="flex justify-between text-[10px] mt-2">
                <span className="text-slate-400 flex items-center gap-1"><Award className="w-3 h-3" /> Quality Index</span>
                <span className="text-green-400 font-bold">98.5</span>
              </div>

              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-slate-400 flex items-center gap-1"><Compass className="w-3 h-3" /> Focus Index</span>
                <span className="text-slate-200 font-bold">A++</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-xs italic">Hover or click any team node card to fetch precision telemetry details.</p>
        )}
      </div>

      {/* Double-click detail panel */}
      {selectedNode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onMouseDown={() => { setSelectedNode(null); setChatSent(false); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0f0f0f]/95 backdrop-blur-xl border border-[#222] rounded-3xl p-6 w-[380px] shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#333]">
                  <NexusImage src={selectedNode.avatar} alt={selectedNode.name} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f0f] ${
                    selectedNode.status === "online" ? "bg-green-500" : "bg-slate-500"
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedNode.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedNode.role}</p>
                  <span className={`text-[9px] font-bold mt-1 inline-block ${
                    selectedNode.status === "online" ? "text-green-400" : "text-slate-500"
                  }`}>
                    {selectedNode.status === "online" ? "● Online" : "● Away"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedNode(null); setChatSent(false); }}
                className="w-7 h-7 rounded-full hover:bg-[#161616] flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact view */}
              <>
                {/* Info */}
                <div className="space-y-3 mb-4 px-1">
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedNode.name.toLowerCase().replace(" ", ".")}@nexus.io</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Remote · {selectedNode.status === "online" ? "Available" : "In a meeting"}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Joined March 2024 · 15 projects</span>
                  </div>
                </div>

                {/* Connections */}
                <div className="mb-4 pt-3 border-t border-[#222] px-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> Connections ({getNodeConnections(selectedNode.id).length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getNodeConnections(selectedNode.id).map(conn => (
                      <div key={conn.id} className="flex items-center gap-1.5 bg-[#161616] rounded-lg px-2.5 py-1.5 border border-[#222]">
                        <div className="w-5 h-5 rounded-md overflow-hidden">
                          <NexusImage src={conn.avatar} alt={conn.name} />
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium">{conn.name.split(" ")[0]}</span>
                      </div>
                    ))}
                    {getNodeConnections(selectedNode.id).length === 0 && (
                      <span className="text-[10px] text-slate-500 italic">No direct connections</span>
                    )}
                  </div>
                </div>

                {/* Contribution */}
                <div className="space-y-2.5 pt-3 border-t border-[#222] px-1 mb-4">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Contribution</span>
                    <span className="text-[#00f2ff] font-bold">{selectedNode.contribution}</span>
                  </div>
                  <div className="h-1.5 bg-[#161616] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00f2ff] to-[#00b0ff] rounded-full" style={{ width: selectedNode.contribution }} />
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="pt-3 border-t border-[#222] px-1">
                  <button
                    onClick={() => { onViewProfile?.(selectedNode); setSelectedNode(null); setChatSent(false); }}
                    className="w-full bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 border border-[#00f2ff]/20 h-9 rounded-xl text-[11px] text-[#00f2ff] font-bold transition-all cursor-pointer mb-3"
                  >
                    View Full Profile
                  </button>
                </div>

                {/* Send Message */}
                <div className="px-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" /> Private Message
                  </h4>
                  {chatSent ? (
                    <p className="text-[11px] text-green-400 font-semibold">✓ Message sent to {selectedNode.name.split(" ")[0]}!</p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={`Message ${selectedNode.name.split(" ")[0]}...`}
                        className="flex-1 bg-[#161616] h-9 px-3 rounded-xl border border-[#222] text-[11px] text-white placeholder:text-slate-500 focus:ring-1 focus:ring-[#00f2ff] focus:border-[#00f2ff] transition-all outline-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="w-9 h-9 rounded-xl bg-[#00f2ff] hover:bg-[#00f2ff]/90 flex items-center justify-center text-black transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => { onMessageUser?.(selectedNode.name); setSelectedNode(null); }}
                    className="w-full mt-2 bg-[#161616] hover:bg-[#1f1f1f] border border-[#222] h-8 rounded-xl text-[10px] text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
                  >
                    Open Full Chat
                  </button>
                </div>
              </>
            </motion.div>
        </div>
      )}
    </div>
  );
}
