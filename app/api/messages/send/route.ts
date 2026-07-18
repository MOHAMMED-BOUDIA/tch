import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { receiverId, content } = await req.json();

    if (!content?.trim()) {
      return jsonResponse({ error: "Message content is required" }, 400);
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return jsonResponse({ error: "User not found" }, 404);

    const msg = await Message.create({
      senderId: auth.userId, receiverId, content: content.trim(), groupId: undefined,
    });

    const populated = await Message.findById(msg._id)
      .populate("senderId", "name avatar")
      .lean();

    return jsonResponse({
      id: populated!._id, senderId: (populated as any).senderId._id.toString(),
      senderName: (populated as any).senderId.name || "Unknown",
      content: (populated as any).content, created_at: (populated as any).createdAt, isMine: true,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
