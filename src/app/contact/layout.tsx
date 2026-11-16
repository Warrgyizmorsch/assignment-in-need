import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Contact Assignment In Need | UK Academic Support",
  description: "Contact Assignment In Need for assignment help, order support, pricing enquiries and general questions. Our UK support team is available to assist you.",
  canonicalUrl: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
