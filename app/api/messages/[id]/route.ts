import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/lib/models/Message";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { id } = await params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return jsonResponse({ error: "Content is required" }, 400);
    }

    const msg = await Message.findById(id);
    if (!msg) return jsonResponse({ error: "Message not found" }, 404);
    if (msg.senderId.toString() !== auth.userId) {
      return jsonResponse({ error: "Not authorized to edit this message" }, 403);
    }

    msg.content = content.trim();
    msg.edited = true;
    await msg.save();

    return jsonResponse({
      id: msg._id,
      content: msg.content,
      edited: msg.edited,
      groupId: msg.groupId,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { id } = await params;

    const msg = await Message.findById(id);
    if (!msg) return jsonResponse({ error: "Message not found" }, 404);
    if (msg.senderId.toString() !== auth.userId) {
      return jsonResponse({ error: "Not authorized to delete this message" }, 403);
    }

    msg.content = "This message was deleted";
    msg.deleted = true;
    await msg.save();

    return jsonResponse({
      id: msg._id,
      deleted: true,
      groupId: msg.groupId,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
