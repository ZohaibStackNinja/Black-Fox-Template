// src/pages/Gallery.jsx (Updated with Axios)

import React, { useEffect, useState } from "react";
import GalleryCard from "../components/gallery/GalleryCard";
import axios from 'axios'; // <-- NEW IMPORT

export default function Gallery() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use axios.get instead of native fetch
        const res = await axios.get("/api/projects"); 
        
        // Axios returns the data directly on the .data property
        setProjects(res.data); 
      } catch (err) {
        console.error("Failed to fetch gallery projects:", err);
      }
    };
    fetchProjects();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <section className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>
      
      {projects.length === 0 && (
          <p className="text-center text-gray-500">No projects to display yet. Check back soon!</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {projects.map((p) => (
          <GalleryCard key={p._id} item={p} />
        ))}
      </div>
    </section>
  );
}