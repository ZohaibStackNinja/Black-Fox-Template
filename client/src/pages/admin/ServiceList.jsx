// src/components/admin/ServiceList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper: Generate preview URL for Cloudinary/local file
const getImageUrl = (imagePath, fileObject) => {
  if (fileObject) return URL.createObjectURL(fileObject);
  if (imagePath) return imagePath;
  return "https://via.placeholder.com/150/000000/FFFFFF?text=No+Image";
};

/* ---------------------------------------------------------
   1. MODAL COMPONENT — Edit Service
--------------------------------------------------------- */
function EditServiceModal({ service, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    features: service?.features?.join("\n") || "",
    description: service?.servicesDescription || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        features: service.features?.join("\n") || "",
        description: service.servicesDescription || "",
      });
      setImageFile(null);
      setError(null);
    }
  }, [service]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!service?._id) {
      setError("Service ID not found.");
      setIsSaving(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("features", formData.features);
    data.append("servicesDescription", formData.description); // Add description
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setIsSaving(false);
        return;
      }

      const res = await axios.put(`/api/admin/services/${service._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSave(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-xl text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-teal-400 mb-4 border-b border-gray-700 pb-2">
          Edit Service
        </h3>

        {error && (
          <div className="p-3 bg-red-700 rounded text-white mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Current Image</label>
            {service.image && (
              <img
                src={getImageUrl(service.image, imageFile)}
                alt={service.title}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />

            {imageFile && (
              <p className="text-sm text-yellow-400 mt-1">{imageFile.name}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              className="w-full p-2 bg-gray-700 rounded text-white"
              required
            />
          </div>

          {/* Features */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">
              Features (one per line)
            </label>
            <textarea
              name="features"
              rows="4"
              value={formData.features}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            ></textarea>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-500 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   2. MAIN COMPONENT — Service List
--------------------------------------------------------- */
export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/services");
      setServices(res.data);
      setStatusMessage({
        type: "success",
        text: "Services loaded successfully.",
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "Failed to fetch services.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEditClick = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  const handleSave = (updatedService) => {
    setServices((prev) =>
      prev.map((s) => (s._id === updatedService._id ? updatedService : s))
    );
    setStatusMessage({
      type: "success",
      text: `Service "${updatedService.title}" updated.`,
    });
    handleModalClose();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete service: "${title}"? This cannot be undone.`))
      return;

    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Not authorized. Please log in.");

    try {
      await axios.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s._id !== id));
      setStatusMessage({
        type: "success",
        text: `Service "${title}" deleted.`,
      });
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "Failed to delete service.",
      });
    }
  };

  if (loading) return <p className="text-gray-300">Loading...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg">
      {/* Edit Modal */}
      {isModalOpen && currentService && (
        <EditServiceModal
          service={currentService}
          onSave={handleSave}
          onClose={handleModalClose}
        />
      )}

      <h2 className="text-2xl font-bold mb-4 text-teal-400">
        Services List
      </h2>

      {/* Status Banner */}
      {statusMessage.text && (
        <div
          className={`p-3 rounded mb-4 text-white ${
            statusMessage.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="space-y-4">
          {services.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-gray-800 rounded-lg flex items-start gap-4"
            >
              {item.image && (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h3 className="text-teal-400 font-semibold">{item.title}</h3>

                {item.features && (
                  <ul className="list-disc list-inside text-gray-300">
                    {item.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                )}

                {item.servicesDescription && (
                  <p className="mt-2 text-gray-300">{item.servicesDescription}</p>
                )}

                <div className="mt-3 flex gap-4">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="text-red-500 hover:text-red-400 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
