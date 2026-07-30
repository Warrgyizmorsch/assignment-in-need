import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const pathSlug = Array.isArray(slug) ? slug.join("/") : slug;
  const lastSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const cleanSlug = (str: string) =>
    str
      ?.toLowerCase()
      ?.replace(/^assignment-help-/, "")
      ?.replace(/-assignment-help$/, "")
      ?.replace(/-assignment-writing-help$/, "")
      ?.trim() || "";

  const baseClean = cleanSlug(lastSlug);

  const candidateSlugs = Array.from(
    new Set([
      `subject/${pathSlug}`,
      `subject/${lastSlug}`,
      `subject/${baseClean}`,
      `subject/${baseClean}-assignment-help`,
      `subject/assignment-help-${baseClean}`,
      pathSlug,
      lastSlug,
      baseClean,
      `assignment-help-${baseClean}`,
      `${baseClean}-assignment-help`,
    ].filter(Boolean))
  );

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
    const fetchPromises = candidateSlugs.map((cand) =>
      fetch(`${BACKEND_URL}/api/subject-pages/${cand}`, {
        headers,
        cache: "no-store",
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
                  reviews: json?.data?.reviews || json?.reviews || [],
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

    // Fallback: search all subject pages list and fetch full detail for matched page
    const listRes = await fetch(`${BACKEND_URL}/api/subject-pages`, {
      headers,
      cache: "no-store",
    }).catch(() => null);

    if (listRes && listRes.ok) {
      const listJson = await listRes.json().catch(() => null);
      const pagesArray = Array.isArray(listJson?.data)
        ? listJson.data
        : Array.isArray(listJson)
        ? listJson
        : [];

      const matchedPage = pagesArray.find((item: any) => {
        const itemSlug = cleanSlug(item.slug || "");
        const itemTitle = cleanSlug(item.title || "");
        return (
          item.slug === pathSlug ||
          item.slug === lastSlug ||
          item.slug === baseClean ||
          itemSlug === baseClean ||
          itemTitle === baseClean
        );
      });

      if (matchedPage) {
        if (matchedPage.slug) {
          const detailRes = await fetch(`${BACKEND_URL}/api/subject-pages/${matchedPage.slug}`, {
            headers,
            cache: "no-store",
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
                      reviews: detailJson?.data?.reviews || detailJson?.reviews || [],
                    },
                  },
                  { headers: cacheHeaders }
                );
              }
            }
          }
        }

        return NextResponse.json(
          { success: true, data: { page: matchedPage } },
          { headers: cacheHeaders }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: `Subject page not found for slug: ${pathSlug}` },
      { status: 404, headers: cacheHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to subject page detail backend service",
        error: err.message,
      },
      { status: 500, headers: cacheHeaders }
    );
  }
}
