import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Group from "@/lib/models/Group";
import Message from "@/lib/models/Message";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireRole(req, "admin");
    const groups = await Group.find().populate("members", "name email").sort({ createdAt: -1 }).lean();
    const groupsWithCounts = await Promise.all(
      groups.map(async (g) => {
        const messageCount = await Message.countDocuments({ groupId: g._id });
        return { id: g._id, name: g.name, avatar: g.avatar, memberCount: g.members?.length || 0, messageCount, createdAt: g.createdAt };
      })
    );
    return jsonResponse(groupsWithCounts);
  } catch (err) {
    return errorResponse(err);
  }
}

async function log(userId: string, action: string, details?: string) {
  const ActivityLog = (await import("@/lib/models/ActivityLog")).default;
  await ActivityLog.create({ userId, type: "admin_action", action, details, ip: undefined });
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { name, memberIds } = await req.json();

    if (!name?.trim()) {
      return jsonResponse({ error: "Group name is required" }, 400);
    }

    const group = await Group.create({ name: name.trim(), avatar: "", members: memberIds || [] });
    await log(auth.userId, "Created group", `Admin created group "${group.name}"`);

    return jsonResponse({
      id: group._id, name: group.name, avatar: group.avatar,
      memberCount: group.members?.length || 0, messageCount: 0, createdAt: group.createdAt,
    }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}


