import express from "express";
import Service from "../../models/Service.js";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

const router = express.Router();
const upload = multer(); // memory storage

// Helper: Upload buffer to Cloudinary
const streamUpload = (reqFile) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "services" },
      (error, result) => (result ? resolve(result) : reject(error))
    );
    streamifier.createReadStream(reqFile.buffer).pipe(stream);
  });
};

// -------------------------------------------------------------
//  CREATE SERVICE (POST)
// -------------------------------------------------------------
router.post("/", protectAdmin, upload.single("serviceImage"), async (req, res) => {
  try {
    let { title, features, servicesDescription } = req.body;

    // Convert features string → array
    let featuresArray = [];
    if (features) {
      featuresArray = features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    }

    const service = new Service({
      title,
      features: featuresArray,
      servicesDescription: servicesDescription || ""
    });

    // Upload image if provided
    if (req.file) {
      const result = await streamUpload(req.file);
      service.image = result.secure_url;
      service.imagePublicId = result.public_id;
    }

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      message: "Server error while creating service",
      error: error.message
    });
  }
});

// -------------------------------------------------------------
//  READ ALL SERVICES
// -------------------------------------------------------------
router.get("/", async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

// -------------------------------------------------------------
//  READ SINGLE SERVICE
// -------------------------------------------------------------
router.get("/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json(service);
});

// -------------------------------------------------------------
//  UPDATE SERVICE (PUT)
// -------------------------------------------------------------
router.put("/:id", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    let { title, features, servicesDescription } = req.body;

    if (title) service.title = title;
    if (servicesDescription !== undefined)
      service.servicesDescription = servicesDescription;

    // Convert features string → array (newline split)
    if (features !== undefined) {
      service.features = features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    }

    // Handle updated image
    if (req.file) {
      if (service.imagePublicId) {
        await cloudinary.uploader.destroy(service.imagePublicId);
      }

      const result = await streamUpload(req.file);
      service.image = result.secure_url;
      service.imagePublicId = result.public_id;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Server error while updating service",
      error: error.message
    });
  }
});

// -------------------------------------------------------------
//  DELETE SERVICE
// -------------------------------------------------------------
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      message: "Server error while deleting service",
      error: error.message
    });
  }
});

export default router;
