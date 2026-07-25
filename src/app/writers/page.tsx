import type { Metadata } from "next";
import WritersListClient from "./WritersListClient";

export const metadata: Metadata = {
  title: "Our Expert Academic Writers & Tutors | Assignment In Need",
  description:
    "Meet our PhD and Master's qualified academic writers. Hire trusted UK experts for your assignments, essays, reports, and dissertations.",
  openGraph: {
    title: "Our Expert Academic Writers & Tutors | Assignment In Need",
    description:
      "Meet our PhD and Master's qualified academic writers. Hire trusted UK experts for your assignments, essays, reports, and dissertations.",
  },
  twitter: {
    title: "Our Expert Academic Writers & Tutors | Assignment In Need",
    description:
      "Meet our PhD and Master's qualified academic writers. Hire trusted UK experts for your assignments, essays, reports, and dissertations.",
  },
};

export default function WritersPage() {
  return <WritersListClient />;
}
