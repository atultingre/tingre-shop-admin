import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB. Error:", error);
    process.exit(1);
  }
};
