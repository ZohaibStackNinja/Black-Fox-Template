// src/components/home/IntroColumns.jsx
import React from "react";
import { Link } from "react-router-dom"; 
import read_more from "../../assets/images/templatemo_button.png";

export default function IntroColumns() {
  const items = [
    { 
      // Original HTML: <h5>Lorem ipsum dolor sit amet</h5>
      title: "Lorem ipsum dolor sit amet", 
      // Original HTML: <p>Sed et justo non mi tincidunt ullamcorper ut ut purus fringilla tristique diam. </p>
      text: "Sed et justo non mi ut tincidunt ullamcorper  ut purus fringilla tristique." 
    },
    { 
      // Original HTML: <h5>Curabitur ullamcorper neque</h5>
      title: "Curabitur ullamcorper neque", 
      // Original HTML: <p>Morbi sed nulla ac est cursus suscipit eu ac lectus nibh nisi, sed eleifend dolor. </p>
      text: "Morbi sed nulla ac est cursus suscipit eu ac lectus nibh nisi, sed eleifend dolor." 
    },
    { 
      // Original HTML: <h5>Pellentesque vel est a risus </h5>
      title: "Pellentesque vel est a risus", 
      // Original HTML: <p>Vivamus urna lectus, sodales posuere gravida tincidunt, tempus vel sapien. </p>
      text: "Vivamus urna lectus, sodales posuere gravida tincidunt, tempus vel sapien." 
    },
  ];

  return (
    // Top Row Wrapper (#templatemo_top_row_wrapper) 
    <section className="clear-both w-full h-[160px] border-b border-black">
      {/* Top Row Content (#templatemo_top_row) */}
      <div className="mx-auto w-[930px] max-w-full px-[15px] flex h-full">
        {items.map((it, idx) => (
          // Top Row Box (.top_row_box)
          <div 
            key={idx} 
            className={`overflow-hidden float-left w-[300px] h-[160px] py-5 pl-5  pr-[45px] flex-shrink-0 
              ${idx < items.length - 1 
                ? 'border-r border-[#666] border-solid' 
                : ''
              }`
            }
          >
            <h5 className="text-lg text-white mb-2.5">{it.title}</h5> 
            <p className="text-[#777270] pb-2.5 text-[13px]">{it.text}</p> 
            
            {/* The original HTML only had an empty <a> tag inside .button */}
            <div className="button">
                <Link 
                    to="#" 
                    className="clear-both block w-[109px] h-[30px] pt-1 text-center font-bold text-xs no-underline text-gray-300 hover:text-white"
                >
                    {/* The button in the original HTML was blank, but we need text for usability. We'll leave "Read More" or make it blank: */}
                    <img 
                        src={read_more} 
                        alt="Read More" 
                        className="mx-auto"
                    />
                </Link>
            </div>
            {/* If you prefer the original blank button, use: <div className="button"><Link to="#" className="..." /></div> */}

          </div>
        ))}
      </div>
    </section>
  );
}