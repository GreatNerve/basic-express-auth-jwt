import mongoose from "mongoose";
import { MONGO_URI } from "../config/constants.js";

if (!MONGO_URI) {
    console.error("MONGO_URI is not set");
    process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error);
    process.exit(1);
  }
};
export default connectDB;
