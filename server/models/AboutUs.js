// backend/models/AboutUs.js
import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    imagePublicId: { type: String }, // for Cloudinary
  },
  { timestamps: true }
);

export default mongoose.model("AboutUs", aboutUsSchema);
