// src/components/admin/CreateService.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateService() {
  const [form, setForm] = useState({
    title: "",
    features: "",
    servicesDescription: "", // <-- ADDED HERE
  });

  const [imageFile, setImageFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: null, text: "" });
    setIsSaving(true);

    try {
      const featureArray = form.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const data = new FormData();
      data.append("title", form.title);
      data.append("features", JSON.stringify(featureArray));
      data.append("servicesDescription", form.servicesDescription); // <-- ADDED HERE

      if (imageFile) data.append("serviceImage", imageFile);

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setStatusMessage({ type: "error", text: "Unauthorized. Please log in." });
        setIsSaving(false);
        return;
      }

      await axios.post("/api/admin/services", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage({
        type: "success",
        text: "Service Created Successfully!",
      });

      setTimeout(() => navigate("/admin/services"), 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Error creating service. Check console for details.";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8 p-8 bg-gray-900 rounded-xl shadow-2xl text-gray-100">
      <h2 className="text-3xl font-bold mb-6 border-b pb-3 border-gray-700">
        Create New Service
      </h2>

      {statusMessage.text && (
        <div
          className={`p-4 mb-6 rounded-lg font-semibold ${
            statusMessage.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          } text-white`}
        >
          {statusMessage.text}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleSubmit}>

        {/* Title */}
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Service Title"
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          required
        />

        {/* NEW: Services Description */}
        <textarea
          value={form.servicesDescription}
          onChange={(e) =>
            setForm({ ...form, servicesDescription: e.target.value })
          }
          placeholder="Service Description"
          className="w-full p-4 border rounded-lg h-32 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          rows={4}
        />

        {/* Features */}
        <textarea
          value={form.features}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
          placeholder="Features (comma-separated, e.g., 'Feature A, Feature B')"
          className="w-full p-4 border rounded-lg h-32 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-2 text-gray-300">
            Upload Service Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
          {imageFile && (
            <p className="text-sm text-yellow-400 mt-1">
              Selected file: {imageFile.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-teal-600 text-gray-100 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-teal-500 transition duration-300 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Create Service"}
        </button>
      </form>
    </div>
  );
}
