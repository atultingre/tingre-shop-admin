import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/user.model.js";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email, phone } = req.body;

  try {
    // Check if name, email, and password are provided
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and password are required",
      });
    }

    // checking is user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (at least 8 characters)",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      isAdmin: false,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { email, phone, newPassword, confirmPassword } = req.body;

  try {
    // Check if email, phone, newPassword, and confirmPassword are provided
    if (!email || !phone || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, phone, new password, and confirm password are required",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if phone matches the user's phone
    if (user.phone !== phone) {
      return res
        .status(401)
        .json({ success: false, message: "Phone does not match" });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (at least 8 characters)",
      });
    }

    // Check if new password matches the confirmed password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { loginUser, registerUser, resetPassword };
