// /server/routes/projectRoutes.js
// Handles: GET /api/projects, GET /api/projects/:id

import express from "express";
import Project from "../models/Project.js"; // Corrected path

const router = express.Router();

// Read all (Public access)
// Handles: GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// Read one (Public access)
// Handles: GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project" });
  }
});

export default router;