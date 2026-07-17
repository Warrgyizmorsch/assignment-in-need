"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SAMPLES } from "@/lib/data";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";

interface HomeSample {
  id: string;
  title: string;
  subject: string;
  image: string;
  href: string;
  type: string;
}

type ApiRecord = Record<string, unknown>;

const FALLBACK_IMAGES = [
  "/new-home-page-images/Business-Report.webp",
  "/new-home-page-images/Essay-Writing.webp",
  "/new-home-page-images/Law-Case-Study.webp",
  "/new-home-page-images/Report-Writing.webp",
  "/new-home-page-images/Case-Study-Help.webp",
  "/new-home-page-images/Reseacrh-Proposal.webp",
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isApiRecord = (value: unknown): value is ApiRecord =>
  value !== null && typeof value === "object";

const asString = (value: unknown) =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";

const fallbackSamples: HomeSample[] = SAMPLES.map((sample, index) => ({
  id: `${sample.title}-${index}`,
  title: sample.title,
  subject: sample.subject,
  image: sample.image,
  href: sample.href,
  type: "PDF",
}));

const mapSample = (sample: ApiRecord, index: number): HomeSample => {
  const category =
    asString(sample.category_slug) ||
    asString(sample.category) ||
    asString(sample.category_name) ||
    asString(sample.subject) ||
    asString(sample.type_name) ||
    "";
  const sampleSlug = asString(sample.slug);
  const title =
    asString(sample.title) ||
    asString(sample.meta_title) ||
    "Assignment Sample";
  const categorySlug = slugify(category);
  const href =
    sampleSlug && categorySlug
      ? `/samples/${categorySlug}/${sampleSlug}`
      : "/samples";

  return {
    id: asString(sample.id) || sampleSlug || `${title}-${index}`,
    title,
    subject:
      asString(sample.type_name) ||
      asString(sample.category_name) ||
      asString(sample.category) ||
      "Assignment",
    image:
      asString(sample.image) ||
      asString(sample.thumbnail) ||
      FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    href,
    type: asString(sample.file_type) || asString(sample.type) || "PDF",
  };
};

function SampleCard({ sample, index }: { sample: HomeSample; index: number }) {
  const [imgSrc, setImgSrc] = useState(sample.image);

  useEffect(() => {
    setImgSrc(sample.image);
  }, [sample.image]);

  return (
    <Link
      href={sample.href}
      className="group bg-white rounded-2xl flex flex-col w-[220px] max-md:w-[120px] shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:-translate-y-1.25 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] overflow-hidden max-md:rounded-xl"
    >
      <div className="w-full h-[130px] max-md:h-[80px] bg-gray-100 overflow-hidden relative">
        <Image
          src={imgSrc}
          alt={sample.title}
          fill
          sizes="(max-width: 768px) 120px, 220px"
          className="object-cover transition-transform duration-500 group-hover:scale-108"
          onError={() => {
            setImgSrc(FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]);
          }}
        />
      </div>
      <div className="p-4 max-md:p-2 relative flex flex-col gap-1 text-left">
        <p className="m-0 text-[0.95rem] max-md:text-[0.65rem] font-bold text-gray-900 max-md:leading-tight line-clamp-2">
          {sample.title}
        </p>
        <span className="text-[0.75rem] max-md:text-[0.55rem] text-gray-500 font-medium line-clamp-1">
          {sample.subject}
        </span>
        <div className="absolute bottom-4 right-4 max-md:bottom-2 max-md:right-2 bg-[#7c3aed] text-white text-[0.65rem] max-md:text-[0.5rem] font-extrabold py-1 px-2.5 max-md:py-0.5 max-md:px-1.5 rounded-[6px] tracking-wider">
          {sample.type}
        </div>
      </div>
    </Link>
  );
}

