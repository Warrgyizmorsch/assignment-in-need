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
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  };

  try {
    for (const cand of candidateSlugs) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/service-pages/${cand}`, {
          headers,
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json().catch(() => null);
          if (json && (json.success || json.data)) {
            const pageObj = json?.data?.page || json?.data || json?.page;
            if (pageObj) {
              return NextResponse.json(
                { success: true, data: { page: pageObj } },
                { headers: cacheHeaders }
              );
            }
          }
        }
      } catch (e) {
        console.warn(`Error fetching candidate service page ${cand}:`, e);
      }
    }

    // Fallback: search all service pages list
    const listRes = await fetch(`${BACKEND_URL}/api/service-pages`, {
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
        return NextResponse.json(
          { success: true, data: { page: matchedPage } },
          { headers: cacheHeaders }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: `Service page not found for slug: ${pathSlug}` },
      { status: 404, headers: cacheHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to service page detail backend service",
        error: err.message,
      },
      { status: 500, headers: cacheHeaders }
    );
  }
}
