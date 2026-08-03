import mongoose from "mongoose";
import { seedIfEmpty } from "./seed";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/nexus";

let cached = (global as any).__mongooseCache;
if (!cached) {
  cached = (global as any).__mongooseCache = { conn: null, promise: null };
}

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 }).then(async (m) => {
      console.log("[DB] Connected to MongoDB");
      await seedIfEmpty();
      return m;
    }).catch((err) => {
      console.error("[DB] MongoDB connection error:", err.message);
      cached.promise = null;
      throw err;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch {
    cached.promise = null;
    throw new Error("Failed to connect to MongoDB");
  }
  return cached.conn;
}