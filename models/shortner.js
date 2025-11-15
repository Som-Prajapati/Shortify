import mongoose from "mongoose";

const shortenerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    shortid: {
      type: String,
      required: true,
      trim: true,
    },
    original_url: {
      type: String,
      required: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
shortenerSchema.index({ domain: 1, shortid: 1 }, { unique: true });
shortenerSchema.index({ user_id: 1 });

export default mongoose.model("Shortener", shortenerSchema);
