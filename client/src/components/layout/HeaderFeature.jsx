// src/components/layout/HeaderFeature.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

export default function HeaderFeature() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2000 }}
      loop
      slidesPerView={1}
    >
      <SwiperSlide>Featured: Wedding Shoots</SwiperSlide>
      <SwiperSlide>Featured: Studio Sessions</SwiperSlide>
      <SwiperSlide>Featured: Editing Services</SwiperSlide>
    </Swiper>
  );
}
