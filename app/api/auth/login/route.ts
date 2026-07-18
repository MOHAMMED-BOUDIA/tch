import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { generateToken, errorResponse, jsonResponse } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const log = (msg: string, data?: unknown) =>
    console.log(`[LOGIN] ${msg}`, data ?? "");

  try {
    await connectDb();
    const { email, password } = await req.json();
    log("Attempt", { email: email ? email.toLowerCase() : "(missing)" });

    if (!email || !password) {
      log("Missing fields");
      return jsonResponse({ error: "Email and password required" }, 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      log("User not found", { email: email.toLowerCase() });
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }
    log("User found", { id: user._id.toString(), role: user.role });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    log("Password compare result", { match: passwordMatch });

    if (!passwordMatch) {
      return jsonResponse({ error: "Invalid credentials" }, 401);
    }

    if (user.status === "suspended") {
      log("Account suspended", { id: user._id.toString() });
      return jsonResponse({ error: "Account is suspended" }, 403);
    }

    user.lastLogin = new Date();
    await user.save();
    log("Last login updated");

    const token = generateToken({ userId: user._id.toString(), role: user.role });
    log("Login success", { userId: user._id.toString() });

    return jsonResponse({
      token,
      user: { id: user._id, username: user.username, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    log("Unexpected error", err instanceof Error ? err.message : err);
    return errorResponse(err);
  }
}
