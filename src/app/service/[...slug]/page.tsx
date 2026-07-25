import type { Metadata } from "next";
import ServicePageClient from "./ServicePageClient";
import { constructMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const fullSlug = resolvedParams.slug.join("/");
  
  try {
    const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
    if (baseUrl) {
      // First try the specific slug endpoint
      let res = await fetch(`${baseUrl}/api/service-pages/service/${fullSlug}`);
      if (!res.ok) {
        // Fallback endpoint checks
        res = await fetch(`${baseUrl}/api/service-pages/${fullSlug}`);
      }
      
      if (res.ok) {
        const json = await res.json();
        const pageData = json?.data?.page;
        
        if (pageData && (pageData.meta_title || pageData.title || pageData.hero_heading)) {
          const title = pageData.meta_title || pageData.title || pageData.hero_heading;
          const description = pageData.meta_description || 
            (pageData.hero_content ? pageData.hero_content.replace(/<[^>]*>/g, "").slice(0, 160) : "");
            
          return constructMetadata({
            title,
            description,
            canonicalUrl: `/service/${fullSlug}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata for service page:", error);
  }

  // Fallback if API fails or no meta found
  const fallbackTitle = fullSlug.split("/").pop() || "Service";
  const formattedTitle = fallbackTitle.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  return constructMetadata({
    title: `${formattedTitle} | Assignment In Need`,
    canonicalUrl: `/service/${fullSlug}`,
  });
}

export default function ServicePage() {
  return <ServicePageClient />;
}
