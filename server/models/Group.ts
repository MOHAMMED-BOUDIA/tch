import mongoose, { Schema, Document } from "mongoose";

export interface IGroup extends Document {
  name: string;
}

const GroupSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGroup>("Group", GroupSchema);
