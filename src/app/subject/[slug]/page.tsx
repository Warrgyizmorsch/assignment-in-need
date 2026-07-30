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
  return (
    <SubjectPageClient
      key={canonicalSubjectPath(slug)}
      initialPageData={initialData?.page || null}
      initialExperts={initialData?.experts || []}
      initialReviews={initialData?.reviews || []}
    />
  );
}
