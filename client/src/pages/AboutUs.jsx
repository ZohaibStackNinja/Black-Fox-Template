// src/components/admin/AboutUs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AboutUs() {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    image: "",
    homepageIntro: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No admin token found. Please login.");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/aboutUs",
        config
      );

      setAboutData(data);
    } catch (err) {
      console.error("Failed to load About Us:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full  rounded-lg shadow p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading About Us content...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-sm m-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-bold text-lg">Error Loading Data</h3>
        </div>
        <p className="mt-2 text-sm">{error}</p>
        <button 
          onClick={fetchAbout}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div className=" rounded-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b  flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {aboutData.title || "About Us Preview"}
            </h1>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Featured Image
              </label>
              {aboutData.image ? (
                <div className="relative group rounded-lg overflow-hidden shadow-md ring-1 ring-black ring-opacity-5">
                  <img
                    src={aboutData.image}
                    alt="About Us"
                    className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="w-full h-48  rounded-lg border-2 border-dashed  flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-sm">No Image Set</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Section */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-1 h-11 bg-blue-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-700">Main Description</h2>
              </div>
              <div className=" rounded-lg p-5  leading-relaxed whitespace-pre-line">
                {aboutData.description || (
                  <span className=" italic">No description content available.</span>
                )}
              </div>
            </div>

            {/* Homepage Intro Section */}
            <div>
              <div className="flex items-center mb-3">
                <div className="w-1 h-11 bg-teal-500 rounded-full mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-700">Homepage Introduction</h2>
              </div>
              <div className=" rounded-lg p-5  leading-relaxed ">
                {aboutData.homepageIntro || (
                  <span className=" italic">No homepage intro content available.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}