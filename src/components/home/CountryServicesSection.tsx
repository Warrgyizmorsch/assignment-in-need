"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

interface CountryItem {
  name: string;
  country: string;
  path: string;
  image: string;
  cities: string;
  badge: string;
  flagSvg: string;
}

const COUNTRY_SERVICES: CountryItem[] = [
  {
    name: "Assignment Help England",
    country: "England",
    path: "/service/assignment-help-england",
    image: "/images/country-services/england.webp",
    cities: "London, Manchester, Birmingham & Leeds",
    badge: "Big Ben & London",
    flagSvg: "/images/flags/england.svg",
  },
  {
    name: "Assignment Help Ireland",
    country: "Ireland",
    path: "/service/assignment-help-ireland",
    image: "/images/country-services/ireland.webp",
    cities: "Dublin, Belfast, Cork & Galway",
    badge: "Dublin City Centre",
    flagSvg: "/images/flags/ireland.svg",
  },
  {
    name: "Assignment Help Scotland",
    country: "Scotland",
    path: "/service/assignment-help-scotland",
    image: "/images/country-services/scotland.webp",
    cities: "Edinburgh, Glasgow, Aberdeen & Dundee",
    badge: "Edinburgh Historic Skyline",
    flagSvg: "/images/flags/scotland.svg",
  },
  {
    name: "Assignment Help Wales",
    country: "Wales",
    path: "/service/assignment-help-wales",
    image: "/images/country-services/wales.webp",
    cities: "Cardiff, Swansea, Newport & Bangor",
    badge: "Cardiff Bay & Waterfront",
    flagSvg: "/images/flags/wales.svg",
  },
];

export default function CountryServicesSection() {
  return (
    <section className="py-6 md:py-9 px-4 md:px-8 bg-gradient-to-b from-white via-[#fafaff] to-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <AnimateIn variant="fadeUp" className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100/80 px-3.5 py-1 rounded-full mb-2.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#f06a33] animate-pulse" />
            <span className="text-[0.7rem] sm:text-xs font-bold text-[#f06a33] uppercase tracking-wider">
              Nationwide Academic Support
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold text-[#1e1b4b] tracking-tight leading-tight mb-2.5">
            Assignment Writing Services Available Across{" "}
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent">
              United Kingdom Countries
            </span>
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Get tailored assignment services for your essays, coursework, dissertations, and university projects across England, Ireland, Scotland, and Wales. Assignment In Need provides expert writers aligned with local UK university grading benchmarks.
          </p>
        </AnimateIn>

        {/* 4 Country Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {COUNTRY_SERVICES.map((country, idx) => (
            <AnimateIn
              key={country.path}
              variant="fadeUp"
              delay={idx * 0.08}
              className="h-full"
            >
              <Link
                href={country.path}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_36px_rgba(240,106,51,0.15)] hover:border-[#f06a33]/40 hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Container with Iconic Landmark */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                  <Image
                    src={country.image}
                    alt={`${country.name} - ${country.badge}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    priority={idx < 2}
                  />

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Country Pill Badge with Official Original Flag */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md pl-1.5 pr-3 py-1 rounded-full shadow-md flex items-center gap-2 border border-white/60">
                    <div className="relative w-5 h-3.5 rounded-[2px] overflow-hidden border border-black/10 shrink-0 shadow-xs">
                      <Image
                        src={country.flagSvg}
                        alt={`${country.country} Official Flag`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-900 tracking-wide">
                      {country.country}
                    </span>
                  </div>

                  {/* Rating / Landmark Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[0.75rem]">
                    <span className="font-semibold text-white/95 drop-shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9/5 Rating
                    </span>
                    <span className="text-[0.7rem] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-white/90">
                      {country.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 bg-white flex flex-col flex-1 text-left justify-between">
                  <div>
                    <h3 className="text-[1.05rem] font-bold text-gray-900 group-hover:text-[#f06a33] transition-colors duration-200 line-clamp-1 leading-snug">
                      {country.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1.5 line-clamp-1">
                      {country.cities}
                    </p>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[0.78rem] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      UK Specialists
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#f06a33] group-hover:translate-x-1 transition-transform duration-200">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
