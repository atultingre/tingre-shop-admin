import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized please login again",
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("token_decode: ", token_decode);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

export default authMiddleware;
