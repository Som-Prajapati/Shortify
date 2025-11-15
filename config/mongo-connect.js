import mongoose from "mongoose";

export default async function mongoConnector() {
  try {
    const MONGO_ATLAS_URL = process.env.MONGO_ATLAS_URL;
    await mongoose.connect(MONGO_ATLAS_URL);
    console.log("Connected to Mongo Atlas");
  } catch (err) {
    console.log("Failed to connect Mongo : " + err);
  }
}
