import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../utils/hashing.js";

// schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Instance method
userSchema.methods.setPassword = async function (plain) {
  this.password = await hashPassword(plain);
};

userSchema.methods.comparePassword = async function (plain) {
  return await comparePassword(plain, this.password);
};

//static methods
userSchema.statics.findUserByEmail = async function (email) {
  return await this.findOne({ email });
};

userSchema.statics.findUserByID = async function (id) {
  return await this.findByID({ id });
};

// indexing
userSchema.index({
  email: 1,
  unique: true,
});

export default mongoose.model("User", userSchema);