export default function AssignmentSamples() {
  const trackWrapperRef = useRef<HTMLDivElement>(null);
  const [samples, setSamples] = useState<HomeSample[]>(fallbackSamples);

  const slideSamples = useCallback((direction: number) => {
    const wrapper = trackWrapperRef.current;
    if (!wrapper) return;

    const card = wrapper.querySelector(".group") as HTMLElement;
    const cardWidth = card ? card.offsetWidth : 220;
    const gap = window.innerWidth <= 768 ? 8 : 20;
    const scrollAmount = (cardWidth + gap) * direction;

    if (
      direction === 1 &&
      wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10
    ) {
      wrapper.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("/api/samples?limit=6");
        if (!response.ok) {
          console.error("Failed to load homepage samples");
          return;
        }

        const json = await response.json();
        const list = json?.data?.data ?? json?.data ?? json?.samples ?? [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.filter(isApiRecord).slice(0, 6).map(mapSample);
          setSamples(mapped);
        }
      } catch (err) {
        console.error("Error fetching homepage samples:", err);
      }
    };

    fetchSamples();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      slideSamples(1);
    }, 4000);

    return () => clearInterval(interval);
  }, [slideSamples]);

  return (
    <section className="py-8 md:py-10 px-8 max-md:py-4 max-md:px-4 bg-[#fafaff] font-sans flex justify-center overflow-hidden border-b border-[#f3e8ff]/50">
      <div className="max-w-[1200px] w-full flex items-center gap-10 max-lg:flex-col max-lg:items-start max-lg:gap-6">
        <AnimateIn variant="fadeUp" className="w-[260px] max-lg:w-full shrink-0 flex flex-col gap-4 max-lg:flex-row max-lg:items-center max-lg:justify-between max-md:flex-col max-md:items-start">
          <h2 className="text-2xl md:text-[1.8rem] font-extrabold text-[#1e1b4b] m-0 leading-tight max-md:text-[1.4rem] text-left">
            Assignment{" "}
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis">
              Samples
            </span>
          </h2>
          <p className="text-[0.95rem] text-gray-600 m-0 leading-relaxed max-lg:hidden max-md:block max-md:text-[0.85rem] text-left">
            High-quality work samples to get an idea of our writing quality.
          </p>
          <Link
            href="/samples"
            className="hidden md:block btn-shutter-blue-open text-white font-semibold text-[0.9rem] py-3 px-5 rounded-lg text-center w-max transition-all duration-300 mt-2"
          >
            View All Samples
          </Link>
        </AnimateIn>

        <div className="flex-1 relative flex items-center gap-4 min-w-0 max-md:w-full">
          <div
            className="w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] py-4 [mask-image:linear-gradient(to_right,black_85%,transparent)] max-md:mask-none max-md:py-2"
            id="znh-samplesTrackWrapper"
            ref={trackWrapperRef}
          >
            <StaggerContainer className="flex gap-5 w-max max-md:gap-2">
              {samples.map((sample, index) => (
                <StaggerItem key={sample.id}>
                  <SampleCard sample={sample} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <button
            className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.05)] cursor-pointer text-gray-400 items-center justify-center w-[45px] h-[45px] rounded-full transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shrink-0 z-[2]"
            onClick={() => slideSamples(-1)}
            aria-label="Previous samples"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-[18px] h-[18px]"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="hidden md:flex bg-white border border-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.05)] cursor-pointer text-gray-400 items-center justify-center w-[45px] h-[45px] rounded-full transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shrink-0 z-[2]"
            onClick={() => slideSamples(1)}
            aria-label="Next samples"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-[18px] h-[18px]"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <Link
          href="/samples"
          className="flex md:hidden justify-center items-center w-full p-3 mt-2.5 bg-white border border-gray-200 rounded-lg text-[#7c3aed] hover:text-[#6d28d9] hover:bg-gray-50 font-semibold text-[0.8rem] transition-all duration-300"
        >
          View All Samples &rarr;
        </Link>
      </div>
    </section>
  );
}
