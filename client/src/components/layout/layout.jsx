// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion as Motion } from "framer-motion";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Motion.div
        className="min-h-[70vh] bg-darkGrey text-textWhite"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </Motion.div>
      <Footer />
    </>
  );
}
