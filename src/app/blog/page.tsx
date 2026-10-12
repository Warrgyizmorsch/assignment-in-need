import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";
import { getBaseUrl } from "@/lib/api";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchInitialBlogs() {
  const baseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://ain.warrgyizmorsch.com";
  try {
    const res = await fetch(`${baseUrl}/api/blogs?page=1&limit=9`, { cache: "no-store" });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return {
          blogs: result.data.data || [],
          currentPage: result.data.current_page || 1,
          lastPage: result.data.last_page || 1,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching initial blogs:", error);
  }
  return { blogs: [], currentPage: 1, lastPage: 1 };
}

export default async function BlogPage() {
  const { blogs, currentPage, lastPage } = await fetchInitialBlogs();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.assignmentinneed.co.uk/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.assignmentinneed.co.uk/blog"
    }
  ]
}`
        }}
      />
      <BlogListClient 
        initialBlogs={blogs} 
        initialCurrentPage={currentPage} 
        initialLastPage={lastPage} 
      />
    </>
  );
}
