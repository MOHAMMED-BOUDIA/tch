import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    await requireAuth(req);
    const { id } = await params;
    const user = await User.findById(id).select("name username email avatar role bio title location website status").lean();
    if (!user) return jsonResponse({ error: "User not found" }, 404);
    return jsonResponse({
      id: user._id, name: user.name, username: user.username, email: user.email,
      avatar: user.avatar || "", role: user.role, bio: user.bio || "",
      title: user.title || "", location: user.location || "", website: user.website || "",
      status: user.status || "offline",
    });
  } catch (err) {
    return errorResponse(err);
  }
}
