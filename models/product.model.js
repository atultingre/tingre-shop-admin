import mongoose from "mongoose";

const productSchema = new mongoose.Schema({});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
