import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Group from "@/lib/models/Group";
import Message from "@/lib/models/Message";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    await requireRole(req, "admin");
    const { id } = await params;
    const group = await Group.findById(id).lean();
    if (!group) return jsonResponse({ error: "Group not found" }, 404);
    const messages = await Message.find({ groupId: id })
      .populate("senderId", "name username email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return jsonResponse(messages.map((m) => ({
      id: m._id, content: m.content,
      sender: m.senderId ? { id: (m.senderId as any)._id, name: (m.senderId as any).name, username: (m.senderId as any).username, email: (m.senderId as any).email } : null,
      createdAt: m.createdAt, edited: m.edited, deleted: m.deleted,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}
