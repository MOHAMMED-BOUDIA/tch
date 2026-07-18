import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import Group from "@/lib/models/Group";
import Message from "@/lib/models/Message";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { content } = await req.json();
    if (!content) return jsonResponse({ error: "Content is required" }, 400);
    const groups = await Group.find().lean();
    const botUser = await User.findOne({ role: "bot" }).lean();
    if (!botUser) return jsonResponse({ error: "Bot user not found" }, 500);
    const messages = groups.map((g) => ({ senderId: botUser._id, groupId: g._id, content: `📢 ${content}` }));
    await Message.insertMany(messages);
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Broadcast message to ${groups.length} groups` });
    return jsonResponse({ message: `Broadcast sent to ${groups.length} groups` });
  } catch (err) {
    return errorResponse(err);
  }
}
