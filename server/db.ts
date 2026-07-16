import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Group from "./models/Group.js";
import Message from "./models/Message.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexus";

let connected = false;

export async function connectDb() {
  if (connected) return;
  await mongoose.connect(MONGO_URI);
  connected = true;
  console.log("Connected to MongoDB");
  await seed();
}

export async function disconnectDb() {
  await mongoose.disconnect();
  connected = false;
}

async function seed() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  const pw = bcrypt.hashSync("password123", 10);

  const users = await User.insertMany([
    { username: "alexrivera", email: "alex@nexus.local", password: pw, role: "coordinateur", status: "active", name: "Alex Rivera" },
    { username: "jordansmith", email: "jordan@nexus.local", password: pw, role: "coordinateur", status: "active", name: "Jordan Smith" },
    { username: "elenarodriguez", email: "elena@nexus.local", password: pw, role: "coordinateur", status: "active", name: "Elena Rodriguez" },
    { username: "marcuschen", email: "marcus@nexus.local", password: pw, role: "coordinateur", status: "active", name: "Marcus Chen" },
    { username: "sarahkim", email: "sarah@nexus.local", password: pw, role: "coordinateur", status: "active", name: "Sarah Kim" },
    { username: "nexus-assistant", email: "assistant@nexus.local", password: bcrypt.hashSync("bot-nexus-assistant", 10), role: "bot", status: "active", name: "Nexus Assistant" },
  ]);

  const groups = await Group.insertMany([
    { name: "General" },
    { name: "Design Team" },
    { name: "Engineering" },
    { name: "Product" },
  ]);

  const [alex, jordan, elena, marcus, sarah, bot] = users;
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
