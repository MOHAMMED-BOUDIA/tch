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


