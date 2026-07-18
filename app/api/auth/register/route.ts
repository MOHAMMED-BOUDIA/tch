import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { username, email: rawEmail, password, name } = await req.json();
    const email = rawEmail?.toLowerCase();
    if (!username || !email || !password) {
      return jsonResponse({ error: "Username, email, and password are required" }, 400);
    }
    if (password.length < 6) {
      return jsonResponse({ error: "Password must be at least 6 characters" }, 400);
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return jsonResponse({ error: "Email or username already taken" }, 409);
    }
    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, email, password: hashed, role: "user", status: "active", name: name || username });
    const token = generateToken({ userId: user._id.toString(), role: user.role });
    return jsonResponse({
      token,
      user: { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role },
    }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
