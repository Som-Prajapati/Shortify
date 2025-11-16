import mongoose from "mongoose";

const domainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,

      trim: true,
      lowercase: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    verify_token: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {},
  }
);

//static methods
domainSchema.statics.getDomainList = async function (user_id) {
  const array = await this.find({ user_id }).select("name -_id");
  return array.map((item) => item.name);
};

//indexes
domainSchema.index({ name: 1 }, { unique: true });
domainSchema.index({ user_id: 1 });
domainSchema.index({ verified: 1 });

export default mongoose.model("Domain", domainSchema);
