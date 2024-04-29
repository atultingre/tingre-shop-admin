import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  updateProduct,
} from "../controllers/product.controllers.js";
import multer from "multer";

const productRouter = express.Router();
// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    console.log(req.file);
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

productRouter.post("/add", upload.single("image"), addProduct);
productRouter.post("/remove", removeProduct);
productRouter.put("/update/:id", updateProduct);
productRouter.get("/list", listProduct);

export default productRouter;
