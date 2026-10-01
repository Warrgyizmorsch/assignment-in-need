import type { Metadata } from "next";
import SampleCategoryClient from "./SampleCategoryClient";
import { constructMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const formattedName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return constructMetadata({
    title: `${formattedName} Assignment Samples & Papers | Assignment In Need`,
    description: `Explore free ${formattedName} assignment samples, essays, case studies, and university research papers.`,
    canonicalUrl: `/samples/${category}`,
  });
}

export default function SampleCategoryPage({ params }: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
    "@context": "https://schema.org/",
    "@type": "product",
    "name": "Assignment writing help UK",
    "image": "https://assignmentinneed.co.uk/assets/media/layout/ain-logo.webp",
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
      <SampleCategoryClient params={params} />
    </>
  );
}
