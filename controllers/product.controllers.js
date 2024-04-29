import productModel from "../models/product.model.js";
import { storage } from "../middlewares/firebase.js";

// add Product
const addProduct = async (req, res) => {
  try {
    // Create a new product document with the image URL
    const product = new productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
    });

    await product.save();
    res.json({ success: true, message: "Food Added", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get all Product list
const listProduct = async (req, res) => {
  try {
    const product = await productModel.find({});
    res.json({ success: true, data: product });
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    console.log("updates: ", updates);

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

    res.json({
      success: true,
      message: "Product Updated",
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
    const product = await productModel.findById(req.body.id);

    // Get the full path of the file in Firebase Storage from the product document
    const fullPath = product.image;

    // Delete the file from Firebase Storage
    const storageRef = storage.refFromURL(fullPath); // Use refFromURL instead of ref
    await storageRef.delete();

    // Remove the product from MongoDB
    await productModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.log("Object not found in Firebase Storage.");
      res.status(404).json({
        success: false,
        message: "Object not found in Firebase Storage.",
      });
    } else {
      console.log("Error:", error);
      res.status(500).json({ success: false, message: "Error" });
    }
  }
};

export { addProduct, listProduct, updateProduct, removeProduct };
