import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Academic Blogs & Study Guides | Assignment In Need",
  description:
    "Read our latest academic writing guides, study tips, assignment advice, and university dissertation insights.",
  openGraph: {
    title: "Academic Blogs & Study Guides | Assignment In Need",
    description:
      "Read our latest academic writing guides, study tips, assignment advice, and university dissertation insights.",
  },
  twitter: {
    title: "Academic Blogs & Study Guides | Assignment In Need",
    description:
      "Read our latest academic writing guides, study tips, assignment advice, and university dissertation insights.",
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
