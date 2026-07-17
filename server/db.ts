import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Group from "./models/Group.js";
import Message from "./models/Message.js";
import Project from "./models/Project.js";
import Note from "./models/Note.js";
import PlatformSetting from "./models/PlatformSetting.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexus";

let connected = false;

export async function connectDb() {
  if (connected) return;
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    connected = true;
    console.log("Connected to MongoDB");
    await seed();
  } catch (err) {
    console.error("Failed to connect to MongoDB at", MONGO_URI);
    console.error("Make sure MongoDB is running. Error:", (err as Error).message);
    process.exit(1);
  }
}

export async function disconnectDb() {
  await mongoose.disconnect();
  connected = false;
}

async function seed() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const pw = bcrypt.hashSync("password123", 10);

    const users = await User.insertMany([
      { username: "alexrivera", email: "alex@nexus.local", password: pw, role: "coordinator", status: "active", name: "Alex Rivera" },
      { username: "jordansmith", email: "jordan@nexus.local", password: pw, role: "coordinator", status: "active", name: "Jordan Smith" },
      { username: "elenarodriguez", email: "elena@nexus.local", password: pw, role: "coordinator", status: "active", name: "Elena Rodriguez" },
      { username: "marcuschen", email: "marcus@nexus.local", password: pw, role: "coordinator", status: "active", name: "Marcus Chen" },
      { username: "sarahkim", email: "sarah@nexus.local", password: pw, role: "coordinator", status: "active", name: "Sarah Kim" },
      { username: "nexus-assistant", email: "assistant@nexus.local", password: bcrypt.hashSync("bot-nexus-assistant", 10), role: "bot", status: "active", name: "Nexus Assistant" },
      { username: "admin", email: "admin@nexus.local", password: pw, role: "admin", status: "active", name: "Admin" },
    ]);

    const groups = await Group.insertMany([
      { name: "General" },
      { name: "Design Team" },
      { name: "Engineering" },
      { name: "Product" },
    ]);

    const [alex, jordan, elena, marcus, sarah, bot, admin] = users;
    const [general, design, engineering, product] = groups;

    await Message.insertMany([
      { senderId: alex._id, groupId: general._id, content: "Good morning team! Ready for the standup?" },
      { senderId: jordan._id, groupId: general._id, content: "Morning! Got the DB cluster upgrades ready for review." },
      { senderId: elena._id, groupId: general._id, content: "Great, I'll take a look after the meeting." },
      { senderId: marcus._id, groupId: design._id, content: "New mockups for the dashboard are up on Figma." },
      { senderId: sarah._id, groupId: design._id, content: "Love the new color scheme! Let's iterate on the nav." },
      { senderId: alex._id, groupId: engineering._id, content: "CDN geo-routing deploy is at 95%. Looking good." },
      { senderId: jordan._id, groupId: engineering._id, content: "Approved. Let's ship it this afternoon." },
      { senderId: elena._id, groupId: product._id, content: "Sprint review is tomorrow at 2 PM. Please have demos ready." },
    ]);
  }

  const settingCount = await PlatformSetting.countDocuments();
  if (settingCount === 0) {
    await PlatformSetting.insertMany([
      { key: "registrations_enabled", value: "true" },
      { key: "maintenance_mode", value: "false" },
    ]);
  }

  const oldProjects = await Project.countDocuments({ status: { $in: ["Active Now", "Archived"] } });
  if (oldProjects > 0) {
    await Project.deleteMany({});
  }

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    const alex = await User.findOne({ username: "alexrivera" }).lean();
    const admin = await User.findOne({ username: "admin" }).lean();
    if (alex && admin) {
      await Project.insertMany([
        { name: "Project Aether", description: "Next-gen real-time synchronization engine for distributed workspace collaboration.", status: "published", link: "https://github.com/nexus/aether", contributorsCount: 12, createdBy: alex._id },
        { name: "Vortex Core", description: "High-frequency data streaming middleware achieving < 2ms latency on global edge nodes.", status: "published", link: "https://vortex.nexus.io", contributorsCount: 8, performanceScore: "99% Performance Score", createdBy: alex._id },
        { name: "Nexus Dashboard", description: "Unified analytics and monitoring interface for cross-team collaboration metrics.", status: "draft", link: "", contributorsCount: 6, createdBy: alex._id },
        { name: "Platform Admin Console", description: "Centralized admin panel for user management, system controls, and activity monitoring.", status: "published", link: "https://admin.nexus.io", contributorsCount: 5, createdBy: admin._id },
        { name: "Audit Trail System", description: "Complete activity logging and audit trail for all admin actions across the platform.", status: "draft", link: "", contributorsCount: 3, createdBy: admin._id },
      ]);
    }
  }

  const noteCount = await Note.countDocuments();
  if (noteCount === 0) {
    const alex = await User.findOne({ username: "alexrivera" }).lean();
    const admin = await User.findOne({ username: "admin" }).lean();
    if (alex && admin) {
      await Note.insertMany([
        { title: "Review of WebGPU specs", content: "WebGPU provides modern 3D graphics and compute capabilities on the web. Key takeaways:\n\n1. Direct access to GPU hardware\n2. Significantly lower overhead compared to WebGL\n3. Compute shaders for general-purpose GPU computing\n4. Better resource management and error handling\n\nNext steps: Investigate integration with our visualization stack.", status: "Draft", userId: alex._id },
        { title: "Scalability Bottleneck Analysis", content: "Identified key bottlenecks in the current microservices architecture:\n\n- Database connection pooling limits\n- Cache invalidation strategies need review\n- Message queue backpressure under high load\n\nRecommendations:\n1. Implement read replicas\n2. Upgrade to Redis Cluster\n3. Consider Kafka for event streaming", status: "Shared", userId: alex._id },
        { title: "Q3 Architecture Planning", content: "Quarterly planning for the Nexus platform architecture.\n\nGoals:\n- Zero-downtime deployment pipeline\n- 99.99% uptime SLA\n- Multi-region active-active setup\n\nTimeline: 12 weeks", status: "Draft", userId: alex._id },
        { title: "Deployment Runbook v2", content: "Updated deployment procedure for the Nexus platform.\n\nPre-deployment:\n1. Verify all CI checks pass\n2. Run database migration dry-run\n3. Notify stakeholders\n\nDeployment:\n1. Enable maintenance mode\n2. Deploy canary (10% traffic)\n3. Monitor for 5 minutes\n4. Roll out to remaining nodes\n\nRollback: See runbook appendix A", status: "Published", userId: admin._id },
        { title: "Security Audit Notes", content: "Quarterly security audit findings:\n\n- All dependencies up to date\n- No critical vulnerabilities\n- 2FA adoption at 60%\n- Recommend enforcing 2FA for admin accounts\n\nAction items:\n1. Schedule penetration test\n2. Review API rate limiting\n3. Update CORS policy", status: "Draft", userId: admin._id },
      ]);
    }
  }
}
