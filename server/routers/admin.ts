import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import ActivityLog from "../models/ActivityLog.js";
import PlatformSetting from "../models/PlatformSetting.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(requireAdmin);

async function log(
  userId: string,
  type: "admin_action" | "login" | "security",
  action: string,
  details?: string,
  ip?: string
) {
  await ActivityLog.create({ userId, type, action, details, ip });
}

// ─── Dashboard Stats ───
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "bot" } });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCoordinators = await User.countDocuments({ role: "coordinator" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    const totalBots = await User.countDocuments({ role: "bot" });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);

    const messagesToday = await Message.countDocuments({
      createdAt: { $gte: todayStart },
    });
    const messagesThisWeek = await Message.countDocuments({
      createdAt: { $gte: weekStart },
    });

    const activeChats = await Message.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      { $group: { _id: "$groupId" } },
      { $count: "count" },
    ]);

    const activeChatGroups = activeChats[0]?.count || 0;

    const totalMessages = await Message.countDocuments();
    const totalGroups = await Group.countDocuments();

    const userGrowth = await User.aggregate([
      { $match: { role: { $ne: "bot" } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const activityTrend = await Message.aggregate([
      { $match: { createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const suspendedUsers = await User.countDocuments({ status: "suspended" });

    res.json({
      totalUsers,
      totalAdmins,
      totalCoordinators,
      totalRegularUsers,
      totalBots,
      messagesToday,
      messagesThisWeek,
      totalMessages,
      totalGroups,
      activeChatGroups,
      suspendedUsers,
      userGrowth,
      activityTrend,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Users CRUD ───
router.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    res.json(
      users.map((u) => ({
        id: u._id,
        username: u.username,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, status } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }
    const validRoles = ["user", "coordinator", "admin"];
    const userRole = validRoles.includes(role) ? role : "user";

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const username = email.split("@")[0] + "-" + Math.random().toString(36).slice(2, 6);
    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      name: name || "",
      role: userRole,
      status: status === "suspended" ? "suspended" : "active",
    });

    await log(
      req.user!.userId,
      "admin_action",
      `Created user ${user.username} (${user.email}) as ${userRole}`
    );

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.patch("/users/:id/suspend", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "suspended" },
      { new: true }
    ).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await log(
      req.user!.userId,
      "admin_action",
      `Suspended user ${user.username} (${user.email})`
    );
    res.json({ id: user._id, status: user.status });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.patch("/users/:id/activate", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    ).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await log(
      req.user!.userId,
      "admin_action",
      `Activated user ${user.username} (${user.email})`
    );
    res.json({ id: user._id, status: user.status });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.patch("/users/:id/role", async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!["user", "coordinator", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }
    if (req.params.id === req.user!.userId) {
      res.status(400).json({ error: "Cannot change your own role" });
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await log(
      req.user!.userId,
      "admin_action",
      `Changed role of ${user.username} to ${role}`
    );
    res.json({ id: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    if (req.params.id === req.user!.userId) {
      res.status(400).json({ error: "Cannot delete your own account" });
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    await log(
      req.user!.userId,
      "admin_action",
      `Deleted user ${user.username} (${user.email})`
    );
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Groups Management ───
router.get("/groups", async (_req: Request, res: Response) => {
  try {
    const groups = await Group.find().populate("members", "name email").sort({ createdAt: -1 }).lean();
    const groupsWithCounts = await Promise.all(
      groups.map(async (g) => {
        const messageCount = await Message.countDocuments({ groupId: g._id });
        return {
          id: g._id,
          name: g.name,
          avatar: g.avatar,
          memberCount: g.members?.length || 0,
          messageCount,
          createdAt: g.createdAt,
        };
      })
    );
    res.json(groupsWithCounts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/groups/:id/messages", async (req: Request, res: Response) => {
  try {
    const group = await Group.findById(req.params.id).lean();
    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }
    const messages = await Message.find({ groupId: req.params.id })
      .populate("senderId", "name username email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json(
      messages.map((m) => ({
        id: m._id,
        content: m.content,
        sender: m.senderId
          ? {
              id: (m.senderId as any)._id,
              name: (m.senderId as any).name,
              username: (m.senderId as any).username,
              email: (m.senderId as any).email,
            }
          : null,
        createdAt: m.createdAt,
        edited: m.edited,
        deleted: m.deleted,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.delete("/groups/:id", async (req: Request, res: Response) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }
    await Message.deleteMany({ groupId: req.params.id });
    await log(
      req.user!.userId,
      "admin_action",
      `Deleted group "${group.name}" with all messages`
    );
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Platform Settings ───
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    const settings = await PlatformSetting.find().lean();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.patch("/settings", async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      res.status(400).json({ error: "Key is required" });
      return;
    }
    await PlatformSetting.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true }
    );
    await log(
      req.user!.userId,
      "admin_action",
      `Updated setting "${key}" to "${value}"`
    );
    res.json({ message: "Setting updated" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Broadcast ───
router.post("/broadcast", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }
    const groups = await Group.find().lean();
    const botUser = await User.findOne({ role: "bot" }).lean();
    if (!botUser) {
      res.status(500).json({ error: "Bot user not found" });
      return;
    }
    const messages = groups.map((g) => ({
      senderId: botUser._id,
      groupId: g._id,
      content: `📢 ${content}`,
    }));
    await Message.insertMany(messages);
    await log(
      req.user!.userId,
      "admin_action",
      `Broadcast message to ${groups.length} groups`
    );
    res.json({ message: `Broadcast sent to ${groups.length} groups` });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Activity Logs ───
router.get("/logs", async (req: Request, res: Response) => {
  try {
    const { type, limit } = req.query;
    const filter: any = {};
    if (type) filter.type = type;
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name username email")
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 100)
      .lean();
    res.json(
      logs.map((l) => ({
        id: l._id,
        type: l.type,
        action: l.action,
        details: l.details,
        ip: l.ip,
        user: l.userId
          ? {
              id: (l.userId as any)._id,
              name: (l.userId as any).name,
              username: (l.userId as any).username,
              email: (l.userId as any).email,
            }
          : null,
        createdAt: l.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
