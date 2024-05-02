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
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, userOrders, listOrders, updateStatus };
