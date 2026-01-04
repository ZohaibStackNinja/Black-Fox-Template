// C:/Users/user/Desktop/project_1/models/ContactMessage.js
import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }, // for marking messages as read
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ContactMessage", contactMessageSchema);
