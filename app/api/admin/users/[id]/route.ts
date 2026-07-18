import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { id } = await params;
    if (id === auth.userId) return jsonResponse({ error: "Cannot delete your own account" }, 400);
    const user = await User.findByIdAndDelete(id);
    if (!user) return jsonResponse({ error: "User not found" }, 404);
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Deleted user ${user.username} (${user.email})` });
    return jsonResponse({ message: "User deleted" });
  } catch (err) {
    return errorResponse(err);
  }
}
