import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Note from "@/lib/models/Note";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { id } = await params;
    const note = await Note.findOne({ _id: id, userId: auth.userId }).lean();
    if (!note) return jsonResponse({ error: "Note not found" }, 404);
    return jsonResponse({ id: note._id, title: note.title, content: note.content, status: note.status, updatedAt: note.updatedAt, createdAt: note.createdAt });
  } catch (err) {
    return errorResponse(err);
  }
}
