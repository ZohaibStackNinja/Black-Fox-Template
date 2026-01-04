// src/pages/Services.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceRow from "../components/services/ServiceRow"; // adjust path

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/api/services");
        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Services</h1>
      {services.map((service) => (
        <ServiceRow key={service._id} service={service} />
      ))}
    </div>
  );
}
