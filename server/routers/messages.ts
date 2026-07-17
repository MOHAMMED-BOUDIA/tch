import { Router, Request, Response } from "express";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/conversations", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      receiverId: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name avatar")
      .populate("receiverId", "name avatar")
      .lean();

    const seen = new Set<string>();
    const conversations: any[] = [];

    for (const msg of messages as any[]) {
      const otherId = msg.senderId._id.toString() === userId
        ? msg.receiverId?._id?.toString()
        : msg.senderId._id.toString();

      if (!otherId || seen.has(otherId)) continue;
      seen.add(otherId);

      const otherUser = msg.senderId._id.toString() === userId ? msg.receiverId : msg.senderId;
      conversations.push({
        userId: otherId,
        userName: otherUser?.name || "Unknown",
        userAvatar: otherUser?.avatar || "",
        lastMessage: msg.content,
        lastTime: msg.createdAt,
      });
    }

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/conversation/:otherUserId", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name avatar")
      .lean();

    res.json(messages.map((m: any) => ({
      id: m._id,
      senderId: m.senderId._id.toString(),
      senderName: m.senderId.name || "Unknown",
      content: m.content,
      created_at: m.createdAt,
      isMine: m.senderId._id.toString() === userId,
    })));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/send", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { receiverId, content } = req.body;

    if (!content?.trim()) {
      res.status(400).json({ error: "Message content is required" });
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const msg = await Message.create({
      senderId: userId,
      receiverId,
      content: content.trim(),
      groupId: undefined,
    });

    const populated = await Message.findById(msg._id)
      .populate("senderId", "name avatar")
      .lean();

    res.json({
      id: populated!._id,
      senderId: (populated as any).senderId._id.toString(),
      senderName: (populated as any).senderId.name || "Unknown",
      content: (populated as any).content,
      created_at: (populated as any).createdAt,
      isMine: true,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
