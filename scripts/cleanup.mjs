import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");
const lines = fs.readFileSync(envPath, "utf8").split("\n");
let uri = "";
for (const line of lines) {
  if (line.startsWith("MONGO_URI=")) {
    uri = line.slice(10).trim();
    break;
  }
}

async function cleanup() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const userResult = await db.collection("users").deleteMany({ username: { $ne: "admin" } });
  console.log(`Deleted ${userResult.deletedCount} fake users`);

  for (const col of ["groups", "messages", "projects", "notes", "notifications", "activitylogs"]) {
    const result = await db.collection(col).deleteMany({});
    console.log(`Deleted ${result.deletedCount} ${col}`);
  }

  const admin = await db.collection("users").findOne({ username: "admin" });
  if (admin) {
    console.log(`Admin preserved: ${admin.email} / password: admin123`);
  } else {
    console.log("No admin found - seed will create one on next login");
  }

  await mongoose.connection.close();
  console.log("Cleanup complete");
}

cleanup().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});