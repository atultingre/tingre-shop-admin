import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
