import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const userRoute = exp.Router();

// ==========================================
// 🔐 AUTHENTICATION ROUTES
// ==========================================

// Login User & Set Secure Cross-Domain Cookie
userRoute.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Authenticate user
    const { user, token } = await authenticate({ username, password });

    // Configure cookie to bypass cross-domain (Vercel to Render) restrictions
    res.cookie("token", token, {
      httpOnly: true,         // Protects against XSS attacks
      secure: true,           // Required for HTTPS (Render production env)
      sameSite: "none",       // Required for cross-site cookie transfers
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
    });

    res.status(200).json({
      message: "Login success",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});

// Logout User & Clear Cookie
userRoute.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// ==========================================
// 📝 USER & ARTICLE ROUTES
// ==========================================

// Register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    let userObj = req.body;

    // Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Step 3: rollback on failure
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err); 
  }
});

// Read all articles (protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res, next) => {
  try {
    // Read articles of all authors which are active
    const articles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName email")
      .populate("comments.user", "firstName lastName email profileImageUrl");
    res.status(200).json({ message: "all articles", payload: articles });
  } catch (err) {
    next(err);
  }
});

// Add comment to an article (protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res, next) => {
  try {
    // Get comment obj from req
    const { user, articleId, comment } = req.body;
    
    // Check if the performing user matches the authenticated user ID
    if (user !== req.user.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Find article by id and update
    let articleWithComment = await ArticleModel.findOneAndUpdate(
      { _id: articleId, isArticleActive: true },
      { $push: { comments: { user, comment } } },
      { new: true, runValidators: true },
    )
      .populate("author", "firstName email")
      .populate("comments.user", "firstName lastName email profileImageUrl");

    // If article not found
    if (!articleWithComment) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "comment added successfully", payload: articleWithComment });
  } catch (err) {
    next(err);
  }
});

// Delete own comment from an article
userRoute.delete("/articles/:articleId/comments/:commentId", verifyToken("USER"), async (req, res, next) => {
  try {
    const { articleId, commentId } = req.params;
    const article = await ArticleModel.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const comment = article.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can delete only your own comment" });
    }

    article.comments.pull(commentId);
    await article.save();

    const updatedArticle = await ArticleModel.findById(articleId)
      .populate("author", "firstName email")
      .populate("comments.user", "firstName lastName email profileImageUrl");

    res.status(200).json({ message: "comment deleted", payload: updatedArticle });
  } catch (err) {
    next(err);
  }
});
