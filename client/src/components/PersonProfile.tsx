import React from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, MapPin, Mail, Calendar, Briefcase, GraduationCap, Globe,
  MessageSquare, ThumbsUp, Share2, Award, Users, Star, Clock, ExternalLink
} from "lucide-react";
import NexusImage from "./NexusImage";
import { GraphNode } from "../types";

interface PersonProfileProps {
  node: GraphNode;
  connections: { id: number; name: string; role: string; avatar: string }[];
  onBack: () => void;
  onMessage: () => void;
}

const COVER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbOXClRFK603CvCqYdwIAIt2IM-474_mWeg0-EiR1cbVUvG_sEQxEuJx7LYYy6NXk2QLUKgEgcut9ISVjMwRghcikUIzimJbh5yOVlW0inCz9kT1jA0kl92Q77KQsqSQQl-uj6VIiVq65pCuv3uIaBifHNmlfXmIEBjG_srm_qJ5PhxKNDCs7E8x1hb7A3AFuE960Awqx8cZ8514Nu_YD-nBmmHVLHGjZSOYlGOGiMrDlufREUfaxd77NaHYi74hXf9e0lo2y5uFhv",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuqQ2Xf8gK2mTGiMhmHR-R4BWSskmOX93AduHxpqAgXZD7z1mVju7pqYhgu6EZ7obeL5ABhDERhYYnhrmqJjE1G10yHyS9pEy3QjQVw8s4xdaWhSFVKuKiwJs810eY8HUkti0QX4p_3PkkZwVcxx3wx5OZ9B7Ug2oVjFPlu4Q2CefRf2alzwlgyRN_AsMEbGWjdkj_RyJy0NxXKVWjcAQj4Hy0iKvWA8pOh8BdyHJaO0rO5lB9oEEx2WpX-ggArLvPksOgp1QaGD0eV",
];

const EXPERIENCES = [
  { company: "Nexus Technologies", role: "Current Role", period: "Jan 2022 - Present · 3 yrs", desc: "Leading core platform architecture and development. Driving innovation across multiple teams and delivering high-impact solutions at scale." },
  { company: "InnovateTech Corp", role: "Senior Position", period: "Mar 2019 - Dec 2021 · 2 yrs 9 mo", desc: "Led cross-functional teams in building enterprise-grade applications. Improved system performance by 40% and reduced deployment time by 60%." },
  { company: "TechStartup Labs", role: "Junior Role", period: "Jun 2017 - Feb 2019 · 1 yr 8 mo", desc: "Started career building full-stack applications. Contributed to 12+ shipped products and established best engineering practices." },
];

const PROJECTS = [
  { name: "Nexus Core Platform", role: "Lead Architect", desc: "Architected and built the core platform serving 10M+ users with 99.99% uptime", status: "Active", team: "12 members" },
  { name: "AI Analytics Dashboard", role: "Tech Lead", desc: "Built real-time analytics engine with ML-powered predictive insights", status: "Completed", team: "8 members" },
  { name: "Cloud Migration v2.0", role: "Lead Engineer", desc: "Led full migration from legacy monolith to cloud-native microservices", status: "Completed", team: "15 members" },
  { name: "Mobile Design System", role: "Contributor", desc: "Created reusable component library used across 5 product teams", status: "Completed", team: "6 members" },
];

const SKILLS = [
  { name: "React", endorsements: 42 },
  { name: "TypeScript", endorsements: 38 },
  { name: "Node.js", endorsements: 35 },
  { name: "Python", endorsements: 28 },
  { name: "Docker", endorsements: 25 },
  { name: "Kubernetes", endorsements: 22 },
  { name: "GraphQL", endorsements: 20 },
  { name: "AWS", endorsements: 18 },
  { name: "System Design", endorsements: 30 },
  { name: "Team Leadership", endorsements: 33 },
];

const EDUCATION = [
  { school: "MIT", degree: "M.S. Computer Science", year: "2015 - 2017", logo: "🎓" },
  { school: "Stanford University", degree: "B.S. Computer Engineering", year: "2011 - 2015", logo: "🎓" },
];

