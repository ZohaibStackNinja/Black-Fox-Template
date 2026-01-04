// src/components/adminSettings/AboutSettings.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SettingsContext } from "../../contexts/SettingsContext";
import { API } from "../../utils/api";

export default function AboutSettings() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [form, setForm] = useState({
    about: "",
    homepageIntro: "",
    contactNumber: "",
    email: "",
    address: "",
    officeHours: "",
    aboutImageUrl: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, text: "" });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Initialize form when settings change
  useEffect(() => {
    if (settings) {
      setForm({
        about: settings.about || "",
        homepageIntro: settings.homepageIntro || "",
        contactNumber: settings.contactNumber || "",
        email: settings.email || "",
        address: settings.address || "",
        officeHours: settings.officeHours || "",
        aboutImageUrl: settings.aboutImage || "",
      });
      setPreviewUrl(settings.aboutImage || "");
    }
  }, [settings]);

  // Handle field changes
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFile = (file) => {
    setFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(form.aboutImageUrl || "");
    }
  };

  // Submit updated About settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, text: "" });

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key] ?? ""));
      if (file) data.append("aboutImage", file);

      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/admin/settings/aboutUs`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings((prev) => ({ ...prev, ...res.data }));
      setStatus({ type: "success", text: "About settings saved successfully" });
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to save About settings",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100 rounded-lg space-y-4">
      <h3 className="text-xl font-bold text-teal-400">About Us</h3>
      {status.text && (
        <div
          className={`p-2 rounded ${
            status.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* About */}
        <div>
          <label>Description</label>
          <textarea
            rows={4}
            value={form.about}
            onChange={(e) => handleChange("about", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Homepage Intro */}
        <div>
          <label>Homepage Intro</label>
          <textarea
            rows={2}
            value={form.homepageIntro}
            onChange={(e) => handleChange("homepageIntro", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Image */}
        <div>
          <label>Image</label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="About"
              className="w-48 h-auto rounded mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label>Contact Number</label>
          <input
            value={form.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Address */}
        <div>
          <label>Address</label>
          <input
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        {/* Office Hours */}
        <div>
          <label>Office Hours</label>
          <input
            value={form.officeHours}
            onChange={(e) => handleChange("officeHours", e.target.value)}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-teal-600 px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save About"}
          </button>

          <button
            type="button"
            onClick={() =>
              settings && setForm({
                about: settings.about || "",
                homepageIntro: settings.homepageIntro || "",
                contactNumber: settings.contactNumber || "",
                email: settings.email || "",
                address: settings.address || "",
                officeHours: settings.officeHours || "",
                aboutImageUrl: settings.aboutImage || "",
              })
            }
            className="bg-gray-700 px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
