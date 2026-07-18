import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import User from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-admin-secret-key-change-in-production";

export type UserRole = "user" | "coordinator" | "admin" | "bot";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = req.cookies.get("token");
  if (cookie) return cookie.value;
  return null;
}

export async function requireAuth(req: NextRequest): Promise<AuthPayload> {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new AuthError("Authentication required", 401);
  }
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.status === "suspended") {
      throw new AuthError("Account is suspended", 403);
    }
    return payload;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    throw new AuthError("Invalid or expired token", 401);
  }
}

export async function requireRole(req: NextRequest, ...roles: UserRole[]): Promise<AuthPayload> {
  const payload = await requireAuth(req);
  if (!roles.includes(payload.role)) {
    throw new AuthError(`Access restricted to: ${roles.join(", ")}`, 403);
  }
  return payload;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Server error:", error);
  return Response.json({ error: "Server error" }, { status: 500 });
}

export function jsonResponse(data: any, status = 200) {
  return Response.json(data, { status });
}
