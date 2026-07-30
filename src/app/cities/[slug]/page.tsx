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
    const endpointsToTry = Array.from(
      new Set([
        slug,
        `assignment-help-${cityDataSlug}`,
        cityDataSlug,
        `uk/assignment-help-${cityDataSlug}`,
      ]),
    ).filter(Boolean);

    let res: Response | null = null;
    for (const ep of endpointsToTry) {
      try {
        const fetchRes = await fetch(`${baseUrl}/api/city-pages/${ep}`, {
          cache: "no-store",
        });
        if (fetchRes.ok) {
          res = fetchRes;
          break;
        }
      } catch (e) {}
    }

    if (res && res.ok) {
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

async function getFreshCityPage(slug: string) {
  const backendUrl = "https://ain.warrgyizmorsch.com";
  const citySlug = slug
    .toLowerCase()
    .replace(/^assignment-help-/, "")
    .replace(/-assignment-help$/, "")
    .replace(/-assignment-writing-help$/, "");

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(
      `${backendUrl}/api/city-pages/cities/assignment-help-${encodeURIComponent(citySlug)}?_fresh=${Date.now()}-${attempt}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache, no-store",
          Pragma: "no-cache",
        },
        signal: AbortSignal.timeout(12000),
      },
    ).catch(() => null);

    if (response?.ok) {
      const result = await response.json().catch(() => null);
      const page = result?.data?.page || result?.data || result?.page;
      if (page && typeof page === "object" && !Array.isArray(page)) {
        return {
          page,
          experts: Array.isArray(result?.data?.experts)
            ? result.data.experts
            : [],
        };
      }
    }
  }

  return null;
}

export default async function CityRoutePage({ params }: CityRoutePageProps) {
  const resolvedParams = await params;
  const initialData = await getFreshCityPage(resolvedParams.slug);
  return (
    <CityDetailPage
      key={resolvedParams.slug}
      slug={resolvedParams.slug}
      initialPageData={initialData?.page || null}
      initialExperts={initialData?.experts || []}
    />
  );
}
