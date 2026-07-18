import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Group from "@/lib/models/Group";
import Message from "@/lib/models/Message";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { id } = await params;
    const group = await Group.findByIdAndDelete(id);
    if (!group) return jsonResponse({ error: "Group not found" }, 404);
    await Message.deleteMany({ groupId: id });
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Deleted group "${group.name}" with all messages` });
    return jsonResponse({ message: "Group deleted" });
  } catch (err) {
    return errorResponse(err);
  }
}
