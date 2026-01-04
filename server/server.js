import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// --- Configuration Setup (MUST BE FIRST) ---
dotenv.config();
connectDB();

// --- 1. ROUTE IMPORTS ---
// Public Routes
import projectRoutes from './routes/projectRoutes.js';
import newsRoutes from "./routes/newsRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Upload Route
// import uploadRoutes from "./routes/uploadRoutes.js";

// Admin Routes (Auth)
import adminAuth from "./routes/adminAuth.js";

// Admin Routes (CRUD)
import adminProjectRoutes from "./routes/admin/projectAdminRoutes.js";
import adminNewsRoutes from "./routes/admin/newsAdminRoutes.js";
import adminServiceRoutes from "./routes/admin/serviceAdminRoutes.js";
// import editUploadRouter from "./routes/editUploadRouter.js";
import siteSettingsRouter from "./routes/admin/siteSettingsAdminRoutes.js";
// ...

import siteSettingsSliderRoutes from "./routes/admin/siteSettingsSliderRoutes.js";

import aboutUsRoutes from "./routes/admin/AboutUsRoutes.js";


// --- 2. EXPRESS APP INITIALIZATION (MUST BE SECOND) ---
const app = express();


// --- 3. MIDDLEWARE ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON data


// --- 4. API ROUTES (Mounting) ---

// Public API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/upload/edit", editUploadRouter);
// Upload Route
// app.use("/api/upload", uploadRoutes);
app.use("/api/admin/aboutUs", aboutUsRoutes);

// Admin Authentication Route
app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/settings", siteSettingsRouter);

// Admin CRUD Routes (Protected)
app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/admin/news", adminNewsRoutes);
app.use("/api/admin/services", adminServiceRoutes);

app.use("/api/admin/settings", siteSettingsSliderRoutes);

// --- 5. ROOT ROUTE & SERVER START ---
app.get("/", (req, res) => res.send("API is running..."));
console.log("Checking Email Credentials:");
console.log("User:", process.env.EMAIL_USER ? "Loaded" : "MISSING");
console.log("Pass:", process.env.EMAIL_PASS ? "Loaded" : "MISSING");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));