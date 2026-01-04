// src/pages/Contact.jsx
import React, { useContext } from "react";
import ContactForm from "../components/contact/ContactForm.jsx"; 
import { SettingsContext } from "../contexts/SettingsContext";

// FIX APPLIED: Removed the problematic import of lucide-react:
// import { MapPin, Phone, Mail, Clock } from "lucide-react"; 

export default function Contact() {
  const { settings } = useContext(SettingsContext);

  // Theme Colors
  const COLOR_PRIMARY = "#0556B9"; // Deep Blue
  const COLOR_ACCENT = "#d8d3bd"; // Warm Beige

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-[50vh] bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: COLOR_PRIMARY }}></div>
      </div>
    );
  }

  // Define simple style for the icon replacements
  const IconStyle = "text-xl"; 

  return (
    <section className="container mx-auto py-16 px-6 lg:px-12 bg-gray-900 text-gray-100 min-h-screen">
      
      {/* Page Title */}
      <div className="mb-12 border-b pb-4" style={{ borderColor: COLOR_ACCENT }}>
        <h1 className="text-4xl font-bold" style={{ color: COLOR_PRIMARY }}>
          {settings.contactTitle || "Contact Us"}
        </h1>
        <p className="text-gray-400 mt-2">We'd love to hear from you. Send us a message or find our details below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Contact Form */}
        <div>
          <ContactForm />
        </div>

        {/* RIGHT COLUMN: Contact Details (Themed Dark) */}
        <div className="space-y-8">
          
          <div className="p-8 rounded-xl shadow-lg border-l-4 bg-gray-800" style={{ borderColor: COLOR_PRIMARY }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>Contact Details</h3>
            
            <div className="space-y-6">
              {/* Address - Replaced MapPin with Unicode 📍 */}
              <div className="flex items-start">
                <div className="p-2 rounded text-white mr-4 shrink-0 flex items-center justify-center" style={{ backgroundColor: COLOR_PRIMARY }}>
                  <span className={IconStyle}>📍</span> 
                </div>
                <div>
                  <h5 className="font-bold text-gray-200">Address</h5>
                  <p className="text-gray-400 leading-relaxed">
                    {settings.address || "123 Main Street, City, Country"}
                  </p>
                </div>
              </div>

              {/* Phone - Replaced Phone with Unicode 📞 */}
              <div className="flex items-start">
                <div className="p-2 rounded text-white mr-4 shrink-0 flex items-center justify-center" style={{ backgroundColor: COLOR_PRIMARY }}>
                  <span className={IconStyle}>📞</span> 
                </div>
                <div>
                  <h5 className="font-bold text-gray-200">Phone</h5>
                  <p className="text-gray-400">
                    {settings.contactNumber || "+92 300 0000000"}
                  </p>
                </div>
              </div>

              {/* Email - Replaced Mail with Unicode ✉️ */}
              <div className="flex items-start">
                <div className="p-2 rounded text-white mr-4 shrink-0 flex items-center justify-center" style={{ backgroundColor: COLOR_PRIMARY }}>
                  <span className={IconStyle}>✉️</span> 
                </div>
                <div>
                  <h5 className="font-bold text-gray-200">Email</h5>
                  <p className="text-gray-400">
                    {settings.email || "info@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Office Hours Box - Replaced Clock with Unicode 🕒 */}
          <div className="p-8 rounded-xl border-2 flex items-start bg-gray-800/50" style={{ borderColor: COLOR_ACCENT }}>
            <div className="mr-4 mt-1" style={{ color: COLOR_PRIMARY }}>
               <span className="text-2xl">🕒</span> 
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>Office Hours</h4>
              <p className="text-gray-300 whitespace-pre-line">
                {settings.officeHours || "Mon - Fri: 9:00 AM - 6:00 PM"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}