// /server/middleware/uploadMiddleware.js

import multer from 'multer';
import path from 'path';

// Define storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in the /public/uploads/projects directory
    cb(null, 'public/uploads/projects'); 
  },
  filename: (req, file, cb) => {
    // Unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Configure the upload middleware
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Basic image validation
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false); 
        }
    }
});

// Export the middleware configured for the expected field name
// The frontend FormData key MUST be 'projectImage'.
export const projectImageUpload = upload.single('projectImage');