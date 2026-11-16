import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy | Assignment In Need UK",
  description: "Learn how Assignment In Need collects, uses, protects and manages your personal information when you use our website and academic support services.",
  canonicalUrl: "/privacy-policy",
});

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
