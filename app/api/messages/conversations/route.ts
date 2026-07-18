import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/lib/models/Message";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const userId = auth.userId;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      receiverId: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name avatar")
      .populate("receiverId", "name avatar")
      .lean();

    const seen = new Set<string>();
    const conversations: any[] = [];

    for (const msg of messages as any[]) {
      const otherId = msg.senderId._id.toString() === userId
        ? msg.receiverId?._id?.toString()
        : msg.senderId._id.toString();

      if (!otherId || seen.has(otherId)) continue;
      seen.add(otherId);

      const otherUser = msg.senderId._id.toString() === userId ? msg.receiverId : msg.senderId;
      conversations.push({
        userId: otherId, userName: otherUser?.name || "Unknown",
        userAvatar: otherUser?.avatar || "", lastMessage: msg.content, lastTime: msg.createdAt,
      });
    }

    return jsonResponse(conversations);
  } catch (err) {
    return errorResponse(err);
  }
}
