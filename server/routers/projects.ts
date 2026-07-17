import { Router, Request, Response } from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ createdBy: req.user!.userId })
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

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const userId = req.user!.userId;
    const isOwner = project.createdBy.toString() === userId;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: "Access denied" });
      return;
    }
    const owner = await User.findById(project.createdBy).select("name username email avatar").lean();
    res.json({
      id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      image: project.image,
      link: project.link || "",
      contributorsCount: project.contributorsCount,
      performanceScore: project.performanceScore,
      createdBy: owner,
      createdAt: project.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, link, image, status } = req.body;
    if (!name || !description) {
      res.status(400).json({ error: "Name and description are required" });
      return;
    }
    const project = await Project.create({
      name,
      description,
      link: link || "",
      image: image || "",
      status: status === "published" ? "published" : "draft",
      createdBy: req.user!.userId,
    });
    res.status(201).json({
      id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      image: project.image,
      link: project.link,
      contributorsCount: project.contributorsCount,
      performanceScore: project.performanceScore,
      createdAt: project.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    const userId = req.user!.userId;
    const isOwner = project.createdBy.toString() === userId;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: "Only the owner or admin can edit this project" });
      return;
    }
    const allowedFields = ["name", "description", "link", "image", "status"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (project as any)[field] = req.body[field];
      }
    }
    await project.save();
    res.json({
      id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      image: project.image,
      link: project.link,
      contributorsCount: project.contributorsCount,
      performanceScore: project.performanceScore,
      createdAt: project.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
