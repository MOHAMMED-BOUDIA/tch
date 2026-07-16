import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  content: string;
}

const MessageSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
