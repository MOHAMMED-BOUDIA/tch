import { jsonResponse } from "@/lib/auth";

export async function POST() {
  return jsonResponse({ message: "Logged out" });
}
