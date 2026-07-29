import { NextResponse } from "next/server";
import { fetchBlogs, toSitemapXml, getSitemapBaseUrl } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = getSitemapBaseUrl();

  const blogs = await fetchBlogs(baseUrl);

  const urls = blogs.map((blogUrl: string) => ({
    loc: blogUrl,
    priority: "0.9",
  }));

  const xml = toSitemapXml(urls);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
