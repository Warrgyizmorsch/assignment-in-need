import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({ title, excerpt, date, image, href, className, ...props }) => {
  return (
    <article className={`rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full ${className ?? ""}`} {...props}>
      <div className="relative overflow-hidden h-56 w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta Info Row */}
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold mb-3">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5z" />
            </svg>
            Blog
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-text-heading mb-4 leading-snug hover:text-primary-700 transition-colors">
          <Link href={href}>{title}</Link>
        </h3>

        {/* Excerpt Box */}
        <div className="bg-[#FFFDF4] border border-[#F5E2C4]/40 rounded-2xl p-4 mb-5 flex-grow">
          <p className="text-sm text-text-body leading-relaxed line-clamp-3 italic">
            &ldquo;{excerpt}&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link href={href} className="inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-full px-6 py-2.5 text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
            Learn More
          </Link>
        </div>
      </div>
    </article>
  );
};

BlogCard.displayName = "BlogCard";
