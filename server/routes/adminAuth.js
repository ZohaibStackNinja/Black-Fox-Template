import express from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

const router = express.Router();

// Simple single-admin check using env vars (for a small project)
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_USER;
  const adminPassHash = process.env.ADMIN_PASS_HASH; // hashed password

  if (email !== adminEmail) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, adminPassHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
}));

export default router;
