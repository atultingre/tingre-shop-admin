import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import "dotenv/config";


// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      // payment: false,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully." });
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error placing order." });
  }
};

// users order for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {};

// api for updating order status
const updateStatus = async (req, res) => {};

export { placeOrder, userOrders, listOrders, updateStatus };
