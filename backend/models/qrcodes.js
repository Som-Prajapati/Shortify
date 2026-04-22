import mongoose from "mongoose";

const qrcodeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["url", "text", "phone", "email"],
    },
    size: {
      type: Number,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at" },
  },
);

//instance for increment clicks
qrcodeSchema.index({ user_id: 1 });
qrcodeSchema.index(
  { user_id: 1, content: 1, size: 1, color: 1 },
  { unique: true },
);

export default mongoose.model("Qrcode", qrcodeSchema);
