// src/components/services/ServiceRow.jsx
import React from "react";
import { FaCheck } from "react-icons/fa";
import { motion as Motion } from "framer-motion";

export default function ServiceRow({ service }) {
  return (
    <Motion.section
      className="flex flex-col md:flex-row items-center gap-8 mb-12"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image on the left */}
      <div className="md:w-1/2 flex flex-col items-center">
        <img
          src={service.image || "/images/service-placeholder.jpg"}
          alt={service.title}
          className="w-full rounded-lg border border-gray-300 p-2"
        />
        {/* Description below the image */}
        {service.servicesDescription && (
          <p className="mt-4 text-gray-600 text-center">
            {service.servicesDescription}
          </p>
        )}
      </div>

      {/* Text & Features on the right */}
      <div className="md:w-1/2">
        <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
        {service.features && (
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <FaCheck className="mt-1 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Motion.section>
  );
}
