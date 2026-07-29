import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const cleanSlug = (str: string) =>
    str
      ?.toLowerCase()
      ?.replace(/^assignment-help-/, "")
      ?.replace(/-assignment-help$/, "")
      ?.replace(/-assignment-writing-help$/, "")
      ?.trim() || "";

  const baseClean = cleanSlug(slug);
  const candidateSlugs = Array.from(
    new Set([
      slug,
      baseClean,
      `assignment-help-${baseClean}`,
      `${baseClean}-assignment-help`,
      `assignment-writing-help-${baseClean}`,
    ].filter(Boolean))
  );

  const headers = {
    Accept: "application/json",
  };
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  };

  try {
    // 1. Try candidates in order against single-item endpoint
    for (const cand of candidateSlugs) {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/city-pages/${encodeURIComponent(cand)}`,
          { headers, cache: "no-store" }
        );
        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json && (json.success || json.data)) {
            const pageObj = json?.data?.page || json?.data || json?.page;
            if (pageObj) {
              return NextResponse.json(
                { success: true, data: { page: pageObj, experts: json?.data?.experts || [] } },
                { headers: cacheHeaders }
              );
            }
          }
        }
      } catch (e) {
        console.warn(`Error fetching candidate ${cand}:`, e);
      }
    }

    // 2. Fallback: Fetch all city-pages list and match slug in list
    const listRes = await fetch(`${BACKEND_URL}/api/city-pages`, {
      headers,
      cache: "no-store",
    });

    if (listRes.ok) {
      const listJson = await listRes.json().catch(() => null);
      const pagesArray = Array.isArray(listJson?.data)
        ? listJson.data
        : Array.isArray(listJson)
        ? listJson
        : [];

      const matchedPage = pagesArray.find((item: any) => {
        const itemSlug = cleanSlug(item.slug || "");
        const itemTitle = cleanSlug(item.title || item.city || "");
        return (
          item.slug === slug ||
          item.slug === baseClean ||
          itemSlug === baseClean ||
          itemTitle === baseClean
        );
      });

      if (matchedPage) {
        return NextResponse.json(
          { success: true, data: { page: matchedPage, experts: [] } },
          { headers: cacheHeaders }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: `City page not found for slug: ${slug}` },
      { status: 404, headers: cacheHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to city page detail backend service",
        error: err.message,
      },
      { status: 500, headers: cacheHeaders }
    );
  }
}
