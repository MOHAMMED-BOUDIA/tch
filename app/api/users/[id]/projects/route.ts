import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Project from "@/lib/models/Project";
import { errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
    const projects = await Project.find({ createdBy: id, status: "published" }).sort({ createdAt: -1 }).lean();
    return jsonResponse(projects.map(p => ({
      id: p._id, name: p.name, description: p.description, status: p.status,
      image: p.image, link: p.link || "", contributorsCount: p.contributorsCount,
      performanceScore: p.performanceScore, createdAt: p.createdAt,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}
