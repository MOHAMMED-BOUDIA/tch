import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Note from "@/lib/models/Note";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const notes = await Note.find({ userId: auth.userId }).sort({ updatedAt: -1 }).lean();
    return jsonResponse(notes.map(n => ({ id: n._id, title: n.title, content: n.content, status: n.status, updatedAt: n.updatedAt, createdAt: n.createdAt })));
  } catch (err) {
    return errorResponse(err);
  }
}
