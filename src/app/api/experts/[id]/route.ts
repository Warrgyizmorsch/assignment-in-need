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

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const cleanSlug = (str: string) =>
    str
      ?.toLowerCase()
      ?.replace(/^dr\.?\s*/i, "")
      ?.replace(/^prof\.?\s*/i, "")
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/^-+|-+$/g, "") || "";

  try {
    // 1. Try direct detail endpoint
    const response = await fetch(`${BACKEND_URL}/api/experts/${id}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed && (parsed.success || parsed.data)) {
          return NextResponse.json(parsed);
        }
      } catch {}
    }

    // 2. Fallback: fetch all experts list and match by id, slug, or name
    const listRes = await fetch(`${BACKEND_URL}/api/experts`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (listRes.ok) {
      const listJson = await listRes.json().catch(() => null);
      const experts = Array.isArray(listJson?.data) ? listJson.data : Array.isArray(listJson) ? listJson : [];
      
      const targetSlug = cleanSlug(id);

      const matched = experts.find((item: any) => {
        if (String(item.id) === String(id)) return true;
        if (item.slug && (item.slug === id || cleanSlug(item.slug) === targetSlug)) return true;
        if (item.name && cleanSlug(item.name) === targetSlug) return true;
        return false;
      });

      if (matched) {
        return NextResponse.json({ success: true, data: matched });
      }
    }

    return NextResponse.json(
      { success: false, message: `Expert profile not found for id: ${id}` },
      { status: 404 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to expert profile backend service",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
