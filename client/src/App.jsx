import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- SECURITY: Import this once to activate the interceptors ---
import "./utils/axiosConfig"; 

// Layouts
import Layout from "./components/layout/layout";
import AdminLayout from "./pages/admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateProject from "./pages/admin/CreateProject";
import CreatePost from "./pages/admin/CreatePost";
import CreateService from "./pages/admin/CreateService";
import ProjectsList from "./pages/admin/ProjectsList";
import NewsList from "./pages/admin/NewsList";
import ServiceList from "./pages/admin/ServiceList";
import AdminSettings from "./pages/admin/AdminSettings";

// Utilities
import ProtectedRoute from "./pages/admin/ProtectedRoute";
import "./index.css";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        
        {/* ============================== */}
        {/* PUBLIC ROUTES                  */}
        {/* ============================== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="news" element={<News />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about-us" element={<AboutUs />} />
        </Route>

        {/* ============================== */}
        {/* ADMIN LOGIN (Public)           */}
        {/* ============================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ============================== */}
        {/* PROTECTED ADMIN ROUTES         */}
        {/* ============================== */}
        {/* 1. The ProtectedRoute checks for the token */}
        <Route element={<ProtectedRoute />}>
          
          {/* 2. If valid, we render the AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            
            {/* Management Lists */}
            <Route path="projects" element={<ProjectsList />} />
            <Route path="news" element={<NewsList />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Create Actions */}
            <Route path="projects/create" element={<CreateProject />} />
            <Route path="news/create" element={<CreatePost />} />
            <Route path="services/create" element={<CreateService />} />
          </Route>
          
        </Route>

      </Routes>
    </AnimatePresence>
  );
}