import { NextResponse } from "next/server";
import { fetchCityPages, toSitemapXml, getSitemapBaseUrl } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = getSitemapBaseUrl();

  const cityRoutes = await fetchCityPages(baseUrl);

  const urls = cityRoutes.map((cityUrl: string) => ({
    loc: cityUrl,
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
