// import jwt from "jsonwebtoken";

// const adminAuth = async (req, res, next) => {
//   const { token } = req.headers;
//   try {
//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Not Authorized, Login Again",
//       });
//     }
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//       return res.json({
//         success: false,
//         message: "Not Authorized, Login Again",
//       });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     return res.json({ success: false, message: error.message });
//   }
// }

// export default adminAuth



// middleware/adminAuth.js
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token belongs to admin
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Attach decoded data for further use
    req.admin = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;
