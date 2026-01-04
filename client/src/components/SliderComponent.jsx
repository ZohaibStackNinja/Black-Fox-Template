// src/components/SliderComponent.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { useRef } from "react";

import cs_leftImg from "../assets/images/cs_leftImg.png";
import cs_rightImg from "../assets/images/cs_rightImg.png";
import templatemo_slider from "../assets/images/templatemo_slider.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function SliderComponent({ slides }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-[450px] h-[170px] flex items-center justify-center bg-gray-800 text-white rounded">
        No slides available
      </div>
    );
  }

  return (
    <div
      className="w-[450px] h-[170px] relative rounded bg-cover bg-center p-2.5"
      style={{ backgroundImage: `url(${templatemo_slider})` }}
    >
      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute -bottom-13 right-11 z-10 -translate-y-1/2 cursor-pointer"
      >
        <img src={cs_leftImg} alt="Prev" />
      </button>
      <button
        ref={nextRef}
        className="absolute -bottom-13 right-0 z-10 -translate-y-1/2 cursor-pointer"
      >
        <img src={cs_rightImg} alt="Next" />
      </button>

      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        slidesPerView={1}
        loop={slides.length > 1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="fade"
        speed={600}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        navigation
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link to={slide.link || "#"} className="block w-[430px] h-[150px]">
              <img
                src={slide.img}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
