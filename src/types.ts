export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  avatar: string;
  role: "user" | "assistant";
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
}

export interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  active?: boolean;
}

export interface GraphNode {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "away" | "offline";
  x: number;
  y: number;
  contribution: string;
}

export interface GraphConnection {
  from: number;
  to: number;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  description: string;
  contributorsCount: number;
  performanceScore?: string;
}

export interface Note {
  id: string;
  title: string;
  updatedAt: string;
  status: string;
}

export interface Activity {
  id: string;
  type: "push" | "endorse" | "publish";
  text: string;
  time: string;
  color: string;
}

export interface EventSync {
  id: string;
  title: string;
  time: string;
  location: string;
  day: number;
  month: string;
}
