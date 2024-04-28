import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints

// server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
