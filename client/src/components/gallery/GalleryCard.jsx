import React from 'react';

/**
 * Renders a single project/gallery item card.
 * @param {object} item - The project object containing title, image URL, and link.
 */
export default function GalleryCard({ item }) {
  // Destructure the necessary properties from the item prop
  const { title, image, link, description } = item; 
  
  // Use a fallback image if 'image' is undefined or null (good practice)
  const imageUrl = image || "/placeholder.jpg"; // Assuming you have a default image in /public

  return (
    <div className="bg-white/5 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
      
      {/* Image */}
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-56 object-cover" 
        loading="lazy"
      />
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4">
          {description}
        </p>
        
        {/* Link Button */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            View Project
          </a>
        )}
      </div>
    </div>
  );
}