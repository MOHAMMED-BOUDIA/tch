"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Bolt, Circle, ArrowRight } from "lucide-react";
import Footer from "@/components/ui/Footer";
import SectionTile from "@/components/home/SectionTile";
import GraphPreview from "@/components/home/GraphPreview";
import ChatPreview from "@/components/home/ChatPreview";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import AnalyticsPreview from "@/components/home/AnalyticsPreview";
import AdminPreview from "@/components/home/AdminPreview";
import DesignPreview from "@/components/home/DesignPreview";

function PrimaryPill({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-[22px] py-[11px] bg-primary text-white body rounded-pill transition-all duration-200 hover:bg-primary-focus active:scale-[0.95] cursor-pointer select-none"
    >
      {children}
    </button>
  );
}

function GhostPill({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-[22px] py-[11px] bg-transparent text-primary body rounded-pill border border-primary transition-all duration-200 active:scale-[0.95] cursor-pointer select-none"
    >
      {children}
    </button>
  );
}

function HomeFooter() {
  return (
    <footer className="bg-canvas-parchment">
      <div className="max-w-[1068px] mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bolt className="w-4 h-4 text-primary" />
            <span className="fine-print text-ink-muted-48">Nexus Pro</span>
          </div>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="fine-print text-ink-muted-48 hover:text-ink transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p className="fine-print text-ink-muted-48">
            &copy; {new Date().getFullYear()} Nexus Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 h-11 bg-surface-black z-50 flex items-center justify-between px-6 select-none">
        <div className="flex items-center gap-2">
          <Bolt className="w-4 h-4 text-primary-on-dark" />
          <span className="nav-link font-semibold text-body-on-dark tracking-normal">Nexus</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="nav-link text-body-on-dark/70 hover:text-body-on-dark px-3 py-1.5 rounded-xs transition-colors"
          >
            Log in
          </a>
          <a
            href="/login"
            className="nav-link font-semibold text-white bg-primary hover:bg-primary-focus px-4 py-1.5 rounded-pill transition-all duration-200 active:scale-[0.95]"
          >
            Get started
          </a>
        </div>
      </nav>

      <div className="pt-11" />

      <SectionTile background="light">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="hero-display text-ink max-w-[760px] mx-auto leading-[1.07]">
            Every message builds a relationship.
          </h1>
          <p className="lead text-ink-muted-80 mt-4 max-w-[640px] mx-auto">
            Visualize your team&apos;s interactions, track collaboration flows, and manage your network in one
            unified platform.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/network")}>Open App</PrimaryPill>
            <GhostPill onClick={() => {}}>Explore features</GhostPill>
          </div>
        </motion.div>
      </SectionTile>

      <SectionTile background="dark">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-lg text-body-on-dark max-w-[640px] mx-auto">
            Knowledge Graph
          </h2>
          <p className="lead text-body-muted mt-3 max-w-[560px] mx-auto">
            Auto-built from messages. Every node is a teammate, every edge a collaboration.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/network")}>Explore the Graph</PrimaryPill>
            <GhostPill onClick={() => {}}>Learn more</GhostPill>
          </div>
          <div className="mt-16">
            <GraphPreview dark />
          </div>
        </motion.div>
      </SectionTile>

      <SectionTile background="light">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-lg text-ink max-w-[600px] mx-auto">
            Real-time Chat
          </h2>
          <p className="lead text-ink-muted-80 mt-3 max-w-[560px] mx-auto">
            Channels, DMs, typing indicators, read receipts — powered by Socket.IO.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/messages")}>Open Chat</PrimaryPill>
            <GhostPill onClick={() => {}}>View features</GhostPill>
          </div>
          <div className="mt-16">
            <ChatPreview />
          </div>
        </motion.div>
      </SectionTile>

      <SectionTile background="parchment">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-lg text-ink max-w-[560px] mx-auto">
            Project Management
          </h2>
          <p className="lead text-ink-muted-80 mt-3 max-w-[540px] mx-auto">
            Create, edit, publish, and track your team&apos;s projects with status badges and scores.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/projects")}>View Projects</PrimaryPill>
            <GhostPill onClick={() => {}}>Learn more</GhostPill>
          </div>
          <div className="mt-16">
            <ProjectsPreview />
          </div>
        </motion.div>
      </SectionTile>

      <SectionTile background="dark">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-lg text-body-on-dark max-w-[600px] mx-auto">
            Platform Analytics
          </h2>
          <p className="lead text-body-muted mt-3 max-w-[540px] mx-auto">
            Weekly activity heatmaps, trending metrics, and collaboration velocity at a glance.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/analytics")}>View Analytics</PrimaryPill>
            <GhostPill onClick={() => {}}>Learn more</GhostPill>
          </div>
          <div className="mt-16">
            <AnalyticsPreview />
          </div>
        </motion.div>
      </SectionTile>

      <SectionTile background="light">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="display-lg text-ink max-w-[540px] mx-auto">
            Start building your network.
          </h2>
          <p className="lead text-ink-muted-80 mt-3 max-w-[480px] mx-auto">
            Join teams already using Nexus to visualize and grow their collaboration.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <PrimaryPill onClick={() => router.push("/dashboard/network")}>
              Open Nexus <ArrowRight className="w-4 h-4 ml-1.5" />
            </PrimaryPill>
          </div>
          <div className="mt-4">
            <a
              href="/login"
              className="body text-primary hover:underline"
            >
              Already have an account? Sign in &rarr;
            </a>
          </div>
        </motion.div>
      </SectionTile>

      <HomeFooter />
    </main>
  );
}
