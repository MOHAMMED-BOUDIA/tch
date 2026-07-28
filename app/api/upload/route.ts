import { NextRequest } from "next/server";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return jsonResponse({ error: "No file provided" }, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const externalUploadUrl = process.env.UPLOADS_API_URL;
    if (externalUploadUrl) {
      const form = new FormData();
      form.append("file", new Blob([buffer], { type: file.type }), fileName);
      const res = await fetch(externalUploadUrl, { method: "POST", body: form });
      const data = await res.json();
      const url = data.url || `${process.env.UPLOADS_BASE_URL || ""}/${fileName}`;
      return jsonResponse({ message: "File uploaded", file: { name: fileName, url } });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;

    return jsonResponse({
      message: "File uploaded",
      file: { name: fileName, url },
    });
  } catch (err) {
    return errorResponse(err);
  }
}