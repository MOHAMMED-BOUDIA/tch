import mongoose, { Schema, Document } from "mongoose";

export interface IUpload extends Document {
  filename: string;
  mimeType: string;
  data: Buffer;
  size: number;
  createdAt: Date;
}

const UploadSchema = new Schema(
  {
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Upload || mongoose.model<IUpload>("Upload", UploadSchema);