// src/components/adminSettings/BlackFoxSettings.jsx
import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

export default function BlackFoxSettings({
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
      data.append("blackFoxTitle", form.blackFoxTitle || "");
      data.append("blackFoxDescription", form.blackFoxDescription || "");

      // FIX 1: Append the actual FILE object if it exists
      if (form.blackFoxImage && typeof form.blackFoxImage !== "string") {
        data.append("blackFoxImage", form.blackFoxImage);
      }
      // Keep the URL for existing images if no new file is uploaded
      if (form.blackFoxImageUrl) {
        data.append("blackFoxImageUrl", form.blackFoxImageUrl);
      }

      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/admin/settings/blackfox`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings(res.data);
      setStatus({ type: "success", text: "BlackFox settings saved" });
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
      <h3 className="font-semibold mb-3">Black Fox Section</h3>

      <label>Title</label>
      <input
        className="w-full p-2 bg-gray-700 rounded mb-2"
        value={form.blackFoxTitle || ""} // Added fallback to prevent uncontrolled input warning
        onChange={(e) => onChange("blackFoxTitle", e.target.value)}
      />

      <label>Description</label>
      <textarea
        className="w-full p-2 bg-gray-700 rounded mb-2"
        rows={3}
        value={form.blackFoxDescription || ""} // Added fallback
        onChange={(e) => onChange("blackFoxDescription", e.target.value)}
      />

      <label>Black Fox Image URL (Existing)</label>
      <input
        className="w-full p-2 bg-gray-700 rounded mb-2"
        value={form.blackFoxImageUrl || ""} // Added fallback
        onChange={(e) => onChange("blackFoxImageUrl", e.target.value)}
      />

      <label>Upload New Image</label>
      {/* FIX 2: Use the onFile handler */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onFile("blackFoxImage", e.target.files[0])}
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
        {saving ? "Saving..." : "Save BlackFox"}
      </button>
    </div>
  );
}
