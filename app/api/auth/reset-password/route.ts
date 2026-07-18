import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { verifyToken, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { token, password } = await req.json();

    if (!token || !password) {
      return jsonResponse({ error: "Token and password are required" }, 400);
    }

    if (password.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters" }, 400);
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return jsonResponse({ error: "Invalid or expired reset token" }, 401);
    }

    const hashed = bcrypt.hashSync(password, 10);
    await User.findByIdAndUpdate(payload.userId, { password: hashed });

    return jsonResponse({ message: "Password reset successful" });
  } catch (err) {
    return errorResponse(err);
  }
}
