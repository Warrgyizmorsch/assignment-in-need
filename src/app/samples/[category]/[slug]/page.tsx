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
  return <SampleDetailPageClient params={params} />;
}
