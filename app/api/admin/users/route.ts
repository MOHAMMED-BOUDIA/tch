import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import ActivityLog from "@/lib/models/ActivityLog";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

async function log(userId: string, type: "admin_action" | "login" | "security", action: string, details?: string, ip?: string) {
  await ActivityLog.create({ userId, type, action, details, ip });
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    return jsonResponse(users.map(u => ({
      id: u._id, username: u.username, email: u.email, name: u.name,
      role: u.role, status: u.status, lastLogin: u.lastLogin, createdAt: u.createdAt,
    })));
  } catch (err) {
    return errorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const auth = await requireRole(req, "admin");
    const { name, email, password, role, status } = await req.json();
    if (!email || !password) return jsonResponse({ error: "Email and password are required" }, 400);
    if (password.length < 6) return jsonResponse({ error: "Password must be at least 6 characters" }, 400);

    const validRoles = ["user", "coordinator", "admin"];
    const userRole = validRoles.includes(role) ? role : "user";
    const existing = await User.findOne({ email });
    if (existing) return jsonResponse({ error: "Email already in use" }, 409);

    const username = email.split("@")[0] + "-" + Math.random().toString(36).slice(2, 6);
    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username, email, password: hashed, name: name || "",
      role: userRole, status: status === "suspended" ? "suspended" : "active",
    });

    await log(auth.userId, "admin_action", `Created user ${user.username} (${user.email}) as ${userRole}`);
    return jsonResponse({
      id: user._id, username: user.username, email: user.email, name: user.name,
      role: user.role, status: user.status, createdAt: user.createdAt,
    }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
