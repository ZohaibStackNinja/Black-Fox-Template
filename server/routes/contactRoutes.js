// routes/contactRoutes.js

import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import sendContactEmail from "../utils/sendEmail.js"; // <--- IMPORT NODEMAILER HANDLER

const router = express.Router();

// POST /api/contact - submit message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    // 1. Save message to database
    const newMessage = new ContactMessage({ name, email, phone, subject, message });
    await newMessage.save();

    // 2. Send email notification
    // Note: The lack of an await here means the user won't wait for the email delivery to finish,
    // which is better for user experience, but you must handle errors internally (done in sendEmail.js)
    sendContactEmail({ name, email, phone, subject, message }); 
    
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/contact - admin view all messages
router.get("/", protectAdmin, async (req, res) => {
// ... (existing GET logic) ...
});

// PATCH /api/contact/:id/read - mark message as read
router.patch("/:id/read", protectAdmin, async (req, res) => {
// ... (existing PATCH logic) ...
});

export default router;