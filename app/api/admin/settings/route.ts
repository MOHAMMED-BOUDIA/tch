import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import PlatformSetting from "@/lib/models/PlatformSetting";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireRole(req, "admin");
    const settings = await PlatformSetting.find().lean();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.key] = s.value;
    return jsonResponse(map);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { key, value } = await req.json();
    if (!key) return jsonResponse({ error: "Key is required" }, 400);
    await PlatformSetting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
    await ActivityLog.create({ userId: auth.userId, type: "admin_action", action: `Updated setting "${key}" to "${value}"` });
    return jsonResponse({ message: "Setting updated" });
  } catch (err) {
    return errorResponse(err);
  }
}
