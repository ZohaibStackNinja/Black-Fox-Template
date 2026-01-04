// src/components/adminSettings/SliderSettings.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SettingsContext } from "../../contexts/SettingsContext";
import { API } from "../../utils/api";

export default function SliderSettings() {
  const { setSettings } = useContext(SettingsContext);

  const [sliderImages, setSliderImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, text: "" });

  const token = localStorage.getItem("adminToken");

  // Fetch slider images on mount
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSliderImages(data.homeSliderImages?.map((s) => s.url) || []);
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          text: err.response?.data?.message || "Failed to fetch images",
        });
      }
    };

    fetchSliderImages();
  }, [token]);

  const handleFileChange = (e) => setNewFiles([...newFiles, ...e.target.files]);

  const toggleRemove = (url) =>
    setRemoveList((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );

  const handleUpload = async () => {
    if (!newFiles.length) return alert("Select images first");
    setLoading(true);
    setStatus({ type: null, text: "" });

    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("images", file));

      const { data } = await axios.post(`${API}/admin/settings/slider`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSliderImages(data.images || []);
      setNewFiles([]);
      setSettings((prev) => ({ ...prev, homeSliderImages: data.images }));
      setStatus({ type: "success", text: "Images uploaded successfully" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (!removeList.length) return alert("No images selected");
    if (!window.confirm("Are you sure to remove selected images?")) return;

    setLoading(true);
    setStatus({ type: null, text: "" });

    try {
      for (const url of removeList) {
        await axios.post(
          `${API}/admin/settings/remove-slider`,
          { imageUrl: url },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refetch images after removal
      const { data } = await axios.get(`${API}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedImages = data.homeSliderImages?.map((s) => s.url) || [];
      setSliderImages(updatedImages);
      setRemoveList([]);
      setSettings((prev) => ({ ...prev, homeSliderImages: updatedImages }));
      setStatus({ type: "success", text: "Selected images removed successfully" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err.response?.data?.message || "Remove failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded mx-auto space-y-4">
      <h3 className="text-xl font-semibold text-center mb-2">Slider Management</h3>

      {status.text && (
        <div
          className={`p-2 rounded ${
            status.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* Current slides */}
      <h4>Current Slides</h4>
      <div
        className="grid gap-4 mb-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
      >
        {sliderImages.map((img, idx) => (
          <div
            key={idx}
            className="relative rounded overflow-hidden shadow-md cursor-pointer"
            style={{
              boxShadow: removeList.includes(img)
                ? "0 0 0 3px red inset"
                : "0 2px 10px rgba(0,0,0,0.15)",
            }}
            onClick={() => toggleRemove(img)}
            title="Click to toggle remove"
          >
            <img src={img} alt={`slider-${idx}`} className="w-full h-24 object-cover" />
            {removeList.includes(img) && (
              <span className="absolute top-1 right-1 bg-red-600 text-white px-2 rounded text-xs">
                Remove
              </span>
            )}
          </div>
        ))}
      </div>

      {removeList.length > 0 && (
        <button
          onClick={handleRemoveSelected}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
        >
          {loading ? "Processing..." : "Remove Selected"}
        </button>
      )}

      {/* Upload new slides */}
      <h4>Add New Slides</h4>
      <div className="flex gap-2 flex-wrap mb-2">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="p-2 bg-gray-700 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Preview new images */}
      {newFiles.length > 0 && (
        <div>
          <h5 className="mb-2">Images to Add</h5>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}
          >
            {Array.from(newFiles).map((file, idx) => (
              <div key={idx} className="relative rounded overflow-hidden shadow-md">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`new-${idx}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  onClick={() => setNewFiles(newFiles.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
