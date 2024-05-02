import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/order.controllers.js";
// verifyOrder,

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
// orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/status", updateStatus);
orderRouter.get("/list", listOrders);

export default orderRouter;
