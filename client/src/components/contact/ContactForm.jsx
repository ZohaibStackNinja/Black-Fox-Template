// src/components/contact/ContactForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: null, text: "" });
  const [sending, setSending] = useState(false);

  // Theme Colors
  const COLOR_PRIMARY = "#0556B9"; // Deep Blue

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, text: "" });
    setSending(true);

    try {
      // API endpoint is /api/contact
      await axios.post(`${API}/contact`, form);
      
      // Success message reflects that the email has been sent
      setStatus({ 
        type: "success", 
        text: "Message sent successfully! We will contact you soon." 
      });
      
      // Clear the form fields
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });

    } catch (err) {
      console.error("Contact Form Submission Error:", err);
      setStatus({ 
        type: "error", 
        text: err.response?.data?.message || "Failed to send message. Please try again later." 
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-xl mx-auto p-6 bg-gray-800 rounded-xl shadow-lg space-y-4"
    >
      {status.text && (
        <div 
          className={`p-3 rounded text-center font-medium ${
            status.type === "success" ? "bg-[#0556B9] text-white" : "bg-red-700 text-white"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0556B9] focus:bg-gray-700 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0556B9] focus:bg-gray-700 transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="phone"
          placeholder="Phone (Optional)"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0556B9] focus:bg-gray-700 transition"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (Optional)"
          value={form.subject}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0556B9] focus:bg-gray-700 transition"
        />
      </div>

      <textarea
        name="message"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        rows={5}
        className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0556B9] focus:bg-gray-700 transition"
        required
      />

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-[#0556B9] hover:bg-[#074794] text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}