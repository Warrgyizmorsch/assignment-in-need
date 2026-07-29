import type { Metadata } from "next";
import WriterProfileClient from "./WriterProfileClient";
import { constructMetadata } from "@/lib/metadata";
import { WRITERS } from "@/lib/data";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";

  try {
    if (baseUrl) {
      const res = await fetch(`${baseUrl}/api/experts/${id}`);
      if (res.ok) {
        const json = await res.json();
        const expert = json?.data;

        if (expert) {
          const name = expert.name || expert.expert_name;
          const role = expert.role || "Expert Academic Writer";
          const title = expert.meta_tag || expert.meta_title || `${name} - ${role} | Assignment In Need`;
          const description = expert.meta_description || 
            (expert.about && expert.about[0] ? expert.about[0].slice(0, 160) : "") ||
            `${name} is a ${expert.qualifications || ""} ${role} with ${expert.experience || "years of"} experience. Hire top academic writers at Assignment In Need.`;
            
          return constructMetadata({
            title,
            description,
            canonicalUrl: `/writers/${id}`,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata for writer page:", error);
  }

  // Fallback to static WRITERS list with clean slug comparison
  const cleanSlug = (str: string) =>
    str
      ?.toLowerCase()
      ?.replace(/^dr\.?\s*/i, "")
      ?.replace(/^prof\.?\s*/i, "")
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || "";

  const targetClean = cleanSlug(id);

  const staticWriter = WRITERS.find((w) => {
    if (w.id === id || w.id.toLowerCase() === id?.toLowerCase()) return true;
    const wIdClean = cleanSlug(w.id);
    const wNameClean = cleanSlug(w.name);
    return wIdClean === targetClean || wNameClean === targetClean;
  });

  if (staticWriter) {
    return constructMetadata({
      title: `${staticWriter.name} - ${staticWriter.role} | Assignment In Need`,
      description: `${staticWriter.name} is a ${staticWriter.qualifications} ${staticWriter.role} with ${staticWriter.experience} experience. Hire top academic writers at Assignment In Need.`,
      canonicalUrl: `/writers/${id}`,
    });
  }

  // Final fallback
  return constructMetadata({
    title: `Expert Academic Writer | Assignment In Need`,
    canonicalUrl: `/writers/${id}`,
  });
}

export default function WriterProfilePage() {
  return <WriterProfileClient />;
}
