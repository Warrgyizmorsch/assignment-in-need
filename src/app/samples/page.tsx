import type { Metadata } from "next";
import SamplesPageClient from "./SamplesPageClient";

export const metadata: Metadata = {
  title: "Free Assignment Samples & Academic Essays | Assignment In Need",
  description:
    "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  openGraph: {
    title: "Free Assignment Samples & Academic Essays | Assignment In Need",
    description:
      "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  },
  twitter: {
    title: "Free Assignment Samples & Academic Essays | Assignment In Need",
    description:
      "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchSampleCategories() {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
  
  try {
    const response = await fetch(`${baseUrl}/api/sample-categories`, { cache: "no-store" });
    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return [...json.data].sort((a, b) => (b.sample_count || 0) - (a.sample_count || 0));
      }
    }

    // Fallback to subject-pages API
    const subRes = await fetch(`${baseUrl}/api/subject-pages`, { cache: "no-store" });
    if (subRes.ok) {
      const subJson = await subRes.json();
      if ((subJson.success || subJson.status === "success") && Array.isArray(subJson.data)) {
        return subJson.data.map((s: any) => ({
          id: s.id,
          name: s.title || s.name || s.slug,
          sample_count: s.sample_count || 5,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to load sample categories on server:", err);
  }
  return [];
}

export default async function SamplesPage() {
  const initialCategories = await fetchSampleCategories();
  
  return <SamplesPageClient initialCategories={initialCategories} />;
}
