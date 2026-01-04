import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Combine hover + active styles
  const linkClass = ({ isActive }) =>
    `block p-2 rounded text-sm transition hover:bg-gray-700 hover:text-white ${
      isActive ? 'bg-gray-700 text-white' : 'text-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col p-4 shadow-lg shadow-black/50">
        <h1 className="text-xl font-bold mb-6 text-teal-400">Admin Panel</h1>
        
        <nav className="flex-grow space-y-2">
          <NavLink to="/admin" className={linkClass}>Dashboard</NavLink>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">WEBSITE SETTING</h3>
            <NavLink to="/admin/settings" className={linkClass}>Site Settings</NavLink>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">CREATE CONTENT</h3>
            <NavLink to="/admin/projects/create" className={linkClass}>Create Project</NavLink>
            <NavLink to="/admin/news/create" className={linkClass}>Create Post</NavLink>
            <NavLink to="/admin/services/create" className={linkClass}>Create Service</NavLink>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">MANAGE CONTENT</h3>
            <NavLink to="/admin/projects" className={linkClass}>Projects List</NavLink>
            <NavLink to="/admin/news" className={linkClass}>News List</NavLink>
            <NavLink to="/admin/services" className={linkClass}>Services List</NavLink>
          </div>
        </nav>

        <button 
          onClick={handleLogout} 
          className="mt-4 p-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-gray-900 text-gray-100">
        <Outlet /> 
      </main>
    </div>
  );
}
