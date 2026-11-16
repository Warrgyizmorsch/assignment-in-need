import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About Assignment in Need | UK Academic Support",
  description:
    "Learn how Assignment in Need supports UK students with structured, compliant academic assistance built around university standards and academic integrity.",
  canonicalUrl: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
