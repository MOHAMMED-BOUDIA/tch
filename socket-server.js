const { Server } = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const envPath = path.resolve(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq !== -1) {
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexus";
const JWT_SECRET = process.env.JWT_SECRET || "nexus-local-dev-secret-key-change-in-production";
const PORT = process.env.SOCKET_PORT || 3001;

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(MONGO_URI).then(() => console.log("[Socket] MongoDB connected"));

const User = mongoose.model("User", new mongoose.Schema({
  username: String, email: String, password: String,
  role: { type: String, enum: ["user", "coordinator", "admin", "bot"] },
  status: { type: String, enum: ["active", "suspended"] },
  name: String, title: String, bio: String, location: String, website: String,
  avatar: String, lastLogin: Date,
}, { timestamps: true }));

const Group = mongoose.model("Group", new mongoose.Schema({
  name: String, avatar: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true }));

const Message = mongoose.model("Message", new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  content: { type: String, required: true },
  edited: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
}, { timestamps: true }));

io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    socket.role = decoded.role;
    next();
  } catch (_e) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", function(socket) {
  console.log("[Socket] User " + socket.userId + " connected");

  socket.on("groups:list", async function() {
    const groups = await Group.find({}).lean();
    const list = groups.map(function(g) {
      return { id: g._id.toString(), title: g.name, avatar: g.avatar || "" };
    });
    socket.emit("groups:list", list);
  });

  socket.on("groups:join", async function(data) {
    socket.join(data.groupId);
    const msgs = await Message.find({ groupId: data.groupId }).populate("senderId", "name").sort({ createdAt: 1 }).lean();
    const messages = msgs.map(function(m) {
      const sender = m.senderId || {};
      return {
        id: m._id.toString(),
        senderId: (sender._id && sender._id.toString()) || m.senderId.toString(),
        receiverId: m.receiverId ? m.receiverId.toString() : null,
        groupId: m.groupId ? m.groupId.toString() : null,
        content: m.content,
        senderName: sender.name || "Unknown",
        created_at: m.createdAt.toISOString(),
        edited: m.edited || false,
        deleted: m.deleted || false,
      };
    });
    socket.emit("messages:history", { groupId: data.groupId, messages: messages });
    const group = await Group.findById(data.groupId).populate("members", "name email avatar").lean();
    if (group) {
      const members = (group.members || []).map(function(m) {
        return { id: m._id.toString(), name: m.name, email: m.email, avatar: m.avatar || "" };
      });
      socket.emit("group:members", { groupId: data.groupId, members: members });
    }
  });

  socket.on("group:create", async function(data) {
    const group = await Group.create({ name: data.name, members: [socket.userId] });
    io.emit("groups:list", await getAllGroups());
    socket.emit("group:created", { id: group._id.toString(), title: group.name, avatar: group.avatar || "" });
  });

  socket.on("group:members", async function(data) {
    const group = await Group.findById(data.groupId).populate("members", "name email avatar").lean();
    if (group) {
      const members = (group.members || []).map(function(m) {
        return { id: m._id.toString(), name: m.name, email: m.email, avatar: m.avatar || "" };
      });
      socket.emit("group:members", { groupId: data.groupId, members: members });
    }
  });

  socket.on("group:add-member", async function(data) {
    await Group.findByIdAndUpdate(data.groupId, { $addToSet: { members: data.userId } });
    const group = await Group.findById(data.groupId).populate("members", "name email avatar").lean();
    if (group) {
      const members = (group.members || []).map(function(m) {
        return { id: m._id.toString(), name: m.name, email: m.email, avatar: m.avatar || "" };
      });
      io.to(data.groupId).emit("group:members", { groupId: data.groupId, members: members });
    }
  });

  socket.on("group:remove-member", async function(data) {
    await Group.findByIdAndUpdate(data.groupId, { $pull: { members: data.userId } });
    const group = await Group.findById(data.groupId).populate("members", "name email avatar").lean();
    if (group) {
      const members = (group.members || []).map(function(m) {
        return { id: m._id.toString(), name: m.name, email: m.email, avatar: m.avatar || "" };
      });
      io.to(data.groupId).emit("group:members", { groupId: data.groupId, members: members });
    }
  });

  socket.on("group:delete", async function(data) {
    await Message.deleteMany({ groupId: data.groupId });
    await Group.findByIdAndDelete(data.groupId);
    io.emit("groups:list", await getAllGroups());
  });

  socket.on("group:update", async function(data) {
    const group = await Group.findByIdAndUpdate(data.groupId, { name: data.name }, { new: true }).lean();
    if (group) {
      io.to(data.groupId).emit("group:updated", { id: group._id.toString(), title: group.name, avatar: group.avatar || "" });
      io.emit("groups:list", await getAllGroups());
    }
  });

  socket.on("message:send", async function(data) {
    const msg = await Message.create({ senderId: socket.userId, groupId: data.groupId, content: data.content });
    const user = await User.findById(socket.userId).lean();
    const message = {
      id: msg._id.toString(),
      senderId: socket.userId,
      receiverId: null,
      groupId: data.groupId,
      content: data.content,
      senderName: (user && user.name) || "Unknown",
      created_at: msg.createdAt.toISOString(),
      edited: false,
      deleted: false,
    };
    io.to(data.groupId).emit("message:new", message);
  });

  socket.on("message:edit", async function(data) {
    await Message.findByIdAndUpdate(data.messageId, { content: data.content, edited: true });
    const msg = await Message.findById(data.messageId).lean();
    if (msg) {
      io.to(msg.groupId.toString()).emit("message:edited", {
        id: data.messageId, content: data.content, edited: true,
      });
    }
  });

  socket.on("message:delete", async function(data) {
    const msg = await Message.findByIdAndUpdate(data.messageId, { deleted: true, content: "This message was deleted" }, { new: true }).lean();
    if (msg) {
      io.to(msg.groupId.toString()).emit("message:deleted", {
        id: data.messageId, groupId: msg.groupId.toString(),
        content: "This message was deleted", deleted: true,
      });
    }
  });

  socket.on("disconnect", function() {
    console.log("[Socket] User " + socket.userId + " disconnected");
  });
});

async function getAllGroups() {
  const groups = await Group.find({}).lean();
  return groups.map(g => ({ id: g._id.toString(), title: g.name, avatar: g.avatar || "" }));
}

server.listen(PORT, () => {
  console.log(`[Socket] Server running on port ${PORT}`);
});
