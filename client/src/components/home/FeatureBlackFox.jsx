// // src/components/home/FeatureBlackFox.jsx
// import React from "react";
// // Removed motion as it's not applicable to static content
// // Image import for FeatureBlackFox section
// import featureImg02 from "../../assets/images/templatemo_image_02.jpg";


// export default function FeatureBlackFox() {
//   return (
//     // Content Wrapper (#templatemo_content_wrapper)
//     <section id="templatemo_content_wrapper" className="clear-both w-full border-b border-[#282829]">
      
//       {/* Content Area (#templatemo_content) - This is the primary content area */}
//       <div id="templatemo_content" className="mx-auto w-[930px] max-w-full px-[30px] py-[60px]">
        
//         {/* H1 Tag */}
//         <h1>Black Fox Template</h1>
        
//         {/* Image and Text Block - Combined the .image_wrapper and the .fl_img float class */}
//         <div className="image_wrapper fl_img float-left mr-[30px] mb-[15px] p-2 border border-[#333] bg-black">
//           <a href="#">
//             {/* Used the image path from the original HTML */}
//             <img src={featureImg02} alt="image" className="border-none" />
//           </a>
//         </div>
        
//         {/* Paragraph Content - Used the exact content from the original HTML */}
//         <p>
//           Black Fox is a <a href="http://www.templatemo.com" target="_parent">Free CSS Template</a> by <a href="http://www.templatemo.com" target="_parent">templatemo.com</a> for everyone. Feel free to download, edit and apply this template for your websites. Credit goes to <a href="http://www.photovaco.com" target="_blank">Free Photos</a> for photos used in this template. Pellentesque vel est a risus adipiscing vehicula. Vivamus urna lectus, sodales posuere gravida tincidunt, tempus vel sapien.
//         </p>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget suscipit augue. Sed fermentum eleifend molestie. Donec adipiscing enim vitae metus molestie non molestie ante commodo. Etiam semper ante in dolor tempor condimentum. Nunc mattis aliquet justo, eget consequat libero porta ac. Duis placerat feugiat felis sit amet rutrum. In fringilla, mauris et sollicitudin ornare, leo massa ultricies eros, at accumsan diam orci vitae tellus. Praesent non justo quis augue molestie sagittis.
//         </p>
        
//         {/* Cleaner utility */}
//         <div className="cleaner clear-both w-full h-0 text-xs"></div> 
//       </div> 
//     </section>
//   );
// }

// src/components/home/FeatureBlackFox.jsx
import React, { useContext } from "react";
import { SettingsContext } from "../../contexts/SettingsContext";

// fallback image if no image exists in DB
import featureImg02 from "../../assets/images/templatemo_image_02.jpg";

export default function FeatureBlackFox() {
  const { settings } = useContext(SettingsContext);

  // Extract Black Fox Section values
  const title = settings?.templateSections?.blackFoxSection?.title || "Black Fox Template";
  const description =
    settings?.templateSections?.blackFoxSection?.description ||
    `Black Fox is a Free CSS Template by templatemo.com for everyone. 
     Feel free to download, edit and apply this template for your websites.`;

  const image =
    settings?.templateSections?.blackFoxSection?.image || featureImg02;

  return (
    <section
      id="templatemo_content_wrapper"
      className="clear-both w-full border-b border-[#282829]"
    >
      <div
        id="templatemo_content"
        className="mx-auto w-[930px] max-w-full px-[30px] py-[60px]"
      >
        {/* Title */}
        <h1>{title}</h1>

        {/* Image */}
        <div className="image_wrapper fl_img float-left mr-[30px] mb-[15px] p-2 border border-[#333] bg-black">
          <img src={image} alt="Black Fox" className="border-none max-w-[260px]" />
        </div>

        {/* Description */}
        <p className="leading-6">{description}</p>

        {/* Cleaner */}
        <div className="cleaner clear-both w-full h-0"></div>
      </div>
    </section>
  );
}
