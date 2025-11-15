import mongoose from "mongoose";

const shortenerLookupSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// compound index
shortenerLookupSchema.index({ domain: 1, shortid: 1 }, { unique: true });

export default mongoose.model("ShortenerLookup", shortenerLookupSchema);
