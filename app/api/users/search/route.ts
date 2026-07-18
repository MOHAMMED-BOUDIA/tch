import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireAuth(req);
    const q = (req.nextUrl.searchParams.get("q") || "").trim();
    const filter: any = { role: { $ne: "admin" } };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    const users = await User.find(filter).select("name email avatar role").limit(50).lean();
    return jsonResponse(users.map(u => ({ id: u._id, name: u.name || "Unknown", avatar: u.avatar || "", email: u.email, role: u.role })));
  } catch (err) {
    return errorResponse(err);
  }
}
