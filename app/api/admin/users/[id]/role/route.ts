import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { id } = await params;
    const { role } = await req.json();
    if (!["user", "coordinator", "admin"].includes(role)) return jsonResponse({ error: "Invalid role" }, 400);
    if (id === auth.userId) return jsonResponse({ error: "Cannot change your own role" }, 400);
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) return jsonResponse({ error: "User not found" }, 404);
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Changed role of ${user.username} to ${role}` });
    return jsonResponse({ id: user._id, role: user.role });
  } catch (err) {
    return errorResponse(err);
  }
}
