import type { Metadata } from "next";
import SampleDetailPageClient from "./SampleDetailPageClient";
import { constructMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  try {
    if (baseUrl) {
      const res = await fetch(`${baseUrl}/api/samples/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        const sample = json?.data;

        if (sample) {
          const title = sample.meta_title || sample.title || `${sample.title || "Sample Paper"} | Assignment In Need`;
          const description = sample.meta_description ||
            (sample.description ? sample.description.replace(/<[^>]*>/g, "").slice(0, 160) : "") ||
            `Read free university sample paper for ${sample.title || "academic writing"}. Standard UK university example.`;

          return constructMetadata({
            title,
            description,
            canonicalUrl: `/samples/${category}/${slug}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata for sample detail page:", error);
  }

  // Fallback
  const formattedSlug = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return constructMetadata({
    title: `${formattedSlug} | Assignment In Need`,
    canonicalUrl: `/samples/${category}/${slug}`,
  });
}

export default function SampleDetailPage({ params }: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "H1",
  "description": "Professional assignment writing help and academic assistance for students in the UK. Expert support for essays, coursework, and dissertations.",
  "image": "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
  "brand": {
    "@type": "Brand",
    "name": "Assignment In Need"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.96",
    "ratingCount": "46799"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "GBP",
    "lowPrice": "4.00",
    "highPrice": "10.00",
    "offerCount": "7"
  }
}`
        }}
      />
      <SampleDetailPageClient params={params} />
    </>
  );
}
