import express from "express";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import SiteSettings from "../../models/SiteSettings.js";

const router = express.Router();
const upload = multer(); // memory storage

router.post("/slider", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = new SiteSettings({ homeSliderImages: [] });
    }

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "homeSlider" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      settings.homeSliderImages.push({
        url: result.secure_url,
        public_id: result.public_id,
        link: "",       // optional, can be set via frontend
        title: "",      // optional, can be set via frontend
        description: "",// optional, can be set via frontend
      });
    }

    await settings.save();
    res.json({ images: settings.homeSliderImages });
  } catch (err) {
    console.error("Server error uploading slider images:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
