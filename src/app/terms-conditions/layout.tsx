import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Terms & Conditions | Assignment In Need UK",
  description: "Read the terms and conditions governing the use of Assignment In Need, including services, payments, revisions, refunds and user responsibilities.",
  canonicalUrl: "/terms-conditions",
});

export default function TermsConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
