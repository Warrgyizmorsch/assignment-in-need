import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Assignment Help by Subject UK | 150+ Subjects",
  description: "Find expert assignment help across 150+ subjects, including business, law, nursing, accounting, finance, marketing, IT and more.",
  canonicalUrl: "/subjects",
});

export default function SubjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
