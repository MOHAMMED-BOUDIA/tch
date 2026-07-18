import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Project from "@/lib/models/Project";
import User from "@/lib/models/User";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { id } = await params;
    const project = await Project.findById(id).lean();
    if (!project) return jsonResponse({ error: "Project not found" }, 404);
    const isOwner = project.createdBy.toString() === auth.userId;
    const isAdmin = auth.role === "admin";
    if (!isOwner && !isAdmin) return jsonResponse({ error: "Access denied" }, 403);
    const owner = await User.findById(project.createdBy).select("name username email avatar").lean();
    return jsonResponse({
      id: project._id, name: project.name, description: project.description,
      status: project.status, image: project.image, link: project.link || "",
      contributorsCount: project.contributorsCount, performanceScore: project.performanceScore,
      createdBy: owner, createdAt: project.createdAt,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) return jsonResponse({ error: "Project not found" }, 404);
    const isOwner = project.createdBy.toString() === auth.userId;
    const isAdmin = auth.role === "admin";
    if (!isOwner && !isAdmin) return jsonResponse({ error: "Only the owner or admin can edit this project" }, 403);
    const body = await req.json();
    const allowedFields = ["name", "description", "link", "image", "status"];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (project as any)[field] = body[field];
      }
    }
    await project.save();
    return jsonResponse({
      id: project._id, name: project.name, description: project.description,
      status: project.status, image: project.image, link: project.link,
      contributorsCount: project.contributorsCount, performanceScore: project.performanceScore,
      createdAt: project.createdAt,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
