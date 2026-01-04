import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
