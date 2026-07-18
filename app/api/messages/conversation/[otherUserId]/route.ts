import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/lib/models/Message";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ otherUserId: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { otherUserId } = await params;

    const messages = await Message.find({
      $or: [
        { senderId: auth.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: auth.userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name avatar")
      .lean();

    return jsonResponse(messages.map((m: any) => ({
      id: m._id, senderId: m.senderId._id.toString(), senderName: m.senderId.name || "Unknown",
      content: m.content, created_at: m.createdAt, isMine: m.senderId._id.toString() === auth.userId,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}
