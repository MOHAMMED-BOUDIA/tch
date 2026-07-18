import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireAuth(req);

    // Placeholder: return empty notifications list
    // Extend with a Notification model for production
    return jsonResponse([]);
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    await requireAuth(req);

    // Placeholder: accept notification creation
    // Extend with a Notification model for production
    return jsonResponse({ message: "Notification created" }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
