import React, { useState } from "react";
import axios from "axios";
import { authHeader } from "../../utils/authHeader";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    author: "",
    date: new Date().toISOString().slice(0, 10),
    referLink: "", // Added field
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: null, text: "" });
    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (file) data.append("image", file); // Must match the field name in backend (newsAdminRoutes)

      await axios.post("/api/admin/news", data, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      setStatusMessage({ type: "success", text: "Post Created Successfully!" });
      setTimeout(() => navigate("/admin/news"), 1500);
    } catch (err) {
      console.error("Error creating post:", err);
      setStatusMessage({
        type: "error",
        text: "Error creating post. Check console for details.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 p-8 bg-gray-900 rounded-xl shadow-2xl text-gray-100">
      <h2 className="text-3xl font-bold mb-6 border-b pb-3 border-gray-700">
        Create New Post
      </h2>

      {statusMessage.text && (
        <div
          className={`p-4 mb-6 rounded-lg font-semibold ${
            statusMessage.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleSubmit}>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          required
        />
        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category (e.g., Technology, Event)"
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          required
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Content"
          className="w-full p-4 border rounded-lg h-40 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          required
        />

        <div className="flex items-center space-x-4 pt-2">
          <label className="text-gray-100 font-medium">Post Image:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-gray-100 hover:file:bg-teal-500 cursor-pointer"
          />
        </div>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="Author"
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100"
          required
        />
        <input
          value={form.referLink}
          onChange={(e) => setForm({ ...form, referLink: e.target.value })}
          placeholder="Refer Link (External URL like https://... or internal like /gallery)"
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 focus:ring-2 focus:ring-teal-400"
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-gray-100 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-teal-500 transition duration-300 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Saving..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
