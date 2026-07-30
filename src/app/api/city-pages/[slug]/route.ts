import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  // The backend list exposes city slugs as
  // `cities/assignment-help-<city>`. Avoid a fan-out of ten slow requests.
  const candidateSlugs = [`cities/assignment-help-${baseClean}`];

  const headers = {
    Accept: "application/json",
  };
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  const isRealPage = (p: any) =>
    p &&
    typeof p === "object" &&
    !Array.isArray(p) &&
    Boolean(
      p.hero_heading ||
      p.long_content ||
      p.hero_content ||
      p.content ||
      p.description ||
      p.meta_title ||
      p.title ||
      p.seo_content
    );

  try {
    const freshToken = Date.now().toString();
    // 1. Parallelize candidate fetches against single-item endpoint
    const fetchPromises = candidateSlugs.map((cand) =>
      fetch(`${BACKEND_URL}/api/city-pages/${encodeURIComponent(cand)}?_fresh=${freshToken}`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      })
        .then(async (res) => {
          if (res && res.ok) {
            const json = await res.json().catch(() => null);
            if (json && (json.success || json.data)) {
              const rawPage = json?.data?.page ?? (json?.page && typeof json?.page === "object" ? json.page : null);
              const targetPage = isRealPage(rawPage) ? rawPage : isRealPage(json?.data) ? json.data : null;
              if (targetPage) {
                return {
                  page: targetPage,
                  experts: json?.data?.experts || json?.experts || [],
                  faqs: json?.data?.faqs || json?.faqs || [],
                };
              }
            }
          }
          return null;
        })
        .catch(() => null)
    );

    const results = await Promise.allSettled(fetchPromises);
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) {
        return NextResponse.json(
          { success: true, data: r.value },
          { headers: cacheHeaders }
        );
      }
    }

    // 2. Fallback: Fetch all city-pages list, match slug in list, and fetch full detail page
    const listRes = await fetch(`${BACKEND_URL}/api/city-pages?_fresh=${freshToken}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    }).catch(() => null);

    if (listRes && listRes.ok) {
      const listJson = await listRes.json().catch(() => null);
      const staticCities = Array.isArray(listJson?.static_cities) ? listJson.static_cities : [];
      const dynamicData = Array.isArray(listJson?.data)
        ? listJson.data
        : Array.isArray(listJson)
        ? listJson
        : [];
      const pagesArray = [...staticCities, ...dynamicData];

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
        if (matchedPage.slug) {
          const detailRes = await fetch(`${BACKEND_URL}/api/city-pages/${encodeURIComponent(matchedPage.slug)}?_fresh=${freshToken}`, {
            headers,
            cache: "no-store",
            signal: AbortSignal.timeout(12000),
          }).catch(() => null);

          if (detailRes && detailRes.ok) {
            const detailJson = await detailRes.json().catch(() => null);
            if (detailJson && (detailJson.success || detailJson.data)) {
              const fullPage = detailJson?.data?.page || detailJson?.data || detailJson?.page;
              if (fullPage) {
                return NextResponse.json(
                  {
                    success: true,
                    data: {
                      page: fullPage,
                      experts: detailJson?.data?.experts || detailJson?.experts || [],
                      faqs: detailJson?.data?.faqs || detailJson?.faqs || [],
                    },
                  },
                  { headers: cacheHeaders }
                );
              }
            }
          }
        }

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
