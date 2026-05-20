import exp from "express";
import { authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import bcrypt from "bcryptjs";
import { verifyToken } from "../middlewares/verifyToken.js";
export const commonRouter = exp.Router();

const getAuthCookieOptions = (req) => {
  const origin = req.get("origin") || "";
  const isSecureRequest =
    process.env.NODE_ENV === "production" || origin.startsWith("https://") || req.get("x-forwarded-proto") === "https";

  return {
    httpOnly: true,
    sameSite: isSecureRequest ? "none" : "lax",
    secure: isSecureRequest,
  };
};

//login
commonRouter.post("/login", async (req, res) => {
  //get user cred object
  let userCred = req.body;
  //call authenticate service
  let { token, user } = await authenticate(userCred);
  //save tokan as httpOnly cookie
  res.cookie("token", token, getAuthCookieOptions(req));
  //send res
  res.status(200).json({ message: "login success", payload: user });
});

//logout for User, Author and Admin
commonRouter.get("/logout", (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", getAuthCookieOptions(req));

  res.status(200).json({ message: "Logged out successfully" });
});

//Change password(Protected route)
commonRouter.put("/change-password", async (req, res) => {
  //get current password and new password
  const { role, email, currentPassword, newPassword } = req.body;
  // Prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({ message: "newPassword must be different from currentPassword" });
  }

  // Find user by email (works for USER, AUTHOR, ADMIN — all same collection)
  const account = await UserTypeModel.findOne({ email });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, account.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }
  // Hash and save new password
  account.password = await bcrypt.hash(newPassword, 10);
  await account.save();

  res.status(200).json({ message: "Password changed successfully" });
});

//Page refresh
commonRouter.get("/check-auth", (req, res, next) => {
  if (!req.cookies?.token) {
    return res.status(200).json({
      message: "not authenticated",
      payload: null,
    });
  }

  next();
}, verifyToken("USER","AUTHOR","ADMIN"), async (req, res, next) => {
  try {
    const user = await UserTypeModel.findById(req.user.userId).select("-password");

    res.status(200).json({
      message: user ? "authenticated" : "not authenticated",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});

commonRouter.get("/articles/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id)
      .populate("author", "firstName email")
      .populate("comments.user", "firstName lastName email profileImageUrl");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "article", payload: article });
  } catch (err) {
    next(err);
  }
});
