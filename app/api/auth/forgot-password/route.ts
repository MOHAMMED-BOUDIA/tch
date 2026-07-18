import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { email } = await req.json();
    if (!email) {
      return jsonResponse({ error: "Email is required" }, 400);
    }
    const user = await User.findOne({ email });
    if (user) {
      generateToken({ userId: user._id.toString(), role: user.role });
    }
    return jsonResponse({ message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    return errorResponse(err);
  }
}
