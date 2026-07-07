/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  institution: string;
  quote: string;
  rating?: number;
  avatar?: string;
  featured?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  className,
  name,
  institution,
  quote,
  rating = 5,
  avatar,
  featured = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative text-left h-full border select-none",
        featured
          ? "bg-[#3f159a] text-white border-[#3f159a] shadow-[0_8px_30px_rgba(63,21,154,0.15)]"
          : "bg-white text-[#334155] border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]"
      )}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {/* Large quotes icon */}
        <span
          className={cn(
            "font-serif text-5xl leading-none select-none",
            featured ? "text-white/20" : "text-[#3f159a]/25"
          )}
        >
          “
        </span>

        {/* Testimonial Quote */}
        <p
          className={cn(
            "text-[14px] leading-relaxed font-medium",
            featured ? "text-white" : "text-slate-600"
          )}
        >
          {quote}
        </p>
      </div>

      {/* User Details & Rating */}
      <div className="mt-6 flex flex-col gap-3">
        {/* Profile Row */}
        <div className="flex items-center gap-3">
          {/* Avatar Image */}
          <div
            className={cn(
              "w-[38px] h-[38px] rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs uppercase",
              featured ? "bg-white text-[#3f159a]" : "bg-[#f3f0ff] text-[#3f159a]"
            )}
          >
            {avatar ? (
              avatar.startsWith("/") || avatar.startsWith("http") ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatar
              )
            ) : (
              name.charAt(0)
            )}
          </div>

          {/* Name & University */}
          <div className="flex flex-col text-left">
            <span
              className={cn(
                "font-extrabold text-[13.5px] leading-tight",
                featured ? "text-white" : "text-[#0f1b3d]"
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "text-[11.5px] font-semibold mt-0.5",
                featured ? "text-white/70" : "text-gray-400"
              )}
            >
              {institution}
            </span>
          </div>
        </div>

        {/* Rating Stars Row */}
        <div className="flex gap-1 pl-[50px] -mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn(
                "w-3.5 h-3.5 fill-current",
                i < rating ? "text-[#f59e0b]" : "text-slate-200"
              )}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};
TestimonialCard.displayName = "TestimonialCard";
