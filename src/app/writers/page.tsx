import type { Metadata } from "next";
import WritersListClient from "./WritersListClient";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Our Expert Academic Writers & Tutors | Assignment In Need",
  description:
    "Meet our PhD and Master's qualified academic writers. Hire trusted UK experts for your assignments, essays, reports, and dissertations.",
  canonicalUrl: "/writers",
});

export default function WritersPage() {
  return <WritersListClient />;
}
