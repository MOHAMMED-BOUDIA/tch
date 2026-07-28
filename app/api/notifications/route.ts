import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";
import Notification from "@/lib/models/Notification";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const notifications = await Notification.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return jsonResponse(notifications);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { ids } = await req.json();
    await Notification.updateMany(
      { _id: { $in: ids }, userId: auth.userId },
      { $set: { read: true } }
    );
    return jsonResponse({ message: "Marked as read" });
  } catch (err) {
    return errorResponse(err);
  }
}
