import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const total = await Post.countDocuments();
  const posts = await Post.find().sort({ date: -1 }).skip(skip).limit(limit);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    posts
  });
});

export default router;