export default function PersonProfile({ node, connections, onBack, onMessage }: PersonProfileProps) {
  const coverImage = COVER_IMAGES[node.id % COVER_IMAGES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-[#FEF3C8] overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#e8e4df] bg-white shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#6a6a6a] hover:text-[#1a1a1a] text-xs transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onMessage} className="bg-[#c9953a] hover:bg-[#c9953a]/90 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </button>
          <button className="w-8 h-8 rounded-xl hover:bg-[#f8f6f3] flex items-center justify-center text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-xl hover:bg-[#f8f6f3] flex items-center justify-center text-[#6a6a6a] hover:text-[#1a1a1a] transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Cover + Profile Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-[#c9953a]/20 via-[#e8e4df] to-[#c9953a]/10 overflow-hidden">
            <NexusImage src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-40" />
          </div>
          <div className="absolute -bottom-16 left-8 flex items-end gap-5">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-[#FEF3C8] shadow-2xl bg-white">
              <NexusImage src={node.avatar} alt={node.name} />
              <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-[3px] border-[#FEF3C8] ${
                node.status === "online" ? "bg-green-500" : "bg-[#8a8a8a]"
              }`} />
            </div>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 px-8 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">{node.name}</h1>
              <p className="text-sm text-[#4a4a4a] mt-0.5">{node.role}</p>
              <div className="flex items-center gap-3 mt-2.5 text-[11px] text-[#6a6a6a]">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> San Francisco, CA</span>
                <span className="w-1 h-1 rounded-full bg-[#6a6a6a]" />
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {connections.length} connections</span>
                <span className="w-1 h-1 rounded-full bg-[#6a6a6a]" />
                <span className={`font-bold ${node.status === "online" ? "text-green-600" : "text-[#8a8a8a]"}`}>
                  {node.status === "online" ? "● Available" : "● Away"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8a8a8a]">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {node.name.toLowerCase().replace(" ", ".")}@nexus.io</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined Mar 2024</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onMessage} className="bg-[#c9953a] hover:bg-[#c9953a]/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#c9953a]/10">
                <MessageSquare className="w-4 h-4" /> Contact
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-6 px-8 pb-8">
          {/* Left Column */}
          <div className="space-y-5">
            {/* About */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-3">About</h2>
              <p className="text-xs text-[#4a4a4a] leading-relaxed">
                {node.name.split(" ")[0]} is a results-driven {node.role.toLowerCase()} with 7+ years of experience
                designing and building scalable distributed systems. Passionate about leveraging cutting-edge technology
                to solve complex problems, {node.name.split(" ")[0]} has led 15+ major projects from conception to production,
                consistently delivering measurable business impact. Recognized as a top contributor with a {node.contribution}
                performance rating. Outside of work, {node.name.split(" ")[0]} mentors junior engineers and contributes to open-source projects.
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#c9953a]" /> Experience
                </h2>
                <button className="text-[10px] text-[#c9953a] font-bold hover:underline cursor-pointer">Show all 5 →</button>
              </div>
              <div className="space-y-5">
                {EXPERIENCES.map((exp, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f6f3] border border-[#e8e4df] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#c9953a]/30 transition-colors">
                      <Briefcase className="w-5 h-5 text-[#6a6a6a] group-hover:text-[#c9953a] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[13px] font-bold text-[#1a1a1a]">{exp.company}</p>
                          <p className="text-[11px] text-[#4a4a4a] mt-0.5">{exp.role}</p>
                        </div>
                        <span className="text-[10px] text-[#8a8a8a] shrink-0">{exp.period}</span>
                      </div>
                      <p className="text-[11px] text-[#6a6a6a] mt-1.5 leading-relaxed">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#c9953a]" /> Projects
                </h2>
                <button className="text-[10px] text-[#c9953a] font-bold hover:underline cursor-pointer">Show all →</button>
              </div>
              <div className="space-y-3">
                {PROJECTS.map((project, i) => (
                  <div key={i} className="bg-[#f8f6f3] rounded-xl p-4 border border-[#e8e4df] hover:border-[#d5d0c8] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[12px] font-bold text-[#1a1a1a]">{project.name}</p>
                        <p className="text-[10px] text-[#6a6a6a]">{project.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-[#8a8a8a] flex items-center gap-1"><Users className="w-3 h-3" /> {project.team}</span>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                          project.status === "Active" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-[#8a8a8a]/10 text-[#6a6a6a] border border-[#8a8a8a]/20"
                        }`}>{project.status}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-[#8a8a8a] leading-relaxed">{project.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Stats Card */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <h2 className="text-sm font-bold text-[#1a1a1a] mb-4">Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Award, label: "Contribution", value: node.contribution, color: "text-[#c9953a]" },
                  { icon: Star, label: "Quality Index", value: "98.5", color: "text-green-600" },
                  { icon: Users, label: "Projects", value: "15", color: "text-[#c9953a]" },
                  { icon: Clock, label: "Tenure", value: "3 yrs", color: "text-[#c9953a]" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#f8f6f3] rounded-xl p-3.5 border border-[#e8e4df] text-center">
                    <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1.5`} />
                    <p className="text-lg font-bold text-[#1a1a1a]">{stat.value}</p>
                    <p className="text-[8px] text-[#8a8a8a] uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#c9953a]" /> Skills
                </h2>
                <button className="text-[10px] text-[#c9953a] font-bold hover:underline cursor-pointer">Show all →</button>
              </div>
              <div className="space-y-2.5">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between group">
                    <span className="text-[11px] text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">{skill.name}</span>
                    <span className="text-[9px] text-[#8a8a8a] flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {skill.endorsements}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-[#c9953a]" /> Education
              </h2>
              <div className="space-y-4">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f8f6f3] border border-[#e8e4df] flex items-center justify-center text-lg shrink-0">
                      {edu.logo}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#1a1a1a]">{edu.school}</p>
                      <p className="text-[10px] text-[#6a6a6a]">{edu.degree}</p>
                      <p className="text-[9px] text-[#8a8a8a] mt-0.5">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connections */}
            <div className="bg-white border border-[#e8e4df] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c9953a]" /> Connections
                </h2>
              </div>
              <div className="space-y-2.5">
                {connections.slice(0, 5).map((conn) => (
                  <div key={conn.id} className="flex items-center gap-2.5 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#e8e4df]">
                      <NexusImage src={conn.avatar} alt={conn.name} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#1a1a1a] group-hover:text-[#c9953a] transition-colors">{conn.name}</p>
                      <p className="text-[9px] text-[#8a8a8a]">{conn.role}</p>
                    </div>
                  </div>
                ))}
                {connections.length > 5 && (
                  <button className="text-[10px] text-[#c9953a] font-bold hover:underline mt-1 block cursor-pointer">
                    +{connections.length - 5} more connections
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
