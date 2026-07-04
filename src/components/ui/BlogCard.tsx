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
    <article className={`rounded-[2rem] overflow-hidden border border-primary-100/60 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)] ${className ?? ""}`} {...props}>
      <div className="relative overflow-hidden h-56">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute right-4 bottom-4 rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold tracking-tight text-text-heading shadow-sm">
          {date}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-heading mb-3 leading-tight">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">{excerpt}</p>
        <div className="mt-6">
          <Link href={href} className="inline-flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-800">
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

BlogCard.displayName = "BlogCard";
