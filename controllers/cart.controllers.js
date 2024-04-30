import userModel from "../models/user.model.js";

// add items to user cart
const addToCart = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.userId || !req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID and item ID are required.",
      });
    }

    let userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = (await userData.cartData) || {};

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.userId || !req.body.itemId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID and item ID are required.",
      });
    }

    const userData = await userModel.findById(req.body.userId);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user cart data
const getCart = async (req, res) => {
  try {
    // Validate request body
    if (!req.body.userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID is required.",
      });
    }

    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = await userData.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, removeFromCart, getCart };
