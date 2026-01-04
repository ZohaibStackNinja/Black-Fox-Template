import React, { useState } from "react";
import { uploadFile } from "../../utils/upload";
import axios from "axios";
import { authHeader } from "../../utils/authHeader";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const [form, setForm] = useState({ title: "", description: "", link: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" }); // State for visual feedback
  const navigate = useNavigate();

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: null, text: "" }); // Clear previous messages
    
    try {
      let imageUrl = "";
      
      // 1. Handle file upload if a file is selected
      if (file) {
        setUploading(true);
        const res = await uploadFile(file);
        imageUrl = res.url;
        setUploading(false);
      }
      
      // 2. Post data to the Projects API endpoint
      await axios.post("/api/admin/projects", { ...form, image: imageUrl }, { headers: authHeader() });
      
      // Use visual feedback instead of alert()
      setStatusMessage({ type: 'success', text: "Project Created Successfully!" });
      setTimeout(() => navigate("/admin/projects"), 1500); // Navigate after delay
    } catch (err) {
      console.error(err);
      // Use visual feedback instead of alert()
      setStatusMessage({ type: 'error', text: "Error creating project. Check console for details." });
      setUploading(false); // Ensure button is re-enabled on error
    }
  };

  return (
    // Outer Container: Matches the AdminLayout main content (bg-gray-900)
    <div className="container mx-auto py-8 p-8 bg-gray-900 rounded-xl shadow-2xl text-gray-100">
      <h2 className="text-3xl font-bold mb-6 border-b pb-3 border-gray-700">Create New Project</h2>
      
      {/* Status Message Display */}
      {statusMessage.text && (
        <div className={`p-4 mb-6 rounded-lg font-semibold ${statusMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {statusMessage.text}
        </div>
      )}

      <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleSubmit}>
        {/* Title Input */}
        <input 
          value={form.title} 
          onChange={e=>setForm({...form,title:e.target.value})} 
          placeholder="Project Title" 
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400" 
        />
        
        {/* Description Textarea */}
        <textarea 
          value={form.description} 
          onChange={e=>setForm({...form,description:e.target.value})} 
          placeholder="Project Description" 
          className="w-full p-4 border rounded-lg h-32 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400" 
        />
        
        {/* Link Input */}
        <input 
          value={form.link} 
          onChange={e=>setForm({...form,link:e.target.value})} 
          placeholder="Project Link (optional)" 
          className="w-full p-4 border rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-teal-400 focus:border-teal-400" 
        />
        
        {/* File Upload */}
        <div className="flex items-center space-x-4 pt-2">
          <label className="text-gray-100 font-medium">Project Image:</label>
          <input 
            type="file" 
            onChange={handleFile} 
            className="block w-full text-sm text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-gray-100 hover:file:bg-teal-500 cursor-pointer"
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-teal-600 text-gray-100 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-teal-500 transition duration-300 disabled:opacity-50" 
          disabled={uploading}
        >
          {uploading ? "Uploading Image..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}