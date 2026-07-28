"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Building2,
  Globe,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";

export default function CitiesListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function fetchApiCities() {
      try {
        setLoading(true);
        const res = await fetch("/api/city-pages");
        if (res.ok) {
          const payload = await res.json();
          const apiCitiesList = Array.isArray(payload?.data) ? payload.data : [];

          if (apiCitiesList.length > 0) {
            const citiesList = apiCitiesList.map((item: any) => {
              const cSlug = (
                item.id ||
                item.slug?.split("/").pop() ||
                ""
              ).toLowerCase();
              const cName =
                item.city ||
                item.title?.replace(/^Assignment Help\s+/i, "") ||
                cSlug.replace(/-/g, " ");
              const formattedName =
                cName.charAt(0).toUpperCase() + cName.slice(1);
              return {
                name: formattedName,
                slug: cSlug,
                description: `Professional essay and assignment help tailored for ${formattedName} university students.`,
                writersCount: 45,
                rating: 4.9,
                successRate: "99.2%",
              };
            });

            setCitiesData([
              {
                country: "United Kingdom",
                countryCode: "UK",
                cities: citiesList,
              },
            ]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch cities list:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchApiCities();
  }, []);

  const tabs = ["All", "United Kingdom"];

  // Filter cities by tab and search query
  const filteredData = citiesData
    .map((group: any) => {
      // Check if the group matches the active tab
      const tabMatch =
        activeTab === "All" ||
        group.country.toLowerCase().includes(activeTab.toLowerCase());
      if (!tabMatch) return { ...group, cities: [] };

      // Check search term filter on cities within group
      const filteredCities = group.cities.filter(
        (city: any) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.country.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return {
        ...group,
        cities: filteredCities,
      };
    })
    .filter((group: any) => group.cities.length > 0);

  const totalFilteredCities = filteredData.reduce(
    (acc: number, curr: any) => acc + curr.cities.length,
    0,
  );

  return (
    <main className="w-full bg-surface-white font-sans">
      {/* Breadcrumbs */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <Breadcrumb items={[{ label: "Cities" }]} />
      </div>

      {/* Hero Header Section */}
      <SectionContainer background="white" className="pt-4 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
          <AnimateIn variant="fadeUp" className="lg:w-7/12">
            <span className="bg-[#f4eeff] text-[#3f159a] text-xs px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider inline-block mb-4">
              Global Support Network
            </span>
            <Heading
              level={1}
              highlight="Support Cities"
              highlightVariant="purple"
            >
              We Support Students in 100+ Cities Globally
            </Heading>
            <p className="text-text-muted mt-4 text-base md:text-lg leading-relaxed">
              Find customized academic writing, essay consulting, and research
              proposal support tailored to your local university formats and
              grading criteria. Select your city to explore expert resources.
            </p>
          </AnimateIn>

          <AnimateIn
            variant="scaleUp"
            className="hidden lg:flex lg:w-4/12 justify-end"
          >
            <div className="bg-gradient-to-tr from-purple-100 to-indigo-50 p-8 rounded-3xl border border-purple-200/50 flex flex-col gap-4 text-left shadow-[0_10px_35px_rgba(63,21,154,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full translate-x-8 -translate-y-8" />
              <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-2 shadow-md">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-[#0f1b3d] text-lg leading-snug">
                Local Expertise, International Standards
              </h3>
              <p className="text-xs text-gray-555 leading-relaxed m-0">
                Our support spans across universities in the United Kingdom,
                Australia, Canada, UAE, and Singapore, matching local rubrics
                perfectly.
              </p>
            </div>
          </AnimateIn>
        </div>
      </SectionContainer>

      {/* Cities Search and Filter Tabs */}
      <SectionContainer background="lavender" className="py-12">
        {/* Controls block */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Search bar */}
          <div className="max-w-md mx-auto w-full relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city or country (e.g. London, Dubai)..."
              className="w-full border border-gray-200 rounded-2xl pl-5 pr-12 py-3.5 text-sm shadow-[0_4px_25px_rgba(0,0,0,0.02)] focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-4.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 scale-105"
                    : "bg-white text-gray-555 border border-gray-100 hover:border-gray-300 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic List Groups */}
        {totalFilteredCities === 0 ? (
          <AnimateIn
            variant="fadeUp"
            className="py-20 text-center bg-white rounded-3xl border border-purple-100/50 px-6 max-w-lg mx-auto shadow-sm"
          >
            <HelpCircle className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-text-heading text-lg mb-1">
              No Cities Found
            </h3>
            <p className="text-text-muted text-sm m-0">
              We couldn't find any support cities matching "{searchTerm}". Try
              broadening your search or select "All" region tab.
            </p>
          </AnimateIn>
        ) : (
          <div className="space-y-16">
            {filteredData.map((group, groupIdx) => (
              <div
                key={group.country || groupIdx}
                className="space-y-6 text-left"
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 border-b border-purple-100/50 pb-3">
                  <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-extrabold border border-purple-100">
                    {group.countryCode}
                  </span>
                  <h2 className="font-extrabold text-[#0f1b3d] text-xl md:text-2xl m-0 tracking-tight">
                    {group.country}
                  </h2>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">
                    {group.cities.length}{" "}
                    {group.cities.length === 1 ? "City" : "Cities"}
                  </span>
                </div>

                {/* Cities Grid */}
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {group.cities.map((city: any, idx: number) => (
                    <StaggerItem key={city.slug || idx}>
                      <div className="bg-white rounded-2xl border border-gray-100/80 p-5 flex flex-col justify-between shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(63,21,154,0.05)] hover:-translate-y-1 duration-300 min-h-[220px] relative overflow-hidden group">
                        {/* Subtle sky background detail */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-50/40 to-transparent rounded-tr-2xl pointer-events-none" />

                        {/* Upper Section */}
                        <div>
                          {/* Location pin and Name */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="font-extrabold text-[#0f1b3d] text-[15px] m-0 tracking-tight group-hover:text-purple-700 transition-colors">
                              {city.name}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 min-h-[48px]">
                            {city.description}
                          </p>
                        </div>

                        {/* Stats & CTA Button */}
                        <div className="space-y-4 pt-3 border-t border-gray-50">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider m-0">
                                Rating
                              </p>
                              <p className="text-[11px] font-extrabold text-amber-600 flex items-center justify-center gap-0.5 m-0 leading-tight">
                                <Star className="w-2.5 h-2.5 fill-current" />{" "}
                                {city.rating}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider m-0">
                                Writers
                              </p>
                              <p className="text-[11px] font-extrabold text-[#3f159a] m-0 leading-tight">
                                {city.writersCount}+
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider m-0">
                                Success
                              </p>
                              <p className="text-[11px] font-extrabold text-emerald-600 m-0 leading-tight">
                                {city.successRate}
                              </p>
                            </div>
                          </div>

                          {/* Action button */}
                          <Link
                            href={`/${city.slug}-assignment-help`}
                            className="btn-shutter-blue-close flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-center transition-colors duration-250 cursor-pointer"
                          >
                            Explore Services{" "}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 duration-200" />
                          </Link>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            ))}
          </div>
        )}
      </SectionContainer>

      {/* Bottom CTA Block */}
      <SectionContainer background="navy" className="py-16 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Heading level={2} className="text-white">
            Don't See Your City Listed?
          </Heading>
          <p className="text-blue-100/80 text-base mt-4 mb-8 max-w-xl">
            We provide remote assignment assistance and editing consultancy to
            college and university students globally. Place your request now to
            get paired with the best native expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/order" className="inline-flex">
              <Button variant="orangeOpen" size="lg" icon={true}>
                Get Free Quote
              </Button>
            </Link>
            <a
              href="https://wa.me/447826233106"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center font-heading font-semibold rounded-btn transition-all duration-200 px-7 py-3 text-lg bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md hover:shadow-lg active:scale-95"
            >
              Consult on WhatsApp
            </a>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
}
