import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { email, password } = await req.json();
    if (!email || !password) {
      return jsonResponse({ error: "Email and password required" }, 400);
    }
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }
    if (user.status === "suspended") {
      return jsonResponse({ error: "Account is suspended" }, 403);
    }
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ userId: user._id.toString(), role: user.role });
    return jsonResponse({
      token,
      user: { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
