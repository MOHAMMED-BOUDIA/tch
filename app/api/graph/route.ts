import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import Message from "@/lib/models/Message";
import { requireAuth, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireAuth(req);

    const senders = await Message.aggregate([
      { $group: { _id: "$senderId" } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $match: { "user.role": { $ne: "admin" } } },
      { $project: { _id: 1, name: "$user.name" } },
    ]);

    const nodes = senders.map((s, i) => ({
      id: i + 1,
      name: s.name,
      role: s.name === "Nexus Assistant" ? "AI Assistant" : "coordinator",
      avatar: "",
      status: "online" as const,
      contribution: "0",
    }));

    const nameToNodeId = new Map<string, number>();
    for (const node of nodes) nameToNodeId.set(node.name, node.id);

    const participantsByGroup = await Message.aggregate([
      { $lookup: { from: "users", localField: "senderId", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $group: { _id: "$groupId", participantNames: { $addToSet: "$user.name" } } },
      { $match: { $expr: { $gte: [{ $size: "$participantNames" }, 2] } } },
    ]);

    const edgeSet = new Set<string>();
    for (const { participantNames } of participantsByGroup) {
      for (let i = 0; i < participantNames.length; i++) {
        for (let j = i + 1; j < participantNames.length; j++) {
          if (participantNames[i] !== participantNames[j]) {
            const key = [participantNames[i], participantNames[j]].sort().join(":");
            edgeSet.add(key);
          }
        }
      }
    }

    const connections: { from: number; to: number }[] = [];
    for (const key of edgeSet) {
      const [a, b] = key.split(":");
      const fromId = nameToNodeId.get(a);
      const toId = nameToNodeId.get(b);
      if (fromId && toId) connections.push({ from: fromId, to: toId });
    }

    return jsonResponse({ nodes, connections });
  } catch (err) {
    return errorResponse(err);
  }
}
