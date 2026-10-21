/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Star, ShieldCheck, Award, Briefcase, GraduationCap, ShoppingCart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { WRITERS } from "@/lib/data";

export interface ExpertCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "about"> {
  name: string;
  role: string;
  rating?: number;
  ordersCount: number | string;
  avatar: string;
  experience?: string;
  qualifications?: string;
  expertise?: string[];
  variant?: "default" | "directory" | "subject";
  slug?: string;
  about?: string[] | string;
  description?: string;
  bio?: string;
  onHire?: () => void;
}

const DEFAULT_BLANK_AVATAR = "/assets/media/avatars/blank.png";

export const ExpertCard: React.FC<ExpertCardProps> = ({
  className,
  name,
  role,
  rating = 4.9,
  ordersCount,
  avatar,
  experience,
  qualifications,
  expertise,
  variant = "default",
  slug,
  about,
  description,
  bio,
  onHire,
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState<string>(() => {
    if (
      avatar &&
      avatar.length > 3 &&
      (avatar.startsWith("/") || avatar.startsWith("http")) &&
      !avatar.includes("blank.png") &&
      !avatar.includes("ui-avatars.com")
    ) {
      return avatar;
    }
    return DEFAULT_BLANK_AVATAR;
  });

  React.useEffect(() => {
    if (
      avatar &&
      avatar.length > 3 &&
      (avatar.startsWith("/") || avatar.startsWith("http")) &&
      !avatar.includes("blank.png") &&
      !avatar.includes("ui-avatars.com")
    ) {
      setImgSrc(avatar);
    } else {
      setImgSrc(DEFAULT_BLANK_AVATAR);
    }
  }, [avatar]);

  const handleHireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window !== "undefined") {
      const expertData = {
        id: slug || name,
        name,
        avatar,
        role,
        rating,
        ordersCompleted: ordersCount,
        experience,
        qualifications,
        expertise
      };
      localStorage.setItem("hiredExpert", JSON.stringify(expertData));
    }

    if (onHire) {
      onHire();
      return;
    }
    window.location.href = "/pricing";
  };

  const formattedRating = typeof rating === "number" ? rating.toFixed(1) : parseFloat(String(rating) || "4.9").toFixed(1);
  const numericOrders = typeof ordersCount === 'string' ? parseInt(ordersCount.replace(/[^0-9]/g, ''), 10) : (ordersCount as number || 0);
  
  let inProgressCount = 2;
  if (!isNaN(numericOrders) && numericOrders > 0) {
    const randomOffset = (numericOrders + (name?.length || 0)) % 3;
    if (numericOrders >= 1300) {
      inProgressCount = 4 + randomOffset; // 4, 5, 6
    } else if (numericOrders >= 1000) {
      inProgressCount = 3 + randomOffset; // 3, 4, 5
    } else if (numericOrders >= 700) {
      inProgressCount = 2 + (randomOffset % 2); // 2, 3
    } else {
      inProgressCount = 1 + (randomOffset % 2); // 1, 2
    }
  }

  const expText = experience ? (experience.includes("Exp") || experience.includes("Years") ? experience : `${experience} Years of Experience`) : "8 Years of Experience";

  // Resolve unique writer description
  let rawBio = "";
  if (typeof bio === "string" && bio.trim()) {
    rawBio = bio.trim();
  } else if (typeof description === "string" && description.trim()) {
    rawBio = description.trim();
  } else if (Array.isArray(about) && about.length > 0 && typeof about[0] === "string" && about[0].trim()) {
    rawBio = about[0].trim();
  } else if (typeof about === "string" && about.trim()) {
    rawBio = about.trim();
  } else {
    // Check fallback in WRITERS static list by slug or name
    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const matchedStatic = WRITERS.find(
      (w) =>
        w.id.toLowerCase() === cleanSlug ||
        w.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug
    );
    if (matchedStatic?.about?.[0]) {
      rawBio = matchedStatic.about[0].trim();
    }
  }

  // Format clean text preview (around 135 chars max, breaking at word boundary for 3-4 clean lines)
  const cleanBio = rawBio.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const MAX_BIO_LENGTH = 135;
  let previewBio = cleanBio;
  if (!cleanBio) {
    previewBio = `Experienced ${qualifications || role || "academic expert"} dedicated to helping students achieve top grades across all assignments and coursework...`;
  } else if (cleanBio.length > MAX_BIO_LENGTH) {
    const sub = cleanBio.slice(0, MAX_BIO_LENGTH);
    const lastSpace = sub.lastIndexOf(" ");
    previewBio = (lastSpace > 70 ? sub.slice(0, lastSpace) : sub).trim();
    previewBio = previewBio.replace(/[,;:.—-]+$/, "").trim() + "...";
  } else if (!previewBio.endsWith("...")) {
    previewBio = previewBio + "...";
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 shadow-[0_4px_18px_rgba(15,23,42,0.08)] hover:shadow-[0_14px_32px_rgba(15,23,42,0.14)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col w-full relative overflow-hidden text-left",
        className
      )}
      {...props}
    >
      {/* Peach curved background top */}
      <div className="absolute top-[-60px] left-[-20%] w-[140%] h-[140px] bg-orange-50 rounded-b-[50%] pointer-events-none z-0"></div>

      <div className="relative z-10 px-3 pt-5 pb-4 flex flex-col flex-1">
        {/* Avatar */}
        <div className="mx-auto mb-3">
          <div className="w-[85px] h-[85px] rounded-full border-[3px] border-[#ea580c] shadow-sm overflow-hidden bg-white mx-auto">
            <img
              src={imgSrc}
              alt={name}
              width={85}
              height={85}
              onError={() => setImgSrc(DEFAULT_BLANK_AVATAR)}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* Name and Rating */}
        <div className="text-center mb-1.5">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-[17px] text-gray-900 m-0 leading-tight">
              {name}
            </h3>
            <ShieldCheck className="w-[18px] h-[18px] text-[#22c55e]" fill="#22c55e" stroke="white" />
            <div className="flex items-center gap-0.5 ml-1 border-l border-gray-200 pl-2">
              {(() => {
                const numericOrders = typeof ordersCount === 'string' ? parseInt(ordersCount.replace(/[^0-9]/g, ''), 10) : ordersCount;

                let calculatedRating = 4.0;
                if (!isNaN(numericOrders) && numericOrders > 0) {
                  if (numericOrders >= 1300) {
                    calculatedRating = 5.0;
                  } else if (numericOrders >= 1000) {
                    calculatedRating = 4.5;
                  } else if (numericOrders >= 700) {
                    calculatedRating = 4.0;
                  } else {
                    calculatedRating = 3.5;
                  }
                } else {
                  const numericRating = typeof rating === "number" ? rating : parseFloat(String(rating) || "4.9");
                  const clampedRating = Math.min(Math.max(numericRating, 0), 5);
                  calculatedRating = Math.round(clampedRating * 2) / 2;
                }

                const fullStars = Math.floor(calculatedRating);
                const hasHalfStar = calculatedRating % 1 !== 0;
                const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

                return (
                  <>
                    {[...Array(fullStars)].map((_, i) => (
                      <svg key={`full-${i}`} className="w-[15px] h-[15px] text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z" />
                      </svg>
                    ))}
                    {hasHalfStar && (
                      <svg key="half" className="w-[15px] h-[15px] text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="#e5e7eb" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#halfGrad)" d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z" />
                      </svg>
                    )}
                    {[...Array(emptyStars)].map((_, i) => (
                      <svg key={`empty-${i}`} className="w-[15px] h-[15px] text-[#e5e7eb]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z" />
                      </svg>
                    ))}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-2 text-center">
          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
          <p className="text-[12px] font-medium m-0 leading-tight">
            {qualifications || role || "Academic Expert"}
          </p>
        </div>

        {/* Bio text */}
        <p className="text-[12.5px] text-slate-500 leading-snug text-center mb-3 px-1 min-h-[54px] flex items-center justify-center flex-wrap">
          <span>{previewBio}</span>
          <Link
            href={"/writers/" + (slug && !/^\d+$/.test(slug) ? slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
            className="text-[#ff5722] hover:text-red-700 font-medium ml-1 whitespace-nowrap"
          >
            Read More
          </Link>
        </p>

        {/* Stats List */}
        <div className="flex flex-col gap-1.5 mt-auto mb-4 pl-1">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#f97316] shrink-0" />
            <span className="text-[13.5px] font-medium text-slate-700">Completed Orders</span>
            <span className="bg-[#ff5722] text-white text-[11px] font-bold px-1.5 py-0.5 rounded leading-none">
              {ordersCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#f97316] shrink-0" />
            <span className="text-[13.5px] font-medium text-slate-700">{inProgressCount} In Progress Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#f97316] shrink-0" />
            <span className="text-[13.5px] font-medium text-slate-700">{expText}</span>
          </div>
        </div>

        <Button
          variant="blueOpen"
          fullWidth
          size="sm"
          className="text-[12px] font-extrabold uppercase tracking-widest text-center text-white"
          onClick={handleHireClick}
        >
          {`Hire ${name}`}
        </Button>
      </div>
    </div>
  );
};
ExpertCard.displayName = "ExpertCard";
