// src/components/adminSettings/ImageSetting.jsx
import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

export default function ImagesSettings({
  form,
  onChange,
  onFile,
  setSettings,
}) {
  const [status, setStatus] = useState({ type: null, text: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: null, text: "" });
    try {
      const data = new FormData();
      data.append("logoUrl", form.logoUrl || "");
      data.append("homepageImageUrl", form.homepageImageUrl || "");

      // FIX 1: Append the actual FILE objects if they exist
      if (form.logo && typeof form.logo !== "string")
        data.append("logo", form.logo);
      if (form.homepageImage && typeof form.homepageImage !== "string")
        data.append("homepageImage", form.homepageImage);

      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/admin/settings/images`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
      setStatus({ type: "success", text: "Images settings saved" });
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded space-y-2">
      <h3 className="font-semibold mb-3">Images Settings</h3>

      <label>Logo URL (Existing)</label>
      <input
        className="w-full p-2 bg-gray-700 rounded mb-2"
        value={form.logoUrl || ""}
        onChange={(e) => onChange("logoUrl", e.target.value)}
      />

      <label>Upload New Logo</label>
      {/* FIX 2: Use the onFile handler for logo */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile("logo", e.target.files[0])}
        className="w-full p-2 bg-gray-700 rounded mb-2"
      />

      <label>Homepage Image URL (Existing)</label>
      <input
        className="w-full p-2 bg-gray-700 rounded mb-2"
        value={form.homepageImageUrl || ""}
        onChange={(e) => onChange("homepageImageUrl", e.target.value)}
      />

      <label>Upload New Homepage Image</label>
      {/* FIX 3: Use the onFile handler for homepageImage */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile("homepageImage", e.target.files[0])}
        className="w-full p-2 bg-gray-700 rounded mb-2"
      />

      {status.text && (
        <div
          className={`p-2 rounded ${
            status.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {status.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-500"
      >
        {saving ? "Saving..." : "Save Images"}
      </button>
    </div>
  );
}
