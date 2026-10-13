import type { Metadata } from "next";
import CitiesListClient from "./CitiesListClient";

export const metadata: Metadata = {
  title: "Assignment Help Cities | UK & Global University Locations",
  description:
    "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  openGraph: {
    title: "Assignment Help Cities | UK & Global University Locations",
    description:
      "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  },
  twitter: {
    title: "Assignment Help Cities | UK & Global University Locations",
    description:
      "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  },
};

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
