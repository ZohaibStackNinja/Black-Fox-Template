import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-[#0b1833] shadow-xl rounded-xl">

      <h1 className="text-3xl font-bold mb-4 text-textWhite border-b pb-4 border-gray-700">
        Welcome to the Admin Dashboard
      </h1>
      <p className="text-gray-400 mb-8">
        Use the sidebar to manage your website content.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Card 1: Projects */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 border-t-4 border-yellow-500">
          <h3 className="text-xl font-semibold text-textWhite">Projects</h3>
          <p className="mt-2 text-gray-200">Manage your portfolio items.</p>
          <div className="mt-4 text-right">
            <Link to="/admin/projects"
              className="text-sm font-medium text-textWhite hover:text-yellow-500 underline">
              Go to List →
            </Link>
          </div>
        </div>

        {/* Card 2: News */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 border-t-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-400">News/Posts</h3>
          <p className="mt-2 text-gray-400">Publish articles & announcements.</p>
          <div className="mt-4 text-right">
            <Link to="/admin/news"
              className="text-sm font-medium text-green-400 hover:text-green-300 underline">
              Go to List →
            </Link>
          </div>
        </div>

        {/* Card 3: Services */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 border-t-4 border-purple-500">
          <h3 className="text-xl font-semibold text-purple-400">Services</h3>
          <p className="mt-2 text-gray-400">Update your offered services.</p>
          <div className="mt-4 text-right">
            <Link to="/admin/services"
              className="text-sm font-medium text-purple-400 hover:text-purple-300 underline">
              Go to List →
            </Link>
          </div>
        </div>

        {/* ⭐ NEW CARD: Site Settings */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 border-t-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-400">Site Settings</h3>
          <p className="mt-2 text-gray-400">Control global website content.</p>
          <div className="mt-4 text-right">
            <Link to="/admin/settings"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 underline">
              Manage Settings →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
