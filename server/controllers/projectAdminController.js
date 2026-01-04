// /server/controllers/projectAdminController.js

import Project from '../models/Project.js'; 
// Import 'fs' to handle file system operations (like deleting old images)
import fs from 'fs';
import path from 'path';

// Helper function to get the base directory (for deleting old images)
const getUploadPath = (filename) => {
    // This path must match the destination in uploadMiddleware.js
    return path.join('public', 'uploads', 'projects', filename);
};


// ===================================
// 2. UPDATE PROJECT (PUT) - Fully Fixed
// ===================================
const updateProject = async (req, res) => {
    const projectId = req.params.id;
    
    // ⚠️ Multer has parsed the body fields (title, description, link, date) into req.body
    // and the file information into req.file (if a new file was uploaded).
    
    // 1. Destructure fields from req.body
    const { title, description, link, date } = req.body;

    // 2. Build the fields to update
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (link) updateFields.link = link;
    // The date field will be a string from FormData, convert it back to a Date object
    if (date) updateFields.date = new Date(date); 

    try {
        // 3. Find the existing project
        const project = await Project.findById(projectId);
        
        if (!project) {
            // If Multer uploaded a file, but the project wasn't found, delete the uploaded file
            if (req.file) {
                fs.unlinkSync(getUploadPath(req.file.filename));
            }
            return res.status(404).json({ message: "Project not found." });
        }

        // 4. Handle image update (Image-Optional Logic)
        if (req.file) {
            // A new image was uploaded.
            
            // a. Prepare the new image path for the database
            // Multer saves to 'public/uploads/projects', we save '/uploads/projects/...'
            updateFields.image = `/uploads/projects/${req.file.filename}`;
            
            // b. Attempt to delete the OLD image file
            const oldImagePath = project.image; // e.g., /uploads/projects/old-file.jpg
            
            if (oldImagePath && oldImagePath.startsWith('/uploads/projects/')) {
                // Construct the full server path to the old image
                const serverPathToDelete = path.join('public', oldImagePath); 
                try {
                    // Check if the file exists before attempting to delete
                    if (fs.existsSync(serverPathToDelete)) {
                        fs.unlinkSync(serverPathToDelete);
                        console.log(`Successfully deleted old image: ${serverPathToDelete}`);
                    }
                } catch (deleteError) {
                    console.error("Error deleting old image file:", deleteError);
                    // Continue with the update, but log the deletion error.
                }
            }
        }
        // If req.file is null, updateFields.image is NOT set, and the old image path is retained.

        // 5. Update the project in the database
        const updatedProject = await Project.findByIdAndUpdate(
            projectId, 
            { $set: updateFields },
            { new: true, runValidators: true } // Return the updated document and run Mongoose schema validators
        );
        
        // 6. Respond with the updated project
        res.status(200).json(updatedProject);

    } catch (error) {
        console.error("Error updating project:", error);
        
        // If a file was uploaded but a database error occurred, delete the new file
        if (req.file) {
            try {
                fs.unlinkSync(getUploadPath(req.file.filename));
            } catch (cleanupError) {
                console.error("Error cleaning up new uploaded file:", cleanupError);
            }
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation failed on project fields.",
                errors: error.errors 
            });
        }
        
        res.status(500).json({ message: 'Server error during project update.' });
    }
};

// ... (other exports)
export { 
    // createProject, 
    updateProject, // Now fully defined
    // deleteProject 
};