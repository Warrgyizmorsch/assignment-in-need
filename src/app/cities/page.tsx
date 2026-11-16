import type { Metadata } from "next";
import CitiesListClient from "./CitiesListClient";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Assignment Help Cities | UK & Global University Locations",
  description:
    "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  canonicalUrl: "/cities",
});

export default function CitiesPage() {
  const heading = "We Support Students in 100+ Cities Globally";
  const description =
    "Get localized assignment help across top university cities in the UK, Australia, and worldwide.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": ${JSON.stringify(heading)},
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
      "name": "Cities",
      "item": "https://www.assignmentinneed.co.uk/cities"
    }
  ]
}`
        }}
      />
      <CitiesListClient />
    </>
  );
}
