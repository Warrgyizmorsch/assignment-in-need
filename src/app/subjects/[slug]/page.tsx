import type { Metadata } from "next";
import SubjectPageClient from "./SubjectPageClient";
import { constructMetadata } from "@/lib/metadata";
import { SUBJECTS } from "@/lib/data";
import {
  canonicalSubjectPath,
  subjectDataSlug,
} from "@/lib/utils";
import { getFreshSubjectPage } from "@/lib/content-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  try {
    const pageData = (await getFreshSubjectPage(slug))?.page;
    if (pageData && (pageData.meta_title || pageData.hero_heading)) {
      const title = pageData.meta_title || pageData.hero_heading;
      const description =
        pageData.meta_description ||
        (pageData.hero_content
          ? pageData.hero_content.replace(/<[^>]*>/g, "").slice(0, 160)
          : "");

      return constructMetadata({
        title,
        description,
        canonicalUrl: canonicalSubjectPath(slug),
      });
    }
  } catch (error) {
    console.error("Error generating metadata for subject page:", error);
  }

  // Fallback
  const cleanSlug = subjectDataSlug(slug);
  let subjectName = cleanSlug;
  const subject = SUBJECTS.find(s => s.slug === slug || s.slug === cleanSlug);
  if (subject) {
    subjectName = subject.name;
  } else {
    subjectName = cleanSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  return constructMetadata({
    title: `${subjectName} Assignment Help | Expert Specialists`,
    description: `Get expert ${subjectName} assignment help from qualified UK academic writers. 100% original, plagiarism-free, on-time delivery.`,
    canonicalUrl: canonicalSubjectPath(slug),
  });
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const initialData = await getFreshSubjectPage(slug);

  // Server-side samples fetch for instant loading
  let initialSamples: any[] = [];
  try {
    const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
    const cleanSlug = slug.replace(/-assignment-writing-help$/, "").replace(/-assignment-help$/, "").replace(/-assignment$/, "").replace(/-help$/, "");

    // Try fetching by slug variants in parallel
    const categoryParamsToTry = Array.from(new Set([slug, cleanSlug]));
    const fetchPromises = categoryParamsToTry.map(catParam => 
      fetch(`${BACKEND_URL}/api/samples?category=${encodeURIComponent(catParam)}&page=1&limit=100`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      }).then(res => res.ok ? res.json() : null).catch(() => null)
    );

    const results = await Promise.all(fetchPromises);
    for (const json of results) {
      const list = json?.data?.data || [];
      if (list.length > 0) { 
        initialSamples = list; 
        break; 
      }
    }
  } catch (e) {}

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
      <SubjectPageClient
        key={canonicalSubjectPath(slug)}
        initialPageData={initialData?.page || null}
        initialExperts={initialData?.experts || []}
        initialReviews={initialData?.reviews || []}
        initialSamples={initialSamples}
      />
    </>
  );
}
