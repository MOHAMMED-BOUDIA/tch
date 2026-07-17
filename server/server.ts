import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/auth.js";
import graphRouter from "./routers/graph.js";
import usersRouter from "./routers/users.js";
import projectRouter from "./routers/projects.js";
import notesRouter from "./routers/notes.js";
import adminRouter from "./routers/admin.js";
import messagesRouter from "./routers/messages.js";
import { connectDb } from "./db.js";
import { createSocketServer } from "./socket.js";

dotenv.config();

async function startServer() {
  await connectDb();

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRouter);
  app.use("/api/graph", graphRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/notes", notesRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/messages", messagesRouter);

  const distPath = path.join(process.cwd(), "dist");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("/{*path}", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = http.createServer(app);
  createSocketServer(server);

  const PORT = process.env.PORT || 5000;
  server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
