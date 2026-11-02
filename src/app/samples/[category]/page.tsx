import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SampleCategoryClient from "./SampleCategoryClient";
import { constructMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ category: string }>;
};

const BASE_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // Check if single slug is actually a sample detail page
  try {
    const res = await fetch(`${BASE_URL}/api/samples/${encodeURIComponent(category)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.slug) {
        const sample = json.data;
        const catSlug = sample.category_name
          ? sample.category_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : "business";
        return constructMetadata({
          title: `${sample.meta_title || sample.title} | Assignment In Need`,
          description: sample.meta_description || "Read free academic assignment sample.",
          canonicalUrl: `/samples/${catSlug}/${sample.slug}`,
        });
      }
    }
  } catch {
    // ignore
  }

  const formattedName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return constructMetadata({
    title: `${formattedName} Assignment Samples & Papers | Assignment In Need`,
    description: `Explore free ${formattedName} assignment samples, essays, case studies, and university research papers.`,
    canonicalUrl: `/samples/${category}`,
  });
}

export default async function SampleCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // Check if this single slug is actually a sample rather than a category
  try {
    const res = await fetch(`${BASE_URL}/api/samples/${encodeURIComponent(category)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json?.data?.slug) {
        const catSlug = json.data.category_name
          ? json.data.category_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          : "business";
        redirect(`/samples/${catSlug}/${json.data.slug}`);
      }
    }
  } catch (e: any) {
    if (e?.digest?.startsWith("NEXT_REDIRECT")) throw e;
  }

  const formattedName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const description = `Explore free ${formattedName} assignment samples, essays, case studies, and university research papers.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": ${JSON.stringify(formattedName + " Assignment Samples & Papers")},
  "description": ${JSON.stringify(description)},
  "image": "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
  "brand": {
    "@type": "Brand",
    "name": "Assignment In Need"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.96",
    "reviewCount": "25507"
  },
  "offers": {
    "@type": "AggregateOffer",
    "url": "https://www.assignmentinneed.co.uk/offer",
    "priceCurrency": "GBP",
    "lowPrice": "4.00",
    "highPrice": "10.00",
    "offerCount": "2"
  }
}`
        }}
      />
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
      "name": "Samples",
      "item": "https://www.assignmentinneed.co.uk/samples"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": ${JSON.stringify(formattedName)},
      "item": "https://www.assignmentinneed.co.uk/samples/${category}"
    }
  ]
}`
        }}
      />
      <SampleCategoryClient params={params} />
    </>
  );
}
