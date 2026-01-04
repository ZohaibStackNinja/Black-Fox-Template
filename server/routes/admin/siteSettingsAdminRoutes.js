import express from "express";
import SiteSettings from "../../models/SiteSettings.js";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../../config/cloudinary.js";

const router = express.Router();
const upload = multer(); // memory storage

const uploadToCloudinary = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });

// ------------------- GET site settings -------------------
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- General Settings -------------------
router.post("/general", protectAdmin, async (req, res) => {
  try {
    const { siteTitle, metaTitle, metaDescription } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    if (siteTitle) settings.siteTitle = siteTitle;
    if (metaTitle) settings.metaTitle = metaTitle;
    if (metaDescription) settings.metaDescription = metaDescription;
    settings.updatedAt = Date.now();

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving general settings" });
  }
});

// ------------------- About Settings -------------------
router.post("/aboutUs", protectAdmin, upload.single("aboutImage"), async (req, res) => {
  try {
    const { about, homepageIntro, contactNumber, email, address, officeHours } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    if (about) settings.aboutUsDescription = about;
    if (homepageIntro) settings.homepageIntro = homepageIntro;
    if (contactNumber) settings.contactNumber = contactNumber;
    if (email) settings.email = email;
    if (address) settings.address = address;
    if (officeHours) settings.officeHours = officeHours;

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "site_settings/aboutUs");
      settings.aboutUsImage = result.secure_url;
      settings.aboutUsImagePublicId = result.public_id;
    }

    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving About settings" });
  }
});

// ------------------- BlackFox Settings -------------------
router.post("/blackfox", protectAdmin, upload.single("blackFoxImage"), async (req, res) => {
  try {
    const { blackFoxTitle, blackFoxDescription } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    settings.templateSections.blackFoxSection = {
      title: blackFoxTitle || settings.templateSections.blackFoxSection?.title,
      description: blackFoxDescription || settings.templateSections.blackFoxSection?.description,
      image: settings.templateSections.blackFoxSection?.image || "",
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "site_settings/blackfox");
      settings.templateSections.blackFoxSection.image = result.secure_url;
    }

    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving BlackFox settings" });
  }
});

// ------------------- Services Settings -------------------
router.post("/services", protectAdmin, async (req, res) => {
  try {
    const { servicesDescription } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    if (servicesDescription) settings.services = servicesDescription;
    settings.updatedAt = Date.now();

    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving Services settings" });
  }
});

// ------------------- Images Settings -------------------
router.post("/images", protectAdmin, upload.any(), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    const files = req.files || [];
    for (const file of files) {
      if (file.fieldname === "logo") {
        const result = await uploadToCloudinary(file, "site_settings/logo");
        settings.logo = result.secure_url;
      }
      if (file.fieldname === "homepageImage") {
        const result = await uploadToCloudinary(file, "site_settings/homepage");
        settings.homepageImage = result.secure_url;
      }
    }

    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving Images settings" });
  }
});

// ------------------- Slider Settings -------------------
router.post("/slider", protectAdmin, upload.array("images"), async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();

    if (!settings.homeSliderImages) settings.homeSliderImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file, "site_settings/slider");
      settings.homeSliderImages.push({
        url: result.secure_url,
        public_id: result.public_id,
        title: "",
        description: "",
        link: "",
      });
    }

    settings.updatedAt = Date.now();
    await settings.save();
    res.json({ images: settings.homeSliderImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading slider images" });
  }
});

// ------------------- Remove Slider Image -------------------
router.post("/remove-slider", protectAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    let settings = await SiteSettings.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    settings.homeSliderImages = settings.homeSliderImages.filter((i) => i.url !== imageUrl);
    settings.updatedAt = Date.now();
    await settings.save();

    res.json({ images: settings.homeSliderImages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing slider image" });
  }
});

export default router;
