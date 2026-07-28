import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../lib/models/User";
import Project from "../lib/models/Project";
import Group from "../lib/models/Group";
import Message from "../lib/models/Message";
import Notification from "../lib/models/Notification";
import Note from "../lib/models/Note";
import ActivityLog from "../lib/models/ActivityLog";
import PlatformSetting from "../lib/models/PlatformSetting";

const envPath = path.resolve(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexus";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("[Seed] Connected to MongoDB");

  // Clean existing data
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Group.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({}),
    Note.deleteMany({}),
    ActivityLog.deleteMany({}),
    PlatformSetting.deleteMany({}),
  ]);
  console.log("[Seed] Cleared existing data");

  const pw = bcrypt.hashSync("password123", 10);
  const adminPw = bcrypt.hashSync("admin123", 10);

  // ─── Users ───
  const users = await User.insertMany([
    { username: "admin", email: "admin@nexus.local", password: adminPw, role: "admin", status: "active", name: "Admin", title: "Platform Administrator", bio: "Managing the Nexus platform and ensuring smooth operations.", location: "San Francisco, CA", website: "https://nexus.local", coverPic: "" },
    { username: "sarahchen", email: "sarah@nexus.local", password: pw, role: "coordinator", status: "active", name: "Sarah Chen", title: "Senior Product Manager", bio: "Leading product strategy and cross-team collaboration.", location: "New York, NY", website: "https://sarahchen.dev", coverPic: "" },
    { username: "alexrivera", email: "alex@nexus.local", password: pw, role: "user", status: "active", name: "Alex Rivera", title: "Full-Stack Developer", bio: "Building scalable web applications with React and Node.js.", location: "Austin, TX", coverPic: "" },
    { username: "jordansmith", email: "jordan@nexus.local", password: pw, role: "user", status: "active", name: "Jordan Smith", title: "UX Designer", bio: "Crafting intuitive user experiences and design systems.", location: "Seattle, WA", coverPic: "" },
    { username: "elenarodriguez", email: "elena@nexus.local", password: pw, role: "user", status: "active", name: "Elena Rodriguez", title: "Data Scientist", bio: "Turning data into actionable insights with ML and analytics.", location: "Chicago, IL", coverPic: "" },
    { username: "markjohnson", email: "mark@nexus.local", password: pw, role: "user", status: "active", name: "Mark Johnson", title: "DevOps Engineer", bio: "Automating infrastructure and optimizing deployment pipelines.", location: "Denver, CO", coverPic: "" },
    { username: "nexusbot", email: "bot@nexus.local", password: pw, role: "bot", status: "active", name: "Nexus Bot", title: "AI Assistant", bio: "Automating workflows and providing intelligent recommendations.", coverPic: "" },
    { username: "tinawong", email: "tina@nexus.local", password: pw, role: "user", status: "active", name: "Tina Wong", title: "Frontend Developer", bio: "Creating beautiful, performant user interfaces with React.", location: "Los Angeles, CA", coverPic: "" },
    { username: "jameswilson", email: "james@nexus.local", password: pw, role: "user", status: "active", name: "James Wilson", title: "Backend Engineer", bio: "Designing robust APIs and microservices architectures.", location: "Portland, OR", coverPic: "" },
    { username: "priyapatel", email: "priya@nexus.local", password: pw, role: "coordinator", status: "active", name: "Priya Patel", title: "Engineering Manager", bio: "Leading engineering teams and driving technical excellence.", location: "Boston, MA", coverPic: "" },
  ]);
  console.log(`[Seed] Created ${users.length} users`);

  const [admin, sarah, alex, jordan, elena, mark, nexusBot, tina, james, priya] = users;

  // ─── Projects ───
  const projects = await Project.insertMany([
    { name: "Nexus Core Platform", description: "The central collaboration hub for teams to manage projects, communicate, and track progress in real-time.", status: "published", image: "", link: "https://nexus.local", contributorsCount: 8, performanceScore: "98", createdBy: admin._id },
    { name: "AI Recommendation Engine", description: "Machine learning system that analyzes user behavior to provide intelligent project and connection recommendations.", status: "published", image: "", link: "", contributorsCount: 4, performanceScore: "87", createdBy: elena._id },
    { name: "Real-Time Chat Infrastructure", description: "WebSocket-based messaging system supporting real-time communication, file sharing, and message history.", status: "published", image: "", link: "", contributorsCount: 3, performanceScore: "94", createdBy: alex._id },
    { name: "Design System v2", description: "Comprehensive component library and design tokens powering consistent UI across all Nexus products.", status: "published", image: "", link: "", contributorsCount: 5, performanceScore: "91", createdBy: jordan._id },
    { name: "DevOps Pipeline Automation", description: "Automated CI/CD pipeline with container orchestration, monitoring, and zero-downtime deployments.", status: "published", image: "", link: "", contributorsCount: 3, performanceScore: "85", createdBy: mark._id },
    { name: "Mobile Companion App", description: "React Native mobile application for on-the-go project management and team communication.", status: "draft", image: "", link: "", contributorsCount: 2, createdBy: tina._id },
    { name: "Analytics Dashboard", description: "Real-time analytics and visualization dashboard for tracking project metrics and team performance.", status: "published", image: "", link: "", contributorsCount: 4, performanceScore: "79", createdBy: priya._id },
    { name: "User Research Portal", description: "Centralized platform for conducting and managing user research studies, surveys, and feedback collection.", status: "draft", image: "", link: "", contributorsCount: 2, createdBy: sarah._id },
  ]);
  console.log(`[Seed] Created ${projects.length} projects`);

  // ─── Groups ───
  const groups = await Group.insertMany([
    { name: "Engineering Team", members: [alex._id, james._id, tina._id, mark._id] },
    { name: "Product & Design", members: [sarah._id, jordan._id] },
    { name: "Data Science Guild", members: [elena._id, priya._id] },
    { name: "General", members: users.filter(u => u.role !== "bot").map(u => u._id) },
    { name: "Leadership", members: [admin._id, sarah._id, priya._id] },
  ]);
  console.log(`[Seed] Created ${groups.length} groups`);

  const [engGroup, pdGroup, dsGroup, generalGroup, leadershipGroup] = groups;

  // ─── Messages ───
  const now = new Date();
  const messages = await Message.insertMany([
    { senderId: alex._id, receiverId: jordan._id, content: "Hey Jordan, the design system components are looking great! Any ETA on the button variants?", createdAt: new Date(now.getTime() - 3600000) },
    { senderId: jordan._id, receiverId: alex._id, content: "Thanks Alex! I should have them ready by end of day. Just polishing the hover states.", createdAt: new Date(now.getTime() - 3300000) },
    { senderId: alex._id, receiverId: jordan._id, content: "Perfect, no rush. Let me know if you need any feedback.", createdAt: new Date(now.getTime() - 3000000) },
    { senderId: elena._id, receiverId: mark._id, content: "Mark, the ML model training pipeline is ready for deployment. Can you review the infra requirements?", createdAt: new Date(now.getTime() - 7200000) },
    { senderId: mark._id, receiverId: elena._id, content: "Sure Elena, send over the Dockerfile and I'll take a look at the resource allocation.", createdAt: new Date(now.getTime() - 6900000) },
    { senderId: sarah._id, receiverId: priya._id, content: "Priya, the user research results are in. Can we schedule a sync to discuss findings?", createdAt: new Date(now.getTime() - 86400000) },
    { senderId: priya._id, receiverId: sarah._id, content: "Absolutely! How about tomorrow at 2 PM? I'll block out an hour.", createdAt: new Date(now.getTime() - 82800000) },
    { senderId: tina._id, groupId: engGroup._id, content: "Pushed the new notification center component. Ready for code review!", createdAt: new Date(now.getTime() - 1800000) },
    { senderId: james._id, groupId: engGroup._id, content: "Nice! I'll review it after standup. The API endpoints are all wired up on my end.", createdAt: new Date(now.getTime() - 1500000) },
    { senderId: mark._id, groupId: engGroup._id, content: "Deployment pipeline is green. We can ship to staging whenever ready.", createdAt: new Date(now.getTime() - 1200000) },
    { senderId: nexusBot._id, receiverId: alex._id, content: "Reminder: You have 3 pending pull requests that need review.", createdAt: new Date(now.getTime() - 600000) },
    { senderId: nexusBot._id, groupId: generalGroup._id, content: "Weekly standup reminder: Share your updates in the thread!", createdAt: new Date(now.getTime() - 300000) },
  ]);
  console.log(`[Seed] Created ${messages.length} messages`);

  // ─── Notifications ───
  const notifications = await Notification.insertMany([
    { userId: alex._id, title: "Project Update", description: "Jordan commented on your pull request", type: "info", read: false, link: "/dashboard/projects" },
    { userId: alex._id, title: "New Message", description: "You have a new message from Nexus Bot", type: "message", read: false, link: "/dashboard/messages" },
    { userId: jordan._id, title: "Design Review", description: "Alex requested a review on the button component", type: "info", read: false, link: "/dashboard/projects" },
    { userId: elena._id, title: "Deployment Complete", description: "ML pipeline deployed to staging successfully", type: "success", read: true },
    { userId: mark._id, title: "Server Alert", description: "CPU usage exceeded 80% on production server", type: "warning", read: false, link: "/dashboard/analytics" },
    { userId: sarah._id, title: "Meeting Reminder", description: "Product sync in 15 minutes", type: "info", read: false },
    { userId: priya._id, title: "Team Update", description: "James pushed 3 new commits to the API service", type: "info", read: true },
    { userId: admin._id, title: "New User Registered", description: "A new user has joined the platform", type: "info", read: false, link: "/dashboard/admin" },
    { userId: tina._id, title: "Build Successful", description: "Frontend build #847 passed all checks", type: "success", read: true },
    { userId: james._id, title: "Dependency Alert", description: "Security vulnerability found in lodash", type: "warning", read: false, link: "/dashboard/admin" },
  ]);
  console.log(`[Seed] Created ${notifications.length} notifications`);

  // ─── Notes ───
  const notes = await Note.insertMany([
    { title: "Q4 Roadmap Planning", content: "Key initiatives for Q4:\n1. Launch mobile companion app\n2. Migrate to microservices\n3. Improve onboarding flow\n4. AI-powered recommendations", status: "Published", userId: sarah._id },
    { title: "Sprint Retro Notes", content: "What went well:\n- Design system adoption\n- Code review turnaround\n\nImprovements:\n- More granular task breakdown\n- Better estimation accuracy", status: "Published", userId: alex._id },
    { title: "Design Tokens Reference", content: "Primary: #00E5FF\nSecondary: #3B82F6\nBackground: #0F172A\nSurface: #111827\nText Primary: #F8FAFC\nText Secondary: #64748B", status: "Shared", userId: jordan._id },
    { title: "API Endpoint Documentation", content: "GET /api/users - List users\nGET /api/users/:id - Get user\nPOST /api/projects - Create project\nPATCH /api/users/:id - Update profile", status: "Published", userId: james._id },
    { title: "Meeting Notes - Infrastructure Review", content: "Discussed:\n- Kubernetes cluster scaling\n- Database sharding strategy\n- CDN configuration\n\nDecision: Proceed with horizontal scaling approach", status: "Draft", userId: mark._id },
    { title: "Model Training Log", content: "Experiment #47:\n- Accuracy: 94.2%\n- Training time: 3.5h\n- Data size: 2.3M samples\n\nNext: Optimize hyperparameters", status: "Published", userId: elena._id },
  ]);
  console.log(`[Seed] Created ${notes.length} notes`);

  // ─── Activity Logs ───
  const activityLogs = await ActivityLog.insertMany([
    { userId: admin._id, type: "admin_action", action: "Platform settings updated", details: "Enabled maintenance mode for upgrade", ip: "192.168.1.1" },
    { userId: admin._id, type: "admin_action", action: "New user role assigned", details: "Promoted sarahchen to coordinator", ip: "192.168.1.1" },
    { userId: alex._id, type: "login", action: "User logged in", details: "Login from new device", ip: "10.0.0.45" },
    { userId: jordan._id, type: "login", action: "User logged in", details: "Successful login", ip: "10.0.0.102" },
    { userId: sarah._id, type: "security", action: "Password changed", details: "Password updated successfully", ip: "10.0.0.78" },
    { userId: priya._id, type: "admin_action", action: "Project archived", details: "Archived legacy project 'Old Dashboard'", ip: "10.0.0.34" },
    { userId: elena._id, type: "login", action: "User logged in", details: "Login from mobile device", ip: "172.16.0.23" },
    { userId: mark._id, type: "security", action: "Two-factor enabled", details: "2FA authentication activated", ip: "10.0.0.156" },
    { userId: admin._id, type: "admin_action", action: "System broadcast sent", details: "Sent maintenance notification to all users", ip: "192.168.1.1" },
    { userId: tina._id, type: "login", action: "User logged in", details: "Successful login", ip: "10.0.0.89" },
  ]);
  console.log(`[Seed] Created ${activityLogs.length} activity logs`);

  // ─── Platform Settings ───
  const settings = await PlatformSetting.insertMany([
    { key: "registrations_enabled", value: "true" },
    { key: "maintenance_mode", value: "false" },
    { key: "max_upload_size_mb", value: "10" },
    { key: "default_user_role", value: "user" },
    { key: "session_timeout_minutes", value: "1440" },
    { key: "allow_guest_access", value: "false" },
    { key: "notifications_enabled", value: "true" },
    { key: "audit_logging_enabled", value: "true" },
  ]);
  console.log(`[Seed] Created ${settings.length} platform settings`);

  console.log("\n[Seed] Done! Summary:");
  console.log(`  Users:        ${users.length}`);
  console.log(`  Projects:     ${projects.length}`);
  console.log(`  Groups:       ${groups.length}`);
  console.log(`  Messages:     ${messages.length}`);
  console.log(`  Notifications: ${notifications.length}`);
  console.log(`  Notes:        ${notes.length}`);
  console.log(`  ActivityLogs: ${activityLogs.length}`);
  console.log(`  Settings:     ${settings.length}`);
  console.log("\n  Login credentials:");
  console.log(`  Admin:     admin@nexus.local / admin123`);
  console.log(`  Users:     *@nexus.local / password123`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});