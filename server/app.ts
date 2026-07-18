import express from "express";
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

dotenv.config();

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

export default app;
