import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  type: "admin_action" | "login" | "security";
  action: string;
  details?: string;
  ip?: string;
}

const ActivityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["admin_action", "login", "security"],
      required: true,
    },
    action: { type: String, required: true },
    details: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
