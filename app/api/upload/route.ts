import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Upload from "@/lib/models/Upload";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    await requireAuth(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return jsonResponse({ error: "No file provided" }, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await Upload.create({
      filename: file.name,
      mimeType: file.type || "image/jpeg",
      data: buffer,
      size: file.size,
    });

    const url = `/api/uploads/${upload._id}`;

    return jsonResponse({
      message: "File uploaded",
      file: { name: file.name, url },
    });
  } catch (err) {
    return errorResponse(err);
  }
}