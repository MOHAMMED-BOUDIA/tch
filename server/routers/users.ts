import { Router, Request, Response } from "express";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/search", requireAuth, async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim();
    const filter: any = { role: { $ne: "admin" } };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    const users = await User.find(filter)
      .select("name email avatar role")
      .limit(50)
      .lean();
    res.json(users.map(u => ({
      id: u._id,
      name: u.name || "Unknown",
      avatar: u.avatar || "",
      email: u.email,
      role: u.role,
    })));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name username email avatar role bio title location website status")
      .lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
      role: user.role,
      bio: user.bio || "",
      title: user.title || "",
      location: user.location || "",
      website: user.website || "",
      status: user.status || "offline",
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id/projects", async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ createdBy: req.params.id, status: "published" })
      .sort({ createdAt: -1 })
      .lean();
    res.json(projects.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      status: p.status,
      image: p.image,
      link: p.link || "",
      contributorsCount: p.contributorsCount,
      performanceScore: p.performanceScore,
      createdAt: p.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
