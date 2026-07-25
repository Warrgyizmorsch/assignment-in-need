import type { Metadata } from "next";
import SamplesPageClient from "./SamplesPageClient";

export const metadata: Metadata = {
  title: "Free Assignment Samples & Academic Essays | Assignment In Need",
  description:
    "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  openGraph: {
    title: "Free Assignment Samples & Academic Essays | Assignment In Need",
    description:
      "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  },
  twitter: {
    title: "Free Assignment Samples & Academic Essays | Assignment In Need",
    description:
      "Browse our free collection of high-quality university assignment samples, essays, case studies, and dissertations.",
  },
};

export default function SamplesPage() {
  return <SamplesPageClient />;
}
