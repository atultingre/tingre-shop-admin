import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controllers.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;
