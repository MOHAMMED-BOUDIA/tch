import mongoose, { Schema, Document } from "mongoose";

export interface IPlatformSetting extends Document {
  key: string;
  value: string;
}

const PlatformSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PlatformSetting || mongoose.model<IPlatformSetting>("PlatformSetting", PlatformSettingSchema);
