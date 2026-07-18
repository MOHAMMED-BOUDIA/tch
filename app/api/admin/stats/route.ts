import { NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import User from "@/lib/models/User";
import Group from "@/lib/models/Group";
import Message from "@/lib/models/Message";
import { requireRole, errorResponse, jsonResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    await requireRole(req, "admin");

    const totalUsers = await User.countDocuments({ role: { $ne: "bot" } });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCoordinators = await User.countDocuments({ role: "coordinator" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    const totalBots = await User.countDocuments({ role: "bot" });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - todayStart.getDay() * 86400000);

    const messagesToday = await Message.countDocuments({ createdAt: { $gte: todayStart } });
    const messagesThisWeek = await Message.countDocuments({ createdAt: { $gte: weekStart } });

    const activeChats = await Message.aggregate([
      { $match: { createdAt: { $gte: todayStart } } },
      { $group: { _id: "$groupId" } },
      { $count: "count" },
    ]);

    const totalMessages = await Message.countDocuments();
    const totalGroups = await Group.countDocuments();
    const activeChatGroups = activeChats[0]?.count || 0;

    const userGrowth = await User.aggregate([
      { $match: { role: { $ne: "bot" } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const activityTrend = await Message.aggregate([
      { $match: { createdAt: { $gte: weekStart } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const suspendedUsers = await User.countDocuments({ status: "suspended" });

    return jsonResponse({
      totalUsers, totalAdmins, totalCoordinators, totalRegularUsers, totalBots,
      messagesToday, messagesThisWeek, totalMessages, totalGroups, activeChatGroups,
      suspendedUsers, userGrowth, activityTrend,
    });
  } catch (err) {
    return errorResponse(err);
  }
}
