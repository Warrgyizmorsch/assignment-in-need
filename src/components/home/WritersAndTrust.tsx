"use client";

import React, { useState, useEffect } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { getBaseUrl, mapExpertToWriter } from "@/lib/api";
import { Writer } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ExpertSlider } from "@/components/ui/ExpertSlider";
import Link from "next/link";

export const WritersAndTrust: React.FC = () => {
  const [experts, setExperts] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/experts`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const mapped = result.data
              .map((item: any) => mapExpertToWriter(item))
              .filter((writer: Writer) => {
                return (
                  writer.avatar &&
                  writer.avatar.length > 3 &&
                  (writer.avatar.startsWith("/") || writer.avatar.startsWith("http")) &&
                  !writer.avatar.includes("blank.png") &&
                  !writer.avatar.includes("ui-avatars.com")
                );
              })
              .slice(0, 6);
            setExperts(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching experts in WritersAndTrust:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  return (
    <div className="font-sans bg-white flex flex-col animate-fade-in">
      {/* 1. Our Academic Experts */}
      <section
        className="md:pb-10 md:px-8 pb-6 px-6 bg-white max-w-[1400px] w-full mx-auto"
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
          <ExpertSlider
            experts={experts.map((writer) => ({
              id: writer.id,
              name: writer.name,
              role: writer.role,
              avatar: writer.avatar,
              rating: writer.rating,
              ordersCount: writer.ordersCompleted,
              experience: writer.experience,
              qualifications: writer.qualifications,
              slug: writer.id,
            }))}
            className="mb-10"
          />
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
