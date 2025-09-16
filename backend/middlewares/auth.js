import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is missing. Please sign in.",
    });
  }
  
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format. Use 'Bearer <token>'.",
    });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecode.userId; // Consistent with token creation
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

export default authUser;