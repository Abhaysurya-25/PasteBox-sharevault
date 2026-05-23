import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";

dotenv.config();

const resolveMongoUri = () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
  if (!uri) {
    throw new Error("MONGODB_URI or MONGODB_URL is required in server/.env");
  }

  const normalized = uri.trim().replace(/\/$/, "");
  const hasPath = /mongodb(?:\+srv)?:\/\/.*\/[^/?]+/.test(normalized);

  return hasPath ? normalized : `${normalized}/${DB_NAME}`;
};

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(resolveMongoUri());
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

