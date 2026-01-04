import React, { useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

export default function GeneralSettings({ form, onChange, setSettings }) {
  const [status, setStatus] = useState({ type: null, text: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setStatus({ type: null, text: "" });
    try {
      const data = {
        siteTitle: form.siteTitle || "",
        metaTitle: form.metaTitle || "",
        metaDescription: form.metaDescription || "",
      };
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API}/admin/settings/general`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
      setStatus({ type: "success", text: "General settings saved" });
    } catch (err) {
      setStatus({ type: "error", text: err.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded space-y-2">
      <h3 className="font-semibold mb-3">General Settings</h3>

      <label>Site Title</label>
      <input className="w-full p-2 bg-gray-700 rounded mb-2" value={form.siteTitle} onChange={(e) => onChange("siteTitle", e.target.value)} />

      <label>Meta Title</label>
      <input className="w-full p-2 bg-gray-700 rounded mb-2" value={form.metaTitle} onChange={(e) => onChange("metaTitle", e.target.value)} />

      <label>Meta Description</label>
      <textarea className="w-full p-2 bg-gray-700 rounded mb-2" rows={2} value={form.metaDescription} onChange={(e) => onChange("metaDescription", e.target.value)} />

      {status.text && (
        <div className={`p-2 rounded ${status.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {status.text}
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-500">
        {saving ? "Saving..." : "Save General"}
      </button>
    </div>
  );
}
