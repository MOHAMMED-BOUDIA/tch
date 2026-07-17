import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  if (user.status === "suspended") {
    res.status(403).json({ error: "Account is suspended" });
    return;
  }
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken({ userId: user._id.toString(), role: user.role });
  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "Username, email, and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    res.status(409).json({ error: "Email or username already taken" });
    return;
  }
  const hashed = bcrypt.hashSync(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashed,
    role: "user",
    status: "active",
    name: name || username,
  });
  const token = generateToken({ userId: user._id.toString(), role: user.role });
  res.status(201).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.json({ message: "If that email exists, a reset link has been sent." });
    return;
  }
  const resetToken = generateToken({ userId: user._id.toString(), role: user.role });
  res.json({ message: "If that email exists, a reset link has been sent." });
});

export default router;
