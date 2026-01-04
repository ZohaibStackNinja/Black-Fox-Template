// src/pages/AdminSettings.jsx
import React, { useState, useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

import GeneralSettings from "../../components/adminSettings/GeneralSettings";
import AboutSettings from "../../components/adminSettings/AboutSettings";
import ImagesSettings from "../../components/adminSettings/ImagesSettings";
import BlackFoxSettings from "../../components/adminSettings/BlackFoxSettings";
import SliderSettings from "../../components/adminSettings/SliderSettings";

export default function AdminSettings() {
  const { settings, setSettings } = useContext(SettingsContext);

  // Initialize state directly from settings to avoid setState in useEffect
  const [form, setForm] = useState(() => ({
    siteTitle: settings?.siteTitle || "",
    contactNumber: settings?.contactNumber || "",
    email: settings?.email || "",
    address: settings?.address || "",
    officeHours: settings?.officeHours || "",
    about: settings?.about || "",
    homepageIntro: settings?.homepageIntro || "",
    servicesDescription: settings?.servicesDescription || "",
    // Initializing existing URLs
    logoUrl: settings?.logo || "",
    homepageImageUrl: settings?.homepageImage || "",
    facebook: settings?.social?.facebook || "",
    instagram: settings?.social?.instagram || "",
    twitter: settings?.social?.twitter || "",
    blackFoxTitle: settings?.blackFox?.title || "",
    blackFoxDescription: settings?.blackFox?.description || "",
    blackFoxImageUrl: settings?.blackFox?.image || "",
    metaTitle: settings?.metaTitle || "",
    metaDescription: settings?.metaDescription || "",

    // FIX 1: Add state properties for the actual file objects (will be populated on file selection)
    logo: null,
    homepageImage: null,
    blackFoxImage: null,
  }));

  const updateField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // FIX 2: New handler for file inputs
  const updateFile = (name, file) => {
    setForm((prev) => ({ ...prev, [name]: file }));
  };

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-gray-100 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Website Settings</h2>

      <GeneralSettings
        form={form}
        onChange={updateField}
        setSettings={setSettings}
      />
      <AboutSettings
        form={form}
        onChange={updateField}
        setSettings={setSettings}
      />

      {/* FIX 3: Pass the updateFile handler */}
      <ImagesSettings
        form={form}
        onChange={updateField}
        onFile={updateFile}
        setSettings={setSettings}
      />

      {/* FIX 4: Pass the updateFile handler */}
      <BlackFoxSettings
        form={form}
        onChange={updateField}
        onFile={updateFile}
        setSettings={setSettings}
      />
      <SliderSettings />
    </div>
  );
}
