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
    const user = await User.findByIdAndUpdate(id, { status: "active" }, { new: true }).select("-password");
    if (!user) return jsonResponse({ error: "User not found" }, 404);
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Activated user ${user.username} (${user.email})` });
    return jsonResponse({ id: user._id, status: user.status });
  } catch (err) {
    return errorResponse(err);
  }
}
