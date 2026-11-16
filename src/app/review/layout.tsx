import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Assignment Help Reviews UK | Assignment In Need",
  description: "Read genuine student reviews of Assignment In Need. See feedback on assignment help, writing quality, support, delivery and overall service experience.",
  canonicalUrl: "/review",
});

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
