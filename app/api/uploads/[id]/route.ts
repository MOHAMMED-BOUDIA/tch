import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Upload from "@/lib/models/Upload";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const { id } = await params;
    const upload = await Upload.findById(id);
    if (!upload) {
      return new Response("Not found", { status: 404 });
    }
    return new Response(upload.data, {
      headers: {
        "Content-Type": upload.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}