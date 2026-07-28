import { NextResponse } from "next/server";
import { getSitemapBaseUrl } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = getSitemapBaseUrl();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <sitemap>
      <loc>${baseUrl}/page-sitemap.xml</loc>
   </sitemap>
   <sitemap>
      <loc>${baseUrl}/blog.sitemap.xml</loc>
   </sitemap>
   <sitemap>
      <loc>${baseUrl}/samples-sitemap.xml</loc>
   </sitemap>
   <sitemap>
      <loc>${baseUrl}/citypage-sitemap.xml</loc>
   </sitemap>
   <sitemap>
      <loc>${baseUrl}/writer.sitemap.xml</loc>
   </sitemap>
   <sitemap>
      <loc>${baseUrl}/other-sitemap.xml</loc>
   </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
