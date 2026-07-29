import React from "react";
import type { Metadata } from "next";
import CityDetailPage from "@/components/city/CityDetailPage";
import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CityRoutePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CityRoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const cityDataSlug = slug.replace(/^assignment-help-/, "").replace(/-assignment-help$/, "");
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";

  let cityName = cityDataSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let countryName = "United Kingdom";

  try {
    let res = await fetch(`${baseUrl}/api/city-pages/${cityDataSlug}`, {
      cache: "no-store"
    });
    if (!res.ok && slug !== cityDataSlug) {
      res = await fetch(`${baseUrl}/api/city-pages/${slug}`, {
        cache: "no-store"
      });
    }
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
