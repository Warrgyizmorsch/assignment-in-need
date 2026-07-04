"use client";

import React, { useState, useMemo } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ExpertCard } from "@/components/ui/ExpertCard";
import { Pagination } from "@/components/ui/Pagination";
import { StatsStrip } from "@/components/ui/StatsStrip";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { WRITERS } from "@/lib/data";

const SUBJECT_OPTIONS = [
  { label: "All Subjects", value: "all" },
  { label: "Accounting", value: "accounting" },
  { label: "Business Management", value: "business" },
  { label: "Law", value: "law" },
  { label: "Nursing", value: "nursing" },
  { label: "Psychology", value: "psychology" },
  { label: "Engineering", value: "engineering" },
  { label: "Computer Science", value: "computer-science" },
  { label: "Economics", value: "economics" },
  { label: "Marketing", value: "marketing" },
];

const QUALIFICATION_OPTIONS = [
  { label: "All Qualifications", value: "all" },
  { label: "Ph.D. Qualified", value: "phd" },
  { label: "Master's Qualified", value: "masters" },
];

const EXPERIENCE_OPTIONS = [
  { label: "All Experience", value: "all" },
  { label: "5+ Years", value: "5" },
  { label: "8+ Years", value: "8" },
];

const SORT_OPTIONS = [
  { label: "Sort By: Most Rated", value: "rating-desc" },
  { label: "Sort By: Most Orders", value: "orders-desc" },
];

export default function WritersDirectory() {
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedQual, setSelectedQual] = useState("all");
  const [selectedExp, setSelectedExp] = useState("all");
  const [selectedSort, setSelectedSort] = useState("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort logic
  const filteredWriters = useMemo(() => {
    let result = [...WRITERS];

    // Subject Filter
    if (selectedSubject !== "all") {
      result = result.filter((w) =>
        w.expertise.some((exp) => exp.toLowerCase().includes(selectedSubject.toLowerCase()))
      );
    }

    // Qualification Filter
    if (selectedQual !== "all") {
      result = result.filter((w) => {
        if (selectedQual === "phd") return w.qualifications.toLowerCase().includes("ph.d");
        if (selectedQual === "masters") return w.qualifications.toLowerCase().includes("master");
        return true;
      });
    }

    // Experience Filter
    if (selectedExp !== "all") {
      result = result.filter((w) => {
        const years = parseInt(w.experience);
        return years >= parseInt(selectedExp);
      });
    }

    // Sort
    result.sort((a, b) => {
      if (selectedSort === "rating-desc") return b.rating - a.rating;
      if (selectedSort === "orders-desc") {
        const aCount = typeof a.ordersCompleted === "number" ? a.ordersCompleted : parseInt(a.ordersCompleted) || 0;
        const bCount = typeof b.ordersCompleted === "number" ? b.ordersCompleted : parseInt(b.ordersCompleted) || 0;
        return bCount - aCount;
      }
      return 0;
    });

    return result;
  }, [selectedSubject, selectedQual, selectedExp, selectedSort]);

  // Pagination bounds
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(filteredWriters.length / itemsPerPage));
  const currentWriters = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredWriters.slice(start, start + itemsPerPage);
  }, [filteredWriters, currentPage]);

  const breadcrumbItems = [{ label: "Our Writers" }];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-surface-lavender border-b border-primary-50 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
            <div className="lg:col-span-8 flex flex-col gap-4 text-left">
              <Badge variant="soft-purple" className="w-fit text-xs px-3 py-1 font-bold">
                👨‍🎓 Our Writers
              </Badge>
              <Heading level={1} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-heading leading-tight">
                Meet Our Top Academic Writers{" "}
                <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 font-black">
                  Experts You Can Rely On
                </span>
              </Heading>
              <Text className="text-sm md:text-base text-text-body max-w-2xl leading-relaxed">
                Our team of highly qualified academic experts is dedicated to helping you achieve top grades. Browse, filter, and choose the perfect tutor matching your specifications.
              </Text>
            </div>
            
            {/* Right side illustration representation */}
            <div className="hidden lg:col-span-4 lg:flex items-center justify-end">
              <div className="w-40 h-40 rounded-3xl bg-white border border-primary-100 flex items-center justify-center relative animate-pulse shadow-card">
                <span className="text-5xl">🎓</span>
                <div className="absolute -bottom-2 -left-2 bg-accent-600 text-white font-heading font-bold text-xs px-2.5 py-1 rounded-lg shadow">
                  150+ Ph.D Experts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Grid Area */}
      <SectionContainer className="bg-white">
        <div className="flex flex-col gap-6">
          
          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-primary-50/40 p-4 rounded-xl border border-primary-100/50">
            <Select
              placeholder="Subject"
              options={SUBJECT_OPTIONS}
              value={selectedSubject}
              onValueChange={(val) => {
                setSelectedSubject(val);
                setCurrentPage(1);
              }}
            />
            <Select
              placeholder="Qualification"
              options={QUALIFICATION_OPTIONS}
              value={selectedQual}
              onValueChange={(val) => {
                setSelectedQual(val);
                setCurrentPage(1);
              }}
            />
            <Select
              placeholder="Experience"
              options={EXPERIENCE_OPTIONS}
              value={selectedExp}
              onValueChange={(val) => {
                setSelectedExp(val);
                setCurrentPage(1);
              }}
            />
            <Select
              placeholder="Sort By"
              options={SORT_OPTIONS}
              value={selectedSort}
              onValueChange={(val) => {
                setSelectedSort(val);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Expert Grid */}
          {currentWriters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {currentWriters.map((writer) => (
                <ExpertCard
                  key={writer.id}
                  variant="directory"
                  name={writer.name}
                  role={writer.role}
                  rating={writer.rating}
                  ordersCount={writer.ordersCompleted}
                  avatar={writer.avatar}
                  experience={writer.experience}
                  qualifications={writer.qualifications}
                  expertise={writer.expertise}
                  onHire={() => {
                    window.location.href = `/writers/${writer.id}`;
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-primary-100 rounded-xl bg-primary-50/10 mt-4">
              <p className="text-text-muted font-heading font-bold">No academic experts match your selected filters.</p>
              <button
                onClick={() => {
                  setSelectedSubject("all");
                  setSelectedQual("all");
                  setSelectedExp("all");
                  setSelectedSort("rating-desc");
                  setCurrentPage(1);
                }}
                className="text-xs text-primary-700 font-bold underline mt-2 hover:text-primary-600"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Bottom stats cta strip */}
      <StatsStrip />
    </div>
  );
}
