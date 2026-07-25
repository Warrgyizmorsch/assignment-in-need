import React from "react";
import type { Metadata } from "next";
import CityDetailPage from "@/components/city/CityDetailPage";
import { constructMetadata } from "@/lib/metadata";

interface CityRoutePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CITIES_LIST = [
  { name: "London", slug: "london", country: "United Kingdom" },
  { name: "Birmingham", slug: "birmingham", country: "United Kingdom" },
  { name: "Manchester", slug: "manchester", country: "United Kingdom" },
  { name: "Leeds", slug: "leeds", country: "United Kingdom" },
  { name: "Glasgow", slug: "glasgow", country: "United Kingdom" },
  { name: "Edinburgh", slug: "edinburgh", country: "United Kingdom" },
  { name: "Bristol", slug: "bristol", country: "United Kingdom" },
  { name: "Liverpool", slug: "liverpool", country: "United Kingdom" },
  { name: "Sydney", slug: "sydney", country: "Australia" },
  { name: "Melbourne", slug: "melbourne", country: "Australia" },
  { name: "Brisbane", slug: "brisbane", country: "Australia" },
  { name: "Perth", slug: "perth", country: "Australia" },
  { name: "Adelaide", slug: "adelaide", country: "Australia" },
  { name: "Canberra", slug: "canberra", country: "Australia" },
  { name: "Toronto", slug: "toronto", country: "Canada" },
  { name: "Vancouver", slug: "vancouver", country: "Canada" },
  { name: "Montreal", slug: "montreal", country: "Canada" },
  { name: "Ottawa", slug: "ottawa", country: "Canada" },
  { name: "Dubai", slug: "dubai", country: "United Arab Emirates" },
  { name: "Abu Dhabi", slug: "abu-dhabi", country: "United Arab Emirates" },
  { name: "Sharjah", slug: "sharjah", country: "United Arab Emirates" },
  { name: "Kuala Lumpur", slug: "kuala-lumpur", country: "Malaysia" },
  { name: "Penang", slug: "penang", country: "Malaysia" },
];

export async function generateMetadata({ params }: CityRoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  let cityName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let countryName = "Global";

  const staticCity = CITIES_LIST.find((c) => c.slug === slug);
  if (staticCity) {
    cityName = staticCity.name;
    countryName = staticCity.country;
  }

  try {
    if (baseUrl) {
      const res = await fetch(`${baseUrl}/api/city-pages/${slug}`);
      if (res.ok) {
        const json = await res.json();
        const pageData = json?.data?.page;

        if (pageData && (pageData.meta_title || pageData.title || pageData.hero_heading)) {
          const title = pageData.meta_title || pageData.title || pageData.hero_heading;
          const description = pageData.meta_description || 
            (pageData.hero_content ? pageData.hero_content.replace(/<[^>]*>/g, "").slice(0, 160) : "") ||
            `Need assignment help in ${cityName}? Get top-rated academic writing support from expert writers in ${cityName}, ${countryName}. 100% plagiarism free & on-time.`;
            
          return constructMetadata({
            title,
            description,
            canonicalUrl: `/cities/${slug}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata for city page:", error);
  }

  // Fallback
  return constructMetadata({
    title: `${cityName} Assignment Help UK | Top Experts in ${cityName}`,
    description: `Need assignment help in ${cityName}? Get top-rated academic writing support from expert writers in ${cityName}, ${countryName}. 100% plagiarism free & on-time.`,
    canonicalUrl: `/cities/${slug}`,
  });
}

export default async function CityRoutePage({ params }: CityRoutePageProps) {
  const resolvedParams = await params;
  return (
    <CityDetailPage key={resolvedParams.slug} slug={resolvedParams.slug} />
  );
}
