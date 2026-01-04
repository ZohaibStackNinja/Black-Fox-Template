import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NewsItem({ post }) {
  // Logic: Use referLink if provided, otherwise route to a detail page
  const destination = post.referLink || `/news/${post._id}`;
  const isExternal = post.referLink?.startsWith("http");

  // Helper to wrap elements in either Link or Anchor
  const ClickWrapper = ({ children, className = "" }) => {
    if (isExternal) {
      return (
        <a href={destination} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    }
    return <Link to={destination} className={className}>{children}</Link>;
  };

  return (
    <Motion.article
      className="post_box bg-gray-800 p-4 rounded-lg mb-6 hover:bg-gray-750 transition-all border border-transparent hover:border-teal-900"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="post_content flex gap-4">
        {post.image && (
          <div className="left shrink-0">
            <ClickWrapper>
              <img src={post.image} alt={post.title} className="w-32 h-32 object-cover rounded cursor-pointer" />
            </ClickWrapper>
          </div>
        )}

        <div className="right flex-1">
          <ClickWrapper>
            <h3 className="text-xl font-semibold text-teal-400 mb-1 hover:text-white transition-colors cursor-pointer">
              {post.title}
            </h3>
          </ClickWrapper>

          <div className="post_info text-gray-400 text-sm mb-2">
            {new Date(post.date).toLocaleDateString()} | <strong>Author:</strong> {post.author} | <strong>Category:</strong> {post.category}
          </div>

          <p className="text-gray-300 mb-2">
            {post.content.length > 240 ? post.content.slice(0, 240) + "..." : post.content}
          </p>

          <div className="flex gap-4 text-teal-400 text-sm font-medium">
            <ClickWrapper className="hover:underline">Continue reading...</ClickWrapper>
            <span className="cursor-default">Comments (0)</span>
          </div>
        </div>
      </div>
    </Motion.article>
  );
}