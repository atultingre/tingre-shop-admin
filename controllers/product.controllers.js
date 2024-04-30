import productModel from "../models/product.model.js";
import { storage } from "../middlewares/firebase.js";

// add Product
const addProduct = async (req, res) => {
  try {
    // Input validation
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      !req.body.category ||
      !req.body.image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Create a new product document with the image URL
    const product = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
    });

    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all Product list
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Input validation
    if (!productId || Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    // Check if the product exists
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update the product fields
    existingProduct.name = updates.name;
    existingProduct.description = updates.description;
    existingProduct.price = updates.price;
    existingProduct.category = updates.category;

    // Check if a new image is provided
    if (updates.image !== existingProduct.image) {
      // If a new image is provided, delete the old image from Firebase Storage
      const storageRef = storage.refFromURL(existingProduct.image);
      await storageRef.delete();

      // Update the image URL with the new one
    }
    existingProduct.image = updates.image;

    // Save the updated product
    await existingProduct.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    // Input validation
    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Get the full path of the file in Firebase Storage from the product document
    const fullPath = product.image;

    // Delete the file from Firebase Storage
    const storageRef = storage.refFromURL(fullPath); // Use refFromURL instead of ref
    await storageRef.delete();

    // Remove the product from MongoDB
    await productModel.findByIdAndDelete(productId);

    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.error("Object not found in Firebase Storage.");
      res.status(404).json({
        success: false,
        message: "Object not found in Firebase Storage",
      });
    } else {
      console.error("Error removing product:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};

export { addProduct, listProduct, updateProduct, removeProduct };
