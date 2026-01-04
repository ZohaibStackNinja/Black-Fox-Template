// /src/components/admin/ProjectsList.jsx (Cloudinary Ready)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

// 🛑 REMOVE unused imports/constants for local file serving:
// import defaultProjectImage from '../../assets/images/gallery/image_01.jpg'; // If you still need a local default, keep this.
// const API_BASE_URL = ''; // REMOVED - No longer needed for Cloudinary paths.

// --- Helper to construct the full image URL (Updated for Cloudinary) ---
const getImageUrl = (imagePath, fileObject) => {
    // 1. If a new file is selected, return the local object URL for preview
    if (fileObject) {
        return URL.createObjectURL(fileObject);
    }
    // 2. If an existing image path is available, it is now the full Cloudinary URL
    if (imagePath) {
        // Cloudinary URLs already contain the full protocol/domain.
        return imagePath;
    }
    // 3. Fallback to a suitable placeholder (using a generic placeholder URL here)
    // NOTE: If you still need a local default image, uncomment the import above and return it here.
    return 'https://via.placeholder.com/150/000000/FFFFFF?text=No+Image';
};

// --- 1. MODAL COMPONENT (EditProjectModal) ---
export function EditProjectModal({ project, onSave, onClose }) {
    // Helper to format Mongoose ISO string to YYYY-MM-DD
    const formatDate = (dateString) => dateString ? new Date(dateString).toISOString().substring(0, 10) : '';

    const [formData, setFormData] = useState({
        title: project?.title || '',
        link: project?.link || '',
        description: project?.description || '',
        date: formatDate(project?.date || project?.createdAt),
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // useEffect to synchronize state when a NEW project is loaded (modal is reused)
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                link: project.link || '',
                description: project.description || '',
                date: formatDate(project.date || project.createdAt),
            });
            setImageFile(null); // Reset image selection when project changes
            setError(null);
        }
    }, [project]); 


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        // Only take the first file selected
        const file = e.target.files[0];
        setImageFile(file);
        // Clear input value if no file is selected upon re-opening dialog
        e.target.value = ''; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!project?._id) {
            setError("Error: Cannot find project ID for update.");
            setIsSaving(false);
            return;
        }

        const data = new FormData();

        // Append all text/URL fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append the new image file if one was selected
        if (imageFile) {
            // 'projectImage' MUST match the field name in your Cloudinary upload middleware
            data.append('projectImage', imageFile); 
        }

        try {
            const token = localStorage.getItem("adminToken"); 

            if (!token) {
                setError("No authentication token found. Please log in.");
                setIsSaving(false);
                return;
            }

            const config = {
                headers: {
                    // Do NOT manually set 'Content-Type' when using FormData
                    'Authorization': `Bearer ${token}`,
                }
            };

            // 🚀 API CALL: Use PUT on the protected admin path
            const response = await axios.put(
                `/api/admin/projects/${project._id}`,
                data,
                config
            );

            // SUCCESS
            onSave(response.data); 

        } catch (err) {
            console.error("Failed to update project:", err);
            const status = err.response?.status;
            let message = err.response?.data?.message || err.message || 'Check console for details.';
            
            if (status === 401) {
                message = "Session expired or unauthorized. Please log in again.";
            } else if (status === 400) {
                message = `Validation Error: ${message}`;
            } else if (status === 500) {
                message = `Server Error (500): Check your server console for the detailed crash report.`;
            }

            setError(`Error saving project: ${message}`);

        } finally {
            setIsSaving(false);
        }
    };

    if (!project) return null;


    return (
        // Modal Backdrop
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose} 
        >
            {/* Modal Content */}
            <div 
                className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] text-gray-100"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold text-teal-400 mb-4 border-b border-gray-700 pb-2">
                    Edit Project: {project.title}
                </h3>
                
                {error && (
                    <div className="p-3 mb-4 rounded-lg bg-red-800 text-white font-medium text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>

                    {/* --- Image Display & Upload Field --- */}
                    <div className="mb-6 border-b border-gray-700 pb-4">
                        <label className="block text-gray-300 mb-2">Current Image</label>
                        <div className="flex items-center mb-3">
                            {/* Uses the simplified getImageUrl */}
                            <img 
                                src={getImageUrl(project.image, imageFile)}
                                alt={`Image for ${project.title}`}
                                className="w-24 h-24 object-cover rounded mr-4 border border-gray-600"
                            />
                        </div>
                        <label className="block text-gray-300 mb-2" htmlFor="projectImage">Upload New Image (Optional)</label>
                        <input
                            id="projectImage"
                            name="projectImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        />
                         {imageFile && <p className="text-sm text-yellow-400 mt-1">New file selected: **{imageFile.name}**</p>}
                    </div>
                    
                    {/* Title Field */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
                            required
                        />
                    </div>
                    
                    {/* Link Field */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="link">Link</label>
                        <input
                            id="link"
                            name="link"
                            type="url"
                            value={formData.link}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
                        />
                    </div>
                    
                    {/* Description Field */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
                        />
                    </div>
                    
                    {/* Date Field */}
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2" htmlFor="date">Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-teal-500"
                        />
                    </div>
                    
                    {/* --- ACTIONS --- */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition font-semibold disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// --- 2. MAIN COMPONENT (ProjectsList) ---
// ----------------------------------------------------------------------

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    // --- Data Fetching (Public GET) ---
    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Uses the PUBLIC GET route: /api/projects
            const response = await axios.get("/api/projects");
            setProjects(response.data);
            setStatusMessage({ type: 'success', text: `Successfully loaded ${response.data.length} projects.` });
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            const errorText = 
                error.code === 'ERR_NETWORK'
                    ? 'Connection Error: Cannot reach backend API. Check if your server is running.'
                    : 'Error fetching projects list.';
            setStatusMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // --- Modal Handlers ---
    const handleEditClick = (project) => {
        setCurrentProject(project); 
        setIsModalOpen(true); 
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentProject(null); 
    };

    const handleSave = (updatedProject) => {
        // Update the local state with the saved data returned from the server.
        setProjects(
            projects.map(p => 
                p._id === updatedProject._id ? updatedProject : p
            )
        );
        handleModalClose(); 
        setStatusMessage({ type: 'success', text: `Project **${updatedProject.title}** updated successfully.` });
    };

    // --- Delete Handler (Protected DELETE) ---
    const handleDelete = async (projectId, title) => {
        if (!window.confirm(`Are you sure you want to delete the project: "${title}"? This action cannot be undone.`)) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            alert("Not authorized. Please log in.");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        
        setStatusMessage({ type: null, text: "" }); // Clear old message
        try {
            // Uses the PROTECTED DELETE route: /api/admin/projects/:id
            await axios.delete(`/api/admin/projects/${projectId}`, config);
            
            setProjects(projects.filter(project => project._id !== projectId));
            setStatusMessage({ type: 'success', text: `Project **${title}** deleted successfully.` });
        } catch (error) {
            console.error("Failed to delete project:", error);
            let message = 'Error deleting project.';
            if (error.response?.status === 401) {
                message = 'Unauthorized. Please log in.';
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            setStatusMessage({ type: 'error', text: message });
        }
    };


    return (
        <>
            {/* RENDER THE MODAL IF OPEN */}
            {isModalOpen && currentProject && ( 
                <EditProjectModal 
                    project={currentProject} 
                    onSave={handleSave} 
                    onClose={handleModalClose} 
                />
            )}

            {/* --- Main Dashboard Content --- */}
            <div className="container mx-auto py-8 p-8 bg-gray-900 rounded-xl shadow-2xl text-gray-100">
                <div className="flex justify-between items-center mb-6 border-b pb-3 border-gray-700">
                    <h2 className="text-3xl font-bold text-teal-400">Manage Projects</h2>
                    <Link 
                        to="/admin/projects/create"
                        className="bg-teal-600 text-gray-100 px-4 py-2 rounded-lg font-semibold hover:bg-teal-500 transition duration-300"
                    >
                        + Add New Project
                    </Link>
                </div>
                
                {statusMessage.text && (
                    <div className={`p-4 mb-6 rounded-lg font-semibold ${statusMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {statusMessage.text}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-400">Loading projects...</p>
                ) : projects.length === 0 && statusMessage.type !== 'error' ? (
                    <p className="text-gray-400">No projects found. Use the button above to create one.</p>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full table-auto border-collapse">
                            <thead className="text-xs uppercase bg-gray-800 text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left hidden md:table-cell">Link</th>
                                    <th scope="col" className="px-6 py-3 text-left hidden sm:table-cell">Date</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr 
                                        key={project._id} 
                                        className="border-b bg-gray-700 border-gray-600 hover:bg-gray-600 transition duration-150"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">
                                            {project.title}
                                        </td>
                                        <td className="px-6 py-4 text-teal-400 hidden md:table-cell">
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">
                                            {project.date && project.date.substring(0, 10)}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                            <button 
                                                onClick={() => handleEditClick(project)}
                                                className="text-yellow-400 hover:text-yellow-300 font-medium transition"
                                            >
                                                Edit (Pop-up)
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleDelete(project._id, project.title)}
                                                className="text-red-500 hover:text-red-400 font-medium transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}