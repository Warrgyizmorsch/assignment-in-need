import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Assignment Help Pricing UK | Get a Free Quote",
  description: "Get transparent pricing for assignment help tailored to your subject, academic level, word count and deadline. Request a free quote from Assignment In Need.",
  canonicalUrl: "/pricing",
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
