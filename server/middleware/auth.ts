import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-admin-secret-key-change-in-production";

export type UserRole = "user" | "coordinateur" | "admin";

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

async function checkSuspended(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.userId);
    if (!user || user.status === "suspended") {
      res.status(403).json({ error: "Account is suspended" });
      return;
    }
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, async () => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: `Access restricted to: ${roles.join(", ")}` });
        return;
      }
      await checkSuspended(req, res, next);
    });
  };
}

export const requireChatAccess = requireRole("admin", "coordinateur");
