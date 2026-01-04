// src/components/contact/AdminContactMessages.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../utils/api";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme Colors
  const COLOR_PRIMARY = "#0556B9"; // Deep Blue

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      // NOTE: This assumes you have the adminToken properly set up for protectedAdmin middleware
      const token = localStorage.getItem("adminToken");
      if (!token) {
          setError("Admin not authenticated. Please log in.");
          setLoading(false);
          return;
      }
      const res = await axios.get(`${API}/contact`, { 
          headers: { Authorization: `Bearer ${token}` } 
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data?.message || err.message);
      setError("Failed to fetch messages. Check server connection or admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(`${API}/contact/${id}/read`, null, { 
          headers: { Authorization: `Bearer ${token}` } 
      });
      // Optimistically update the state
      setMessages((prev) => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error("Error marking message as read:", err);
      // Optional: Add a rollback state or alert the admin if the patch fails
      alert("Failed to mark message as read on the server.");
    }
  };
  
  // --- Loading and Error States ---
  if (loading) {
      return (
          <div className="container mx-auto p-8 bg-gray-900 text-gray-100 min-h-[50vh] flex justify-center items-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" style={{ borderColor: COLOR_PRIMARY }}></div>
          </div>
      );
  }

  if (error) {
    return (
        <div className="container mx-auto p-8 bg-gray-900 text-red-400 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p>{error}</p>
        </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="container mx-auto p-8 bg-gray-900 text-gray-100 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-6 border-b pb-2" style={{ color: COLOR_PRIMARY }}>
        ✉️ Contact Messages
      </h2>

      {messages.length === 0 ? (
        <p className="text-gray-400">No messages have been received yet.</p>
      ) : (
        <div className="space-y-6">
          {messages.map(msg => (
            <div 
              key={msg._id} 
              className={`p-5 rounded-lg transition-all shadow-md ${
                msg.read 
                  ? "bg-gray-800 border-l-4 border-gray-600" // Read style: subtle
                  : "bg-gray-800 border-l-4 border-teal-500 ring-2 ring-teal-500" // Unread style: highlighted
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  {/* Name and Email */}
                  <h3 className="font-semibold text-lg" style={{ color: msg.read ? '#fff' : COLOR_PRIMARY }}>
                    {msg.name} 
                    <span className="text-gray-400 font-normal ml-2 text-sm">&lt;{msg.email}&gt;</span>
                  </h3>
                  {/* Subject and Phone */}
                  <p className="mt-1 text-gray-300 font-medium">
                    {msg.subject || "(No Subject)"}
                    {msg.phone && <span className="text-sm ml-4 text-gray-400">📞 {msg.phone}</span>}
                  </p>
                </div>
                
                {/* Mark as Read Button */}
                {!msg.read && (
                    <button 
                        onClick={() => markRead(msg._id)} 
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded-full text-sm transition-colors shrink-0"
                    >
                        Mark as Read
                    </button>
                )}
              </div>
              
              {/* Message Content */}
              <div className="mt-3 p-3 bg-gray-700/50 rounded-md border border-gray-700">
                <p className="text-gray-200 whitespace-pre-line">{msg.message}</p>
              </div>

              {/* Timestamp */}
              <p className="mt-3 text-xs text-gray-500 text-right">
                Received: {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}