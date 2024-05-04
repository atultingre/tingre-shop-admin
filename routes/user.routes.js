import express from "express";
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/reset", resetPassword);

export default userRouter;
