import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import "dotenv/config";

// placing user order from frontend

const placeOrder = async (req, res) => {};

const verifyOrder = async (req, res) => {};

// users order for frontend
const userOrders = async (req, res) => {};

// Listing orders for admin panel
const listOrders = async (req, res) => {};

// api for updating order status
const updateStatus = async (req, res) => {};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
