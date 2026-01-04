// src/components/layout/Navbar.jsx
import React, { useContext, useMemo } from "react";
import { NavLink, Link } from "react-router-dom";
import { SettingsContext } from "../../contexts/SettingsContext";
import SliderComponent from "../SliderComponent";

import templatemo_header from "../../assets/images/templatemo_header.jpg";
import templatemo_header_wrapper from "../../assets/images/templatemo_header_wrapper.jpg";
import templatemo_logo from "../../assets/images/templatemo_logo.png";

export default function Navbar() {
  const { settings } = useContext(SettingsContext);

  const slides = useMemo(() => {
    if (!settings?.homeSliderImages?.length) return [];
    return settings.homeSliderImages.map((s, i) => ({
      id: i,
      img: s.url,
      link: s.link || "#",
    }));
  }, [settings]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/news", label: "News" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about-us", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="w-full border-b border-black">
      <nav className="w-full h-[44px] bg-footer-bg">
        <ul className="mx-auto w-[920px] max-w-full flex items-center gap-[1px] h-full list-none p-0">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `float-left flex justify-center items-center w-[124px] h-12.5 text-center text-base no-underline font-normal transition-colors duration-200 ${
                  isActive
                    ? "text-white! bg-[#0556B9] rounded-b"
                    : "text-[#d8d3bd]! hover:bg-[#0556B9] hover:text-white!"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>
      </nav>

      <div
        id="templatemo_header_wrapper"
        className="w-full h-[250px] border-b border-black"
        style={{
          backgroundImage: `url(${templatemo_header_wrapper})`,
          backgroundRepeat: "repeat-x",
          backgroundPosition: "center top",
        }}
      >
        <div
          id="templatemo_header"
          className="mx-auto w-[990px] max-w-full h-[250px] py-[20px] px-[30px] overflow-hidden flex justify-between"
          style={{
            backgroundImage: `url(${templatemo_header})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        >
          <div id="site_title" className="float-left pt-[40px] pl-[100px] pr-[20px]">
            <h1>
              <Link to="/">
                <img src={settings?.logo || templatemo_logo} alt="logo" />
              </Link>
            </h1>
          </div>

          <SliderComponent slides={slides} />

          <div className="clear-both"></div>
        </div>
      </div>
    </header>
  );
}
