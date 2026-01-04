import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();
const upload = multer(); // memory storage

// PUT: Update image
router.put("/", upload.single("projectImage"), async (req, res) => {
  try {
    const { old_public_id } = req.body;

    // 1. If no new file uploaded → return error
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 2. Upload new image
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "your_app_folder" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // 3. Delete old image (optional but recommended)
    if (old_public_id) {
      cloudinary.uploader.destroy(old_public_id, (error, result) => {
        if (error) console.error("Delete old image failed:", error);
      });
    }

    // 4. Send updated image data back
    res.json({
      message: "Image updated successfully",
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Edit failed" });
  }
});

export default router;
