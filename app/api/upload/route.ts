import { NextRequest } from "next/server";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return jsonResponse({ error: "No file provided" }, 400);
    }

    // Placeholder: store file and return URL
    // In production, upload to S3/Cloudinary/etc. and return the URL
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;

    return jsonResponse({
      message: "File uploaded",
      file: { name: fileName, type: fileType, size: fileSize, url: "" },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
