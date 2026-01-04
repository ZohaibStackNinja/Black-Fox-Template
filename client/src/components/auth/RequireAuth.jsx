import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAuth() {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  // If no token found, redirect to Login page
  if (!token) {
    // 'state={{ from: location }}' allows you to redirect them back 
    // to the page they wanted after they login (optional UX improvement)
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If token exists, render the child routes (The Admin Layout)
  return <Outlet />;
}