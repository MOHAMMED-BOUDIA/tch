import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-admin-secret-key-change-in-production";

export type UserRole = "user" | "coordinator" | "admin";

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

function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }
    console.error("Auth error:", (err as Error).message);
    res.status(500).json({ error: "Server error" });
  }
}

async function checkActive(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const user = await User.findById(req.user.userId);
    if (!user || user.status === "suspended") {
      res.status(403).json({ error: "Account is suspended" });
      return;
    }
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

function requireRole(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: `Access restricted to: ${roles.join(", ")}` });
        return;
      }
      checkActive(req, res, next);
    });
  };
}

export { requireAuth };
export const requireAdmin = requireRole("admin");
export const requireCoordinator = requireRole("admin", "coordinator");
export const requireUser = requireRole("user", "coordinator", "admin");
