import type { Metadata } from "next";
import ServicePageClient from "./ServicePageClient";
import { constructMetadata } from "@/lib/metadata";
import { mapExpertToWriter } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string[] }>;
};

async function fetchServiceData(fullSlug: string) {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
  
  let pageResult: any = null;

  try {
    const pageRes0 = await fetch(`${baseUrl}/api/service-pages/service/${fullSlug}`, { cache: "no-store" });
    if (pageRes0.ok) {
      const temp = await pageRes0.json();
      if (temp && temp.success && temp.data && temp.data.page) {
        pageResult = temp;
      }
    }
  } catch (e) { }

  if (!pageResult) {
    try {
      const pageResSub = await fetch(`${baseUrl}/api/service-pages/subject/${fullSlug}`, { cache: "no-store" });
      if (pageResSub.ok) {
        const temp = await pageResSub.json();
        if (temp && temp.success && temp.data && temp.data.page) {
          pageResult = temp;
        }
      }
    } catch (e) { }
  }

  let apiSlug = fullSlug;
  if (fullSlug === "assignment-writing-uk" || fullSlug === "service/assignment") { apiSlug = "assignment"; }
  else if (fullSlug === "dissertation-writing-services" || fullSlug === "service/dissertation") { apiSlug = "dissertation"; }
  else if (fullSlug.startsWith("service/assignment/")) { apiSlug = fullSlug.replace("service/assignment/", ""); }
  else if (fullSlug.startsWith("service/dissertation/")) { apiSlug = fullSlug.replace("service/dissertation/", ""); }
  else if (fullSlug.endsWith("-assignment-writing-help")) { apiSlug = fullSlug.replace("-assignment-writing-help", ""); }
  else if (fullSlug.endsWith("-dissertation-writing-help")) { apiSlug = fullSlug.replace("-dissertation-writing-help", ""); }
  else if (fullSlug.includes("/")) { apiSlug = fullSlug.split("/").pop() || fullSlug; }

  if (!pageResult) {
    try {
      const pageRes = await fetch(`${baseUrl}/api/service-pages/${apiSlug}`, { cache: "no-store" });
      if (pageRes.ok) {
        const temp = await pageRes.json();
        if (temp && temp.success && temp.data && temp.data.page) {
          pageResult = temp;
        }
      }
    } catch (e) { }
  }

  if (!pageResult) {
    try {
      const pageRes2 = await fetch(`${baseUrl}/api/service-pages/${fullSlug}`, { cache: "no-store" });
      if (pageRes2.ok) {
        const temp = await pageRes2.json();
        if (temp && temp.success && temp.data && temp.data.page) {
          pageResult = temp;
        }
      }
    } catch (e) { }
  }

  if (!pageResult) {
    try {
      const pageRes3 = await fetch(`${baseUrl}/api/service-pages/${fullSlug.replace(/\//g, "-")}`, { cache: "no-store" });
      if (pageRes3.ok) {
        const temp = await pageRes3.json();
        if (temp && temp.success && temp.data && temp.data.page) {
          pageResult = temp;
        }
      }
    } catch (e) { }
  }

  let allServicePages: any[] = [];
  if (!pageResult) {
    try {
      const listRes = await fetch(`${baseUrl}/api/service-pages`, { cache: "no-store" });
      if (listRes.ok) {
        const listResult = await listRes.json();
        if (listResult.status === "success" && Array.isArray(listResult.data)) {
          const flatPages: any[] = [];
          const extractPages = (arr: any[]) => {
            arr.forEach((item) => {
              flatPages.push(item);
              if (Array.isArray(item.children)) {
                extractPages(item.children);
              }
            });
          };
          extractPages(listResult.data);
          allServicePages = flatPages;
        }
      }
    } catch (e) {}
  }

  return {
    pageResult,
    allServicePages
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const fullSlug = resolvedParams.slug.join("/");

  try {
    const { pageResult } = await fetchServiceData(fullSlug);
    if (pageResult) {
      const pageData = pageResult.data?.page;
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

export default async function ServicePage({ params }: Props) {
  const resolvedParams = await params;
  const fullSlug = resolvedParams.slug.join("/");
  
  const { pageResult, allServicePages } = await fetchServiceData(fullSlug);
  
  let initialPageData = null;
  let initialExperts: any[] = [];
  let initialExpertsFromPage = false;
  let initialReviews: any[] = [];

  const mapReviewToTestimonial = (review: any) => ({
    name: review?.name || "Verified Student",
    institution: [review?.location, review?.services_type].filter(Boolean).join(" • ") || "Verified Student",
    quote: review?.description || "",
    rating: Number.parseFloat(review?.customer_rating) || 5,
    avatar: review?.name?.charAt(0) || "S",
  });

  if (pageResult && pageResult.success && pageResult.data && pageResult.data.page) {
    initialPageData = pageResult.data.page;

    if (Array.isArray(pageResult.data.experts) && pageResult.data.experts.length > 0) {
      initialExperts = pageResult.data.experts.map((item: any) => mapExpertToWriter(item));
      initialExpertsFromPage = true;
    }

    if (Array.isArray(pageResult.data.reviews)) {
      initialReviews = pageResult.data.reviews.map(mapReviewToTestimonial);
    }
  }

  return (
    <ServicePageClient 
      initialSlug={fullSlug}
      initialPageData={initialPageData}
      initialExperts={initialExperts}
      initialExpertsFromPage={initialExpertsFromPage}
      initialReviews={initialReviews}
      initialAllServicePages={allServicePages}
    />
  );
}
