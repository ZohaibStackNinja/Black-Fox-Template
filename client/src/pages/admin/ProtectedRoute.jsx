import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");
  const location = useLocation();

  // If no token, redirect to Login, but remember where they were trying to go
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authorized, render the child routes (e.g., AdminLayout)
  return <Outlet />;
};

export default ProtectedRoute;