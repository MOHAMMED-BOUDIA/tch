import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    await requireAuth(req);
    const { id } = await params;
    const user = await User.findById(id).select("name username email avatar coverPic role bio title location website status").lean();
    if (!user) return jsonResponse({ error: "User not found" }, 404);
    return jsonResponse({
      id: user._id, name: user.name, username: user.username, email: user.email,
      avatar: user.avatar || "", coverPic: user.coverPic || "", role: user.role, bio: user.bio || "",
      title: user.title || "", location: user.location || "", website: user.website || "",
      status: user.status || "offline",
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const payload = await requireAuth(req);
    const { id } = await params;

    if (payload.userId !== id && payload.role !== "admin") {
      return jsonResponse({ error: "Not authorized to update this profile" }, 403);
    }

    const body = await req.json();
    const allowedFields = ["name", "title", "bio", "location", "website", "avatar", "coverPic", "status"];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.status === "online") updates.status = "active";
    if (updates.status === "offline") updates.status = "suspended";

    if (Object.keys(updates).length === 0) {
      return jsonResponse({ error: "No valid fields to update" }, 400);
    }

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true })
      .select("name username email avatar coverPic role bio title location website status")
      .lean();

    if (!user) return jsonResponse({ error: "User not found" }, 404);

    return jsonResponse({
      id: user._id, name: user.name, username: user.username, email: user.email,
      avatar: user.avatar || "", coverPic: user.coverPic || "", role: user.role, bio: user.bio || "",
      title: user.title || "", location: user.location || "", website: user.website || "",
      status: user.status || "offline",
    });
  } catch (err) {
    return errorResponse(err);
  }
}