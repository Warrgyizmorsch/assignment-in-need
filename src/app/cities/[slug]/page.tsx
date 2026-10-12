import React from "react";
import type { Metadata } from "next";
import CityDetailPage from "@/components/city/CityDetailPage";
import { constructMetadata } from "@/lib/metadata";
import { getFreshCityPage } from "@/lib/content-pages";

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
  let cityName = cityDataSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let countryName = "United Kingdom";

  try {
    const pageData = (await getFreshCityPage(slug))?.page;
    if (pageData && (pageData.meta_title || pageData.title || pageData.hero_heading)) {
      cityName = pageData.city || cityName;
      countryName = pageData.country || countryName;
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
  const initialData = await getFreshCityPage(resolvedParams.slug);

  const pageData = initialData?.page;
  const cityDataSlug = resolvedParams.slug.replace(/^assignment-help-/, "").replace(/-assignment-help$/, "");
  let cityName = cityDataSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  if (pageData?.city) cityName = pageData.city;
  const cityPageName = pageData?.hero_heading || pageData?.title || (pageData?.city ? `${pageData.city} Assignment Help` : `${cityName} Assignment Help`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.assignmentinneed.co.uk/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Cities",
      "item": "https://www.assignmentinneed.co.uk/cities"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": ${JSON.stringify(cityPageName)},
      "item": "https://www.assignmentinneed.co.uk/cities/${resolvedParams.slug}"
    }
  ]
}`
        }}
      />
      <CityDetailPage
        key={resolvedParams.slug}
        slug={resolvedParams.slug}
        initialPageData={initialData?.page || null}
        initialExperts={initialData?.experts || []}
      />
    </>
  );
}
