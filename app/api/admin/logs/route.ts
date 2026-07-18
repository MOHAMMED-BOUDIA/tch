import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireRole(req, "admin");
    const type = req.nextUrl.searchParams.get("type");
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 100;
    const filter: any = {};
    if (type) filter.type = type;
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name username email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return jsonResponse(logs.map((l) => ({
      id: l._id, type: l.type, action: l.action, details: l.details, ip: l.ip,
      user: l.userId ? { id: (l.userId as any)._id, name: (l.userId as any).name, username: (l.userId as any).username, email: (l.userId as any).email } : null,
      createdAt: l.createdAt,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}
