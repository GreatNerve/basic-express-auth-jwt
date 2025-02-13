import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/constants.js";
import { generateAccessToken } from "../utils/jwtHelper.js";

if (!JWT_ACCESS_SECRET) {
  console.error("JWT_SECRET is not set");
  process.exit(1);
}

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "No token provided",
      data: null,
      errorType: "UNAUTHORIZED",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    const newToken = generateAccessToken({ id: decoded.id });
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        data: null,
        errorType: "TOKEN_EXPIRED",
      });
    }
    res.status(401).json({
      success: false,
      message: "Invalid token",
      data: null,
      errorType: "UNAUTHORIZED",
    });
  }
};

export default authMiddleware;
