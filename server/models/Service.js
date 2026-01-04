import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    // Service description (new field)
    servicesDescription: {
      type: String,
      required: false, // optional
      default: "",
      trim: true,
    },

    features: [
      { type: String, required: true }
    ],

    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
