import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    // ADD THIS FIELD
    referLink: { type: String, default: "" } 
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);