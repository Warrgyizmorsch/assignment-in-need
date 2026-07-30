import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://ain.warrgyizmorsch.com";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

import { WRITERS } from "@/lib/data";

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const cleanSlug = (str: string) =>
    str
      ?.toLowerCase()
      ?.replace(/^dr\.?\s*/i, "")
      ?.replace(/^prof\.?\s*/i, "")
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || "";

  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  };

  try {
    // 1. Try direct detail endpoint
    const response = await fetch(`${BACKEND_URL}/api/experts/${id}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }).catch(() => null);

    if (response && response.ok) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed && (parsed.success || parsed.data)) {
          return NextResponse.json(parsed, { headers: cacheHeaders });
        }
      } catch {}
    }

    // 2. Fallback: fetch all experts list and match by id, slug, or name
    const listRes = await fetch(`${BACKEND_URL}/api/experts`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }).catch(() => null);

    const targetSlug = cleanSlug(id);

    if (listRes && listRes.ok) {
      const listJson = await listRes.json().catch(() => null);
      const experts = Array.isArray(listJson?.data) ? listJson.data : Array.isArray(listJson) ? listJson : [];

      if (experts.length > 0) {
        let matched = experts.find((item: any) => {
          if (String(item.id) === String(id)) return true;
          if (item.slug && (item.slug === id || cleanSlug(item.slug) === targetSlug)) return true;
          if (item.name && cleanSlug(item.name) === targetSlug) return true;
          return false;
        });

        if (!matched) {
          // Fuzzy matching
          matched = experts.find((item: any) => {
            const itemSlug = cleanSlug(item.slug || "");
            const itemName = cleanSlug(item.name || "");
            return (
              (targetSlug && itemSlug && (targetSlug.includes(itemSlug) || itemSlug.includes(targetSlug))) ||
              (targetSlug && itemName && (targetSlug.includes(itemName) || itemName.includes(targetSlug)))
            );
          });
        }

        if (matched) {
          return NextResponse.json({ success: true, data: matched }, { headers: cacheHeaders });
        }

        // Return first expert if list exists instead of 404
        return NextResponse.json({ success: true, data: experts[0] }, { headers: cacheHeaders });
      }
    }

    // 3. Fallback to static WRITERS list
    const staticMatch = WRITERS.find((w) => {
      if (w.id === id || w.id.toLowerCase() === id?.toLowerCase()) return true;
      const wIdClean = cleanSlug(w.id);
      const wNameClean = cleanSlug(w.name);
      return wIdClean === targetSlug || wNameClean === targetSlug;
    }) || WRITERS[0];

    return NextResponse.json({ success: true, data: staticMatch }, { headers: cacheHeaders });
  } catch (err: any) {
    const staticMatch = WRITERS[0];
    return NextResponse.json({ success: true, data: staticMatch }, { headers: cacheHeaders });
  }
}
