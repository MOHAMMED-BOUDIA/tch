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

function formatGroup(g: any) {
  return { id: g._id, title: g.name, avatar: g.avatar || "" };
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

      (socket as any).user = { userId: user._id.toString(), role: user.role, name: user.name || user.username };
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = (socket as any).user as AuthUser;
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
        edited: m.edited || false,
        deleted: m.deleted || false,
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
        edited: false,
        deleted: false,
      };

      io.to(`group:${groupId}`).emit("message:new", message);
    });

    socket.on("message:edit", async ({ messageId, content }: { messageId: string; content: string }) => {
      if (!content?.trim()) return;
      const msg = await Message.findById(messageId);
      if (!msg) return;
      if (msg.senderId.toString() !== user.userId) return;

      msg.content = content;
      msg.edited = true;
      await msg.save();

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
        edited: (populated as any).edited,
      };

      io.to(`group:${msg.groupId}`).emit("message:edited", message);
    });

    socket.on("message:delete", async ({ messageId }: { messageId: string }) => {
      const msg = await Message.findById(messageId);
      if (!msg) return;
      if (msg.senderId.toString() !== user.userId) return;

      msg.content = "This message was deleted";
      msg.deleted = true;
      await msg.save();

      io.to(`group:${msg.groupId}`).emit("message:deleted", {
        id: msg._id,
        groupId: msg.groupId,
        content: msg.content,
        deleted: true,
      });
    });

    socket.on("group:delete", async ({ groupId }: { groupId: string }) => {
      const group = await Group.findById(groupId);
      if (!group) return;

      await Message.deleteMany({ groupId });
      await Group.findByIdAndDelete(groupId);

      io.emit("groups:list", (await Group.find().sort({ createdAt: 1 })).map(g => formatGroup(g)));
    });

    socket.on("group:create", async ({ name }: { name: string }) => {
      const existing = await Group.findOne({ name });
      if (existing) {
        socket.join(`group:${existing._id}`);
        socket.emit("groups:list", (await Group.find().sort({ createdAt: 1 })).map(g => formatGroup(g)));
        return;
      }
      const group = await Group.create({ name, members: [user.userId] });
      socket.join(`group:${group._id}`);
      const groups = await Group.find().sort({ createdAt: 1 });
      io.emit("groups:list", groups.map(g => formatGroup(g)));
    });

    socket.on("group:update", async ({ groupId, name, avatar }: { groupId: string; name?: string; avatar?: string }) => {
      const group = await Group.findById(groupId);
      if (!group) return;
      if (name !== undefined) group.name = name;
      if (avatar !== undefined) group.avatar = avatar;
      await group.save();
      io.emit("groups:list", (await Group.find().sort({ createdAt: 1 })).map(g => formatGroup(g)));
      io.to(`group:${groupId}`).emit("group:updated", { id: group._id, title: group.name, avatar: group.avatar });
    });

    socket.on("group:members", async ({ groupId }: { groupId: string }) => {
      const group = await Group.findById(groupId).populate("members", "name avatar email").lean();
      if (!group) return;
      socket.emit("group:members", {
        groupId,
        members: (group as any).members.map((m: any) => ({
          id: m._id,
          name: m.name || "Unknown",
          avatar: m.avatar || "",
          email: m.email || "",
        })),
      });
    });

    socket.on("group:add-member", async ({ groupId, userId: targetId }: { groupId: string; userId: string }) => {
      const group = await Group.findById(groupId);
      if (!group) return;
      if (group.members.some(m => m.toString() === targetId)) return;
      group.members.push(targetId as any);
      await group.save();
      const populated = await Group.findById(groupId).populate("members", "name avatar email").lean();
      socket.emit("group:members", {
        groupId,
        members: (populated as any).members.map((m: any) => ({
          id: m._id,
          name: m.name || "Unknown",
          avatar: m.avatar || "",
          email: m.email || "",
        })),
      });
      io.to(`group:${groupId}`).emit("group:updated", { id: group._id, title: group.name, avatar: group.avatar });
    });

    socket.on("group:remove-member", async ({ groupId, userId: targetId }: { groupId: string; userId: string }) => {
      const group = await Group.findById(groupId);
      if (!group) return;
      group.members = group.members.filter(m => m.toString() !== targetId);
      await group.save();
      const populated = await Group.findById(groupId).populate("members", "name avatar email").lean();
      socket.emit("group:members", {
        groupId,
        members: (populated as any).members.map((m: any) => ({
          id: m._id,
          name: m.name || "Unknown",
          avatar: m.avatar || "",
          email: m.email || "",
        })),
      });
      io.to(`group:${groupId}`).emit("group:updated", { id: group._id, title: group.name, avatar: group.avatar });
    });

    socket.on("disconnect", () => {});
  });

  return io;
}
