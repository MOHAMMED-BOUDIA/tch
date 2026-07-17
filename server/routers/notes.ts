import { Router, Request, Response } from "express";
import Note from "../models/Note.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user!.userId })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(notes.map(n => ({
      id: n._id,
      title: n.title,
      content: n.content,
      status: n.status,
      updatedAt: n.updatedAt,
      createdAt: n.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user!.userId }).lean();
    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.json({
      id: note._id,
      title: note.title,
      content: note.content,
      status: note.status,
      updatedAt: note.updatedAt,
      createdAt: note.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
