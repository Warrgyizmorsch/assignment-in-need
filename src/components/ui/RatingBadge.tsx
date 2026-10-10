import React from "react";

interface RatingBadgeProps {
  className?: string;
  text?: string;
  textColor?: string;
}

export function RatingBadge({
  className = "",
  text = "Rated 4.9/5 by 25,000+ UK Students",
  textColor = "text-gray-800",
}: RatingBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 bg-transparent mb-3 text-[0.78rem] max-[480px]:text-[0.65rem] font-semibold ${textColor} max-lg:justify-center max-md:justify-start max-md:flex-nowrap max-md:whitespace-nowrap ${className}`}
    >
      <div className="flex bg-green-800 py-[3px] px-1.5 rounded gap-0.5 max-[480px]:py-[2px] max-[480px]:px-1 shrink-0">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[11px] h-[11px] max-[480px]:w-3 max-[480px]:h-3 text-white shrink-0"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="max-[480px]:whitespace-nowrap max-[480px]:overflow-hidden max-[480px]:text-ellipsis">
        {text}
      </span>
    </div>
  );
}

export default RatingBadge;
