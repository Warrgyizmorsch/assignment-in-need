import type { Metadata } from "next";
import SampleCategoryClient from "./SampleCategoryClient";
import { constructMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const formattedName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return constructMetadata({
    title: `${formattedName} Assignment Samples & Papers | Assignment In Need`,
    description: `Explore free ${formattedName} assignment samples, essays, case studies, and university research papers.`,
    canonicalUrl: `/samples/${category}`,
  });
}

export default function SampleCategoryPage({ params }: Props) {
  return <SampleCategoryClient params={params} />;
}
