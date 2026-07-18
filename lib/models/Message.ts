import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  content: string;
  edited: boolean;
  deleted: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    content: { type: String, required: true },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
