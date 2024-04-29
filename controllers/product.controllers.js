import fs from "fs";
import productModel from "../models/product.model.js";

// add food item
const addProduct = async (req, res) => {
  const product = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
  });

  try {
    await product.save();
    res.json({ success: true, message: "product Added", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all Product list
const listProduct = async (req, res) => {
  try {
    const product = await productModel.find({});
    res.json({ success: true, data: product });
  } catch (error) {
    console.log('error: ', error);
    res.json({ success: false, message: "Error" });
  }
};

const updateProduct = async (req, res) => {};

const removeProduct = async (req, res) => {};

export { addProduct, listProduct, updateProduct, removeProduct };
