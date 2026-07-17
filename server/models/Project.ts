import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  status: string;
  image: string;
  link: string;
  contributorsCount: number;
  performanceScore?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
    contributorsCount: { type: Number, default: 0 },
    performanceScore: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
