import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Assignment Services UK | Expert Academic Support",
  description: "Explore assignment services including essays, reports, coursework, case studies, dissertations, proofreading and academic support from subject experts.",
  canonicalUrl: "/service",
});

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
