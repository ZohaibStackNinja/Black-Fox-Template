import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: "My Website" },
  logo: String,
  email: String,
  contactNumber: String,
  address: String,

  // About Us Section
  aboutUsTitle: { type: String, default: "About Us" },
  aboutUsDescription: { type: String, default: "" },
  aboutUsImage: { type: String, default: "" },
  aboutUsImagePublicId: { type: String, default: "" },
  homepageIntro: { type: String, default: "" },

  // Home Slider
  homeSliderImages: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      link: { type: String, default: "" },
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
  ],

  templateSections: {
    blackFoxSection: {
      title: String,
      description: String,
      image: String,
    },
  },

  officeHours: String,

  social: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
  },

  footerText: String,
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("SiteSettings", siteSettingsSchema);
