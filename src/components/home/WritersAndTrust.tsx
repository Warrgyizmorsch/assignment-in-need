"use client";

import React, { useState, useEffect } from "react";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { mapExpertToWriter } from "@/lib/api";
import { WRITERS } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ExpertCard } from "@/components/ui/ExpertCard";
import Link from "next/link";

interface Expert {
  name: string;
  subject: string;
  experience: string;
  rating: number;
  orders: number;
  image: string;
  id: string;
}

const FALLBACK_EXPERTS: Expert[] = [
  {
    id: "laura-baker",
    name: "Dr. Laura Baker",
    subject: "Business Management",
    experience: "9+ Years Exp.",
    rating: 4.9,
    orders: 1340,
    image: "/assets/media/layout/testimonial/testimonial5.webp",
  },
  {
    id: "oliver-bennett",
    name: "Prof. Oliver Bennett",
    subject: "Law Expert",
    experience: "12+ Years Exp.",
    rating: 4.8,
    orders: 2100,
    image: "/assets/media/layout/testimonial/testimonial6.webp",
  },
  {
    id: "sophia-adams",
    name: "Dr. Sophia Adams",
    subject: "Nursing Expert",
    experience: "8+ Years Exp.",
    rating: 4.9,
    orders: 1360,
    image: "/assets/media/layout/testimonial/testimonial1.webp",
  },
  {
    id: "daniel-carter",
    name: "Dr. Daniel Carter",
    subject: "Computer Science",
    experience: "10+ Years Exp.",
    rating: 4.9,
    orders: 1550,
    image: "/assets/media/layout/testimonial/testimonial2.webp",
  },
];

export const WritersAndTrust: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch("/api/experts");
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const mapped = result.data
              .map((item: any) => {
                const parsed = mapExpertToWriter(item);
                const hasRealImage =
                  parsed.avatar &&
                  !parsed.avatar.includes("blank.png") &&
                  !parsed.avatar.includes("ui-avatars.com");
                return {
                  id: parsed.id,
                  name: parsed.name,
                  subject: parsed.role.replace(" Expert", ""),
                  experience: parsed.experience.includes("Years")
                    ? `${parsed.experience} Exp.`
                    : parsed.experience,
                  rating: parsed.rating,
                  orders: parsed.ordersCompleted || 250,
                  image: parsed.avatar,
                  hasRealImage,
                };
              })
              .filter((expert: any) => expert.hasRealImage && expert.image)
              .slice(0, 4);
            setExperts(mapped);
          } else {
            setExperts(FALLBACK_EXPERTS);
          }
        } else {
          setExperts(FALLBACK_EXPERTS);
        }
      } catch (err) {
        console.error("Error fetching experts in WritersAndTrust:", err);
        setExperts(FALLBACK_EXPERTS);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const getAvatarUrl = (url: string) => {
    if (!url || url.includes("ui-avatars.com") || url.length <= 3) {
      return "/assets/media/avatars/blank.png";
    }
    return url;
  };

  return (
    <div className="font-sans bg-white flex flex-col animate-fade-in">
      {/* 1. Our Academic Experts */}
      <section
        className="md:pt-4 md:pb-10 md:px-8 pt-3 pb-6 px-6 bg-white max-w-[1400px] w-full mx-auto"
        id="experts"
      >
        <AnimateIn variant="fadeUp" className="mb-10 text-center">
          <h2 className="text-3xl lg:text-[2rem] font-extrabold text-gray-900 m-0 mb-2">
            Our Academic
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis"> Experts</span>
          </h2>
          <p className="text-base text-gray-600 m-0">
            150+ Subject Experts | PhD & Master's Qualified
          </p>
        </AnimateIn>

        {loading ? (
          /* Shimmer skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center animate-pulse gap-3">
                <div className="w-[90px] h-[90px] rounded-full bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop grid */}
            <StaggerContainer className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {experts.map((expert) => (
                <StaggerItem key={expert.id}>
                  <Link
                    href={`/writers/${expert.id}`}
                    className="block h-full no-underline hover:no-underline"
                  >
                    <ExpertCard
                      name={expert.name}
                      role={`${expert.subject} Expert`}
                      rating={expert.rating}
                      ordersCount={expert.orders}
                      avatar={getAvatarUrl(expert.image)}
                      experience={expert.experience}
                      onHire={() => {
                        window.location.href = "/order";
                      }}
                      className="h-full"
                    />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

          {/* Mobile vertical list */}
          <StaggerContainer className="flex md:hidden flex-col gap-3 mb-6">
            {experts.map((expert) => (
              <StaggerItem key={expert.id}>
                <Link
                  href={`/writers/${expert.id}`}
                  className="bg-white rounded-xl p-[1.2rem_1rem] flex items-center gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#f9fafb] cursor-pointer no-underline block"
                >
                  <img
                    src={getAvatarUrl(expert.image)}
                    alt={expert.name}
                    width={65}
                    height={65}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/media/avatars/blank.png";
                    }}
                    className="w-[65px] h-[65px] rounded-full object-cover bg-gray-100"
                  />
                  <div className="flex flex-col flex-1 text-left">
                    <h3 className="text-[0.95rem] font-bold text-gray-900 m-0 mb-1">
                      {expert.name}
                    </h3>
                    <span className="text-[0.75rem] text-gray-500 m-0 mb-1">
                      {expert.subject}
                    </span>
                    <span className="text-[0.75rem] text-gray-600 font-semibold m-0 mb-1.5">
                      {expert.experience}
                    </span>
                    <div className="flex items-center gap-1.5 text-[0.8rem] text-gray-600 font-semibold">
                      <i className="text-amber-500 not-italic text-[1rem]">★</i>
                      <span>
                        {expert.rating.toFixed(1)} ({expert.orders}+ Orders)
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-300 text-2xl pl-2 font-bold">
                    &rarr;
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}

        <div className="text-center mt-6">
          <Link href="/writers" className="inline-block md:w-auto w-full">
            <Button variant="blueClose" className="md:w-auto w-full" icon={true}>
              View All Experts
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
