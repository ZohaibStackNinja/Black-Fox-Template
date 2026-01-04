// routes/admin/aboutUs.js
import express from "express";
import SiteSettings from "../../models/SiteSettings.js";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();
const upload = multer(); // memory storage

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

// ------------------- GET About Us -------------------
router.get("/", protectAdmin, async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    if (!settings) return res.status(404).json({ message: "About Us not found" });

    res.json({
      title: settings.aboutUsTitle || "",
      description: settings.aboutUsDescription || "",
      image: settings.aboutUsImage || "",
      homepageIntro: settings.homepageIntro || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPDATE About Us -------------------
router.put("/:id", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const settings = await SiteSettings.findById(req.params.id);
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    const { title, description, homepageIntro, contactNumber, email, address, officeHours } = req.body;

    if (title) settings.aboutUsTitle = title;
    if (description) settings.aboutUsDescription = description;
    if (homepageIntro) settings.homepageIntro = homepageIntro;
    if (contactNumber) settings.contactNumber = contactNumber;
    if (email) settings.email = email;
    if (address) settings.address = address;
    if (officeHours) settings.officeHours = officeHours;

    if (req.file) {
      // Remove old image from Cloudinary
      if (settings.aboutUsImagePublicId) {
        await cloudinary.uploader.destroy(settings.aboutUsImagePublicId);
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file, "site_settings/aboutUs");
      settings.aboutUsImage = result.secure_url;
      settings.aboutUsImagePublicId = result.public_id;
    }

    settings.updatedAt = Date.now();
    await settings.save();

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating About Us settings" });
  }
});

export default router;
