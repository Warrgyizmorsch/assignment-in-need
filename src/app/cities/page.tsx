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
    }
  ]
}`
        }}
      />
      <CitiesListClient />
    </>
  );
}
