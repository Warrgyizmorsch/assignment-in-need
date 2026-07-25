import type { Metadata } from "next";
import SubjectPageClient from "./SubjectPageClient";
import { constructMetadata } from "@/lib/metadata";
import { SUBJECTS } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  try {
    if (baseUrl) {
      let cleanSlug = slug.toLowerCase().replace("-assignment-writing-help", "").replace("-assignment-help", "").replace("-help", "").trim();
      if (cleanSlug === "math") cleanSlug = "maths";

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
                canonicalUrl: `/subject/${slug}`,
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
  let subjectName = slug;
  const subject = SUBJECTS.find(s => s.slug === slug || s.slug === slug.replace("-assignment-help", ""));
  if (subject) {
    subjectName = subject.name;
  } else {
    subjectName = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  return constructMetadata({
    title: `${subjectName} Assignment Help | Expert Specialists`,
    description: `Get expert ${subjectName} assignment help from qualified UK academic writers. 100% original, plagiarism-free, on-time delivery.`,
    canonicalUrl: `/subject/${slug}`,
  });
}

export default function SubjectPage() {
  return <SubjectPageClient />;
}
