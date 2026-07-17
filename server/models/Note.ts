import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  status: "Draft" | "Published" | "Shared";
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Published", "Shared"],
      default: "Draft",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", NoteSchema);
