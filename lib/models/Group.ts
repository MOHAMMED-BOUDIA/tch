import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
  avatar?: string;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);
