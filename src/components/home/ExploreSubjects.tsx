import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  AnimateIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/AnimateIn";

export default function ExploreSubjects() {
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const [subjectsList, setSubjectsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/admin/subjects");
        if (res.ok) {
          const payload = await res.json();
          if (
            (payload.success || payload.status === "success") &&
            Array.isArray(payload.data)
          ) {
            setSubjectsList(payload.data);
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchSubjects();
  }, []);

  const SUBJECT_COLORS = [
    { bg: "bg-[#f3e8ff]", text: "text-[#7e22ce]" },
    { bg: "bg-[#ffedd5]", text: "text-[#ea580c]" },
    { bg: "bg-[#dcfce7]", text: "text-[#16a34a]" },
    { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
    { bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" },
    { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  ];

  const slideSubjects = (direction: number) => {
    const wrapper = trackWrapperRef.current;
    if (!wrapper) return;

    const scrollAmount = 280 * direction;

    if (
      direction === 1 &&
      wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10
    ) {
      wrapper.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && wrapper.scrollLeft <= 10) {
      wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: "smooth" });
      return;
    }

    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const fallbackSubjects = [
    {
      name: "Business",
      slug: "business",
      count: "12,500+",
      bg: "bg-[#f3e8ff]",
      text: "text-[#7e22ce]",
      icon: "grid",
    },
    {
      name: "Law",
      slug: "law",
      count: "8,600+",
      bg: "bg-[#ffedd5]",
      text: "text-[#ea580c]",
      icon: "scale",
    },
    {
      name: "Nursing",
      slug: "nursing",
      count: "9,800+",
      bg: "bg-[#dcfce7]",
      text: "text-[#16a34a]",
      icon: "heart",
    },
    {
      name: "Psychology",
      slug: "psychology",
      count: "7,200+",
      bg: "bg-[#fee2e2]",
      text: "text-[#dc2626]",
      icon: "info",
    },
    {
      name: "Accounting",
      slug: "accounting",
      count: "11,200+",
      bg: "bg-[#e0f2fe]",
      text: "text-[#0284c7]",
      icon: "dollar",
    },
    {
      name: "Economics",
      slug: "economics",
      count: "5,200+",
      bg: "bg-[#f0fdf4]",
      text: "text-[#15803d]",
      icon: "chart",
    },
    {
      name: "Chemistry",
      slug: "chemistry",
      count: "4,200+",
      bg: "bg-[#f3e8ff]",
      text: "text-[#7e22ce]",
      icon: "triangle",
    },
    {
      name: "Sociology",
      slug: "sociology",
      count: "3,200+",
      bg: "bg-[#ffedd5]",
      text: "text-[#ea580c]",
      icon: "users",
    },
    {
      name: "Management",
      slug: "management",
      count: "9,200+",
      bg: "bg-[#dcfce7]",
      text: "text-[#16a34a]",
      icon: "clock",
    },
    {
      name: "Marketing",
      slug: "marketing",
      count: "5,500+",
      bg: "bg-[#fee2e2]",
      text: "text-[#dc2626]",
      icon: "twitter",
    },
  ];

  return (
    <section className="py-8 px-4 md:py-8 md:px-4 bg-[#faf5ff] font-sans border-t border-b border-[#f3e8ff]/50">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-5 px-4 md:px-4 text-center md:text-left flex-col md:flex-row gap-2 md:gap-0">
          <AnimateIn variant="fadeUp" className="w-full md:w-auto">
            <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-[#1e1b4b] m-0 mb-2">
              Explore
              <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis">
                {" "}
                Subjects{" "}
              </span>
            </h2>
            <p className="text-[0.95rem] text-gray-600 m-0 font-medium">
              Expert help in 150+ subjects
            </p>
          </AnimateIn>
          {/* <a
            href="/services"
            className="hidden md:flex text-[0.95rem] font-bold text-[#4f46e5] hover:text-[#3730a3] items-center gap-2 transition-colors duration-300"
          >
            View All Subjects &rarr;
          </a> */}
        </div>

        <div className="relative flex items-center gap-4">
          <button
            className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer text-[#4f46e5] items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#f3e8ff] hover:border-[#d8b4fe] shrink-0 z-[2]"
            onClick={() => slideSubjects(-1)}
            aria-label="Previous subjects"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            className="w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] py-2 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] max-md:overflow-visible max-md:mask-none"
            id="znhSubjectsTrackWrapper"
            ref={trackWrapperRef}
          >
            <StaggerContainer className="flex gap-3 w-max px-2.5 max-md:grid max-md:grid-cols-3 max-md:gap-2 max-md:w-full max-md:p-0">
              {subjectsList.length > 0
                ? subjectsList.map((sub: any, i: number) => {
                    const cleanSlug = (sub.slug || "").replace(/^\/+/, "");
                    const finalSlug = cleanSlug.startsWith("subject/")
                      ? cleanSlug.replace("subject/", "")
                      : cleanSlug;
                    const mappedSlug = finalSlug === "maths" || finalSlug === "math" ? "math" : finalSlug;
                    const humanized = finalSlug
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase());
                    const name = sub.title || humanized;
                    const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];

                    return (
                      <StaggerItem key={sub.id || i}>
                        <Link
                          href={`/${mappedSlug}-assignment-help`}
                          className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color.bg} ${color.text} max-md:w-9 max-md:h-9 max-md:rounded-full`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                            <p className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">
                              {name.split(" Help")[0].split(" Assignment")[0]}
                            </p>
                            <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">
                              {(12500 - i * 1250 > 1000
                                ? 12500 - i * 1250
                                : 2200
                              ).toLocaleString()}
                              + Orders
                            </span>
                          </div>
                        </Link>
                      </StaggerItem>
                    );
                  })
                : fallbackSubjects.map((sub: any, i: number) => {
                    const mappedSlug = sub.slug === "maths" || sub.slug === "math" ? "math" : sub.slug;
                    return (
                      <StaggerItem key={i}>
                        <Link
                          href={`/${mappedSlug}-assignment-help`}
                          className="bg-white rounded-lg p-[0.6rem_0.8rem] flex items-center gap-2.5 min-w-[180px] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.75 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#f3e8ff] max-md:min-w-0 max-md:p-3 max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-2"
                        >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sub.bg} ${sub.text} max-md:w-9 max-md:h-9 max-md:rounded-full`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-[15px] h-[15px] max-md:w-[18px] max-md:h-[18px]"
                          >
                            {sub.icon === "grid" && (
                              <rect x="3" y="3" width="7" height="7" />
                            )}
                            {sub.icon === "grid" && (
                              <rect x="14" y="3" width="7" height="7" />
                            )}
                            {sub.icon === "grid" && (
                              <rect x="14" y="14" width="7" height="7" />
                            )}
                            {sub.icon === "grid" && (
                              <rect x="3" y="14" width="7" height="7" />
                            )}
                            {sub.icon !== "grid" && (
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            )}
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1 max-md:items-center max-md:gap-[2px]">
                          <p className="m-0 text-[0.68rem] font-bold text-gray-900 max-md:text-[0.65rem] max-md:text-center max-md:whitespace-nowrap">
                            {sub.name}
                          </p>
                          <span className="text-[0.68rem] text-gray-500 font-medium max-md:text-[0.55rem] max-md:text-center">
                            {sub.count} Orders
                          </span>
                        </div>
                      </Link>
                    </StaggerItem>
                    );
                  })}
            </StaggerContainer>
          </div>

          <button
            className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer text-[#4f46e5] items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:bg-[#f3e8ff] hover:border-[#d8b4fe] shrink-0 z-[2]"
            onClick={() => slideSubjects(1)}
            aria-label="Next subjects"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3.5 h-3.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <Link
          href="/services"
          className="flex md:hidden justify-center items-center w-full p-3 mt-5 bg-white border border-gray-200 rounded-lg text-[#4f46e5] hover:bg-gray-50 font-semibold text-[0.68rem] transition-all duration-300"
        >
          View All Subjects &rarr;
        </Link>
      </div>
    </section>
  );
}
