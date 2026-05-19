import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT_SECRET is missing in backend environment variables");
    err.status = 500;
    throw err;
  }
  return process.env.JWT_SECRET;
};

export const verifyToken = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Read token from cookies (Ensure cookie-parser middleware is configured on your main app file!)
      const token = req.cookies ? req.cookies.token : null;
      
      if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please login" });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, getJwtSecret());

      // Check if role is allowed
      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden. You don't have permission" });
      }

      // Attach user info to req for use in routes
      req.user = decodedToken;

      next();
    } catch (err) {
      // jwt.verify throws if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please login again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }
      next(err);
    }
  };
};