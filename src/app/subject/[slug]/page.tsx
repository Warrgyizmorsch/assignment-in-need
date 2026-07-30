import type { Metadata } from "next";
import SubjectPageClient from "./SubjectPageClient";
import { constructMetadata } from "@/lib/metadata";
import { SUBJECTS } from "@/lib/data";
import {
  canonicalSubjectPath,
  canonicalSubjectSlug,
  subjectDataSlug,
} from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  try {
    if (baseUrl) {
      const cleanSlug = subjectDataSlug(slug);

      const endpoints = [
        `/api/subject-pages/${slug}`,
        `/api/subject-pages/subject/${slug}`,
        `/api/subject-pages/subject/${cleanSlug}`,
        `/api/subject-pages/${cleanSlug}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(`${baseUrl}${endpoint}`);
          if (res.ok) {
            const json = await res.json();
            const pageData = json?.data?.page;

            if (pageData && (pageData.meta_title || pageData.hero_heading)) {
              const title = pageData.meta_title || pageData.hero_heading;
              const description = pageData.meta_description || 
                (pageData.hero_content ? pageData.hero_content.replace(/<[^>]*>/g, "").slice(0, 160) : "");
                
              return constructMetadata({
                title,
                description,
                canonicalUrl: canonicalSubjectPath(slug),
              });
            }
          }
        } catch (e) {}
      }
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

async function getFreshSubjectPage(slug: string) {
  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://ain.warrgyizmorsch.com";
  const candidateSlugs = Array.from(
    new Set([canonicalSubjectSlug(slug), subjectDataSlug(slug)]),
  );

  for (const candidateSlug of candidateSlugs) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(
        `${backendUrl}/api/subject-pages/subject/${encodeURIComponent(candidateSlug)}?_fresh=${Date.now()}-${attempt}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store",
            Pragma: "no-cache",
          },
          signal: AbortSignal.timeout(12000),
        },
      ).catch(() => null);

      if (response?.ok) {
        const result = await response.json().catch(() => null);
        const page = result?.data?.page || result?.data || result?.page;
        if (page && typeof page === "object" && !Array.isArray(page)) return page;
      }
    }
  }

  return null;
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const initialPageData = await getFreshSubjectPage(slug);
  return (
    <SubjectPageClient
      key={canonicalSubjectPath(slug)}
      initialPageData={initialPageData}
    />
  );
}
