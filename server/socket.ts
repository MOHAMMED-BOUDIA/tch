import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Group from "./models/Group.js";
import Message from "./models/Message.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-admin-secret-key-change-in-production";

interface AuthUser {
  userId: string;
  role: string;
  name: string;
}

export function createSocketServer(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token || (socket.handshake.query?.token as string);
    if (!token) {
      next(new Error("Authentication required"));
      return;
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(payload.userId);
      if (!user || user.status === "suspended") {
        next(new Error("Account is suspended"));
        return;
      }
      if (user.role !== "coordinateur" && user.role !== "admin") {
        next(new Error("Only coordinators can access chat"));
        return;
      }
      (socket as any).user = { userId: user._id.toString(), role: user.role, name: user.name || user.username };
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as any).user as AuthUser;
    console.log(`Socket connected: ${user.name} (${user.role})`);

    const groups = await Group.find().sort({ createdAt: 1 });
    for (const group of groups) {
      socket.join(`group:${group._id}`);
    }

    socket.emit("groups:list", groups.map((g) => ({ id: g._id, title: g.name })));

    socket.on("groups:join", async ({ groupId }: { groupId: string }) => {
      socket.join(`group:${groupId}`);
      const messages = await Message.find({ groupId })
        .sort({ createdAt: 1 })
        .populate("senderId", "name")
        .lean();

      const formatted = messages.map((m: any) => ({
        id: m._id,
        senderId: m.senderId?._id || m.senderId,
        receiverId: m.receiverId,
        groupId: m.groupId,
        content: m.content,
        created_at: m.createdAt,
        senderName: m.senderId?.name || "Unknown",
      }));

      socket.emit("messages:history", { groupId, messages: formatted });
    });

    socket.on("message:send", async ({ groupId, content }: { groupId: string; content: string }) => {
      if (!content?.trim()) return;

      const msg = await Message.create({
        senderId: user.userId,
        groupId,
        content,
      });

      const populated = await Message.findById(msg._id)
        .populate("senderId", "name")
        .lean();

      const message = {
        id: populated!._id,
        senderId: (populated as any).senderId?._id || (populated as any).senderId,
        receiverId: (populated as any).receiverId,
        groupId: (populated as any).groupId,
        content: (populated as any).content,
        created_at: (populated as any).createdAt,
        senderName: (populated as any).senderId?.name || "Unknown",
      };

      io.to(`group:${groupId}`).emit("message:new", message);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${user.name}`);
    });
  });

  return io;
}
