// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom"; 
import templatemo_image_04 from "../../assets/images/templatemo_image_04.jpg";


export default function Footer() {

  return (
    <>
      {/* 1. FOOTER WRAPPER: #templatemo_footer_wrapper */}
      <footer id="templatemo_footer_wrapper" 
        className="w-full border-t border-b border-black bg-footer-bg clear-both">
        
        {/* 2. FOOTER CONTENT: #templatemo_footer (Fixed Width Container) */}
        <div id="templatemo_footer" 
          className="mx-auto w-[930px] max-w-full px-[30px] py-[45px] text-[#d8d3bd]">

          {/* Grid Layout for Footer Boxes (Using flex/gap to mimic old columns) */}
          <div className="flex justify-between gap-x-[30px]"> 

            {/* BOX 1: ABOUT US: .footer_box */}
            <div className="w-[280px] pr-[30px] footer_box">
              <div className="footer_menu">
                <h3 className="text-xl text-white mb-5">About Us</h3> 
                
                {/* Image from original HTML */}
                <img src={templatemo_image_04} alt="image" className="mb-2.5 w-full h-auto" />
                
                {/* Text from original HTML */}
                <p className="pb-2.5 text-primary-text">
                  Nullam ultrices tempor nisi, ac egestas diam aliquam mattis adipiscing imperdiet.
                </p>
                
                {/* Button from original HTML */}
                <div className="button">
                  <Link 
                    to="#" 
                    className="clear-both block w-[109px] h-[30px] pt-1 text-center font-bold text-xs no-underline text-gray-300 hover:text-white"
                  /> 
                  {/* Note: The button is intentionally blank, matching the original structure */}
                </div>
              </div>
            </div>

            {/* BOX 2: NAVIGATION: .footer_box */}
            <div className="w-[280px] pr-[30px] footer_box">
              <div className="footer_menu">
                <h3 className="text-xl text-white mb-5">Navigation</h3>
                
                {/* List items matching the original HTML paths */}
                <ul className="list-none m-0 p-0 text-link"> 
                  <li className="py-[5px]"><Link to="/">Home</Link></li>
                  <li className="py-[5px]"><Link to="/about-us">About Us</Link></li>
                  <li className="py-[5px]"><Link to="/services">Services</Link></li>
                  <li className="py-[5px]"><Link to="/gallery">Gallery</Link></li>
                  <li className="py-[5px]"><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            {/* BOX 3: PARTNERS: .footer_box */}
            <div className="w-[280px] pr-0 footer_box">
              <h3 className="text-xl text-white mb-5">Partners</h3>
              
              {/* List items matching the original HTML external links */}
              <ul className="list-none m-0 p-0 text-link">
                <li className="py-[5px]"><a href="http://www.templatemo.com/page/2" target="_parent">Website Templates</a></li> 
                <li className="py-[5px]"><a href="http://www.flashmo.com" target="_parent">Free Flash Templates</a></li>
                <li className="py-[5px]"><a href="http://www.flashmo.com/store" target="_parent">Premium Themes</a></li>
                <li className="py-[5px]"><a href="http://www.webdesignmo.com/blog" target="_parent">Web Design Blog</a></li>
                <li className="py-[5px]"><a href="http://www.koflash.com" target="_blank">Flash Websites Gallery</a></li> 
              </ul>
            </div>
            
          </div> 
          {/* Cleaner utility from HTML */}
          <div className="cleaner clear-both w-full h-0 text-xs"></div> 
        </div> 
      </footer>

      {/* 3. COPYRIGHT SECTION: #templatemo_copyright_wrapper */}
      <div id="templatemo_copyright_wrapper" 
        className="w-full bg-black border-t border-[#262626]">
        
        {/* #templatemo_copyright container */}
        <div id="templatemo_copyright" 
          className="mx-auto w-[960px] max-w-full px-5 py-[15px] text-center text-[#6e6965] text-sm">
          
          {/* Copyright content matching the original HTML */}
          Copyright © 2048 <a href="#" className="text-inherit hover:text-link-hover">Your Company Name</a> | 
          Designed by <a href="http://www.templatemo.com" target="_parent" className="text-inherit hover:text-link-hover">CSS Templates</a> | 
          Validate <a href="http://validator.w3.org/check?uri=referer" className="text-inherit hover:text-link-hover">XHTML</a> &amp; <a href="http://jigsaw.w3.org/css-validator/check/referer" className="text-inherit hover:text-link-hover">CSS</a>
          
        </div> 
      </div>
    </>
  );
}