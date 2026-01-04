// src/components/admin/NewsList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// --- Helper to get image URL (local preview or Cloudinary) ---
const getImageUrl = (imagePath, fileObject) => {
  if (fileObject) return URL.createObjectURL(fileObject);
  if (imagePath) return imagePath;
  return "https://via.placeholder.com/150/000000/FFFFFF?text=No+Image";
};

// --- 1. Modal for Editing News ---
function EditNewsModal({ newsItem, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: newsItem?.title || "",
    content: newsItem?.content || "",
    date: newsItem?.date ? new Date(newsItem.date).toISOString().substring(0, 10) : "",
    referLink: newsItem?.referLink || "", // Added referLink state
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title || "",
        content: newsItem.content || "",
        date: formatDate(newsItem.date || newsItem.createdAt),
      });
      setImageFile(null);
      setError(null);
    }
  }, [newsItem]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!newsItem?._id) {
      setError("News ID not found.");
      setIsSaving(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Not authenticated. Please log in.");
        setIsSaving(false);
        return;
      }

      const res = await axios.put(`/api/admin/news/${newsItem._id}`, data, {
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

  if (!newsItem) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-lg overflow-y-auto text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-teal-400 mb-4 border-b border-gray-700 pb-2">
          Edit News
        </h3>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-800 text-white text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Current Image</label>
            {newsItem.image && (
              <img
                src={getImageUrl(newsItem.image, imageFile)}
                alt={newsItem.title}
                className="w-32 h-32 object-cover mb-2 rounded"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            {imageFile && <p className="text-sm text-yellow-400 mt-1">{imageFile.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Date</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">Refer Link / URL</label>
          <input
            name="referLink"
            type="text"
            value={formData.referLink}
            onChange={handleChange}
            placeholder="e.g. https://google.com or /services"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-400 outline-none"
          />
        </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-500 disabled:opacity-50"
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

// --- 2. Main NewsList Component ---
export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);

  // Fetch News
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/news");
      setNews(res.data.posts || res.data);
      setStatusMessage({ type: "success", text: "News loaded successfully." });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Failed to fetch news." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEditClick = (item) => {
    setCurrentNews(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentNews(null);
  };

  const handleSave = (updatedNews) => {
    setNews(news.map((n) => (n._id === updatedNews._id ? updatedNews : n)));
    handleModalClose();
    setStatusMessage({ type: "success", text: `News "${updatedNews.title}" updated successfully.` });
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete news: "${title}"? This cannot be undone.`)) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Not authorized. Please log in.");

    try {
      await axios.delete(`/api/admin/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(news.filter((n) => n._id !== id));
      setStatusMessage({ type: "success", text: `News "${title}" deleted.` });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: "error", text: "Failed to delete news." });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg">
      {isModalOpen && currentNews && (
        <EditNewsModal newsItem={currentNews} onSave={handleSave} onClose={handleModalClose} />
      )}

      <h2 className="text-2xl font-bold mb-4">News List</h2>

      {statusMessage.text && (
        <div
          className={`p-3 mb-4 rounded ${
            statusMessage.type === "success" ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          {statusMessage.text}
        </div>
      )}

      {news.length === 0 ? (
        <p>No news found.</p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
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
                <p className="text-gray-300 mb-1">{item.content.slice(0, 200)}...</p>
                <p className="text-gray-400 text-sm">{item.date?.substring(0, 10)}</p>

                <div className="mt-2 flex gap-4">
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
