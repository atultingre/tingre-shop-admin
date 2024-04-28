import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://atultingre:atultingre@cluster0.ltp1czg.mongodb.net/food-delivery"
    );
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB. Error:", error);
    process.exit(1);
  }
};
