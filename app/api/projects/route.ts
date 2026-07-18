import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Project from "@/lib/models/Project";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const projects = await Project.find({ createdBy: auth.userId }).sort({ createdAt: -1 }).lean();
    return jsonResponse(projects.map(p => ({
      id: p._id, name: p.name, description: p.description, status: p.status,
      image: p.image, link: p.link || "", contributorsCount: p.contributorsCount,
      performanceScore: p.performanceScore, createdAt: p.createdAt,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireAuth(req);
    const { name, description, link, image, status } = await req.json();
    if (!name || !description) {
      return jsonResponse({ error: "Name and description are required" }, 400);
    }
    const project = await Project.create({
      name, description, link: link || "", image: image || "",
      status: status === "published" ? "published" : "draft",
      createdBy: auth.userId,
    });
    return jsonResponse({
      id: project._id, name: project.name, description: project.description,
      status: project.status, image: project.image, link: project.link,
      contributorsCount: project.contributorsCount, performanceScore: project.performanceScore,
      createdAt: project.createdAt,
    }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
