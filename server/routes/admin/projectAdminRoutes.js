import express from "express";
import Project from "../../models/Project.js";
import multer from "multer";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import { protectAdmin } from "../../middleware/authMiddleware.js"; // Your auth middleware

const router = express.Router();
const upload = multer(); // memory storage

// @desc    Update a project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
router.put("/:id", protectAdmin, upload.single("projectImage"), async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        // --- Update text fields ---
        const { title, link, description, date } = req.body;
        if (title) project.title = title;
        if (link) project.link = link;
        if (description) project.description = description;
        if (date) project.date = date;

        // --- Handle new image upload ---
        if (req.file) {
            // Delete previous image from Cloudinary if needed
            if (project.imagePublicId) {
                await cloudinary.uploader.destroy(project.imagePublicId);
            }

            // Upload new image
            const streamUpload = (reqFile) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "projects" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );
                    streamifier.createReadStream(reqFile.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req.file);
            project.image = result.secure_url; // full URL
            project.imagePublicId = result.public_id; // save public ID for later deletion
        }

        const updatedProject = await project.save();
        res.json(updatedProject);

    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server error while updating project", error: error.message });
    }
});

export default router;
