import express from "express";
import Post from "../../models/Post.js"; 
import { protectAdmin } from "../../middleware/authMiddleware.js";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();
const upload = multer();

router.post("/", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, content, category, date, referLink, author: customAuthor } = req.body;
    const author = customAuthor || req.admin?.name || "Admin";

    let imageUrl = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "news_images" }, (err, res) => err ? reject(err) : resolve(res));
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const post = new Post({ title, content, category, date, author, image: imageUrl, referLink });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    Object.assign(post, req.body); // Updates referLink automatically from req.body

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "news_images" }, (err, res) => err ? reject(err) : resolve(res));
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      post.image = result.secure_url;
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/:id", protectAdmin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;