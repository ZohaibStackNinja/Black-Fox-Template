// src/pages/Home.jsx
import React from "react";
// import HeroSlider from "../components/home/HeroSlider";
import IntroColumns from "../components/home/IntroColumns";
import FeatureBlackFox from "../components/home/FeatureBlackFox";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const { settings } = useContext(SettingsContext);

  if (!settings) {
    return <p className="text-center mt-12 text-gray-400">Loading...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{settings.siteTitle ? `${settings.siteTitle} — Home` : "Site Title — Home"}</title>
        <meta name="description" content={settings.homepageIntro || "Professional services"} />
        <meta property="og:title" content={settings.siteTitle || "Site Title"} />
        <meta property="og:description" content={settings.homepageIntro || "We capture your special moments"} />
        <meta property="og:image" content={settings.homepageImage || "https://yourdomain.com/og-home.jpg"} />
      </Helmet>

      <IntroColumns />
      <FeatureBlackFox />
    </>
  );
}
