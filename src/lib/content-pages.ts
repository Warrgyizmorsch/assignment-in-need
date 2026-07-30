import { cache } from "react";
import { fetchBackend } from "@/lib/backend-fetch";
import {
  canonicalSubjectSlug,
  subjectDataSlug,
} from "@/lib/utils";

const CONTENT_BACKEND_URL = "https://ain.warrgyizmorsch.com";

export type ContentPagePayload = {
  page: any;
  experts: any[];
  reviews: any[];
  faqs: any[];
};

function normalizePayload(result: any): ContentPagePayload | null {
  const page = result?.data?.page || result?.data || result?.page;
  if (!page || typeof page !== "object" || Array.isArray(page)) return null;

  return {
    page,
    experts: Array.isArray(result?.data?.experts)
      ? result.data.experts
      : Array.isArray(result?.experts)
        ? result.experts
        : [],
    reviews: Array.isArray(result?.data?.reviews)
      ? result.data.reviews
      : Array.isArray(result?.reviews)
        ? result.reviews
        : [],
    faqs: Array.isArray(result?.data?.faqs)
      ? result.data.faqs
      : Array.isArray(result?.faqs)
        ? result.faqs
        : [],
  };
}

export const getFreshSubjectPage = cache(
  async (slug: string): Promise<ContentPagePayload | null> => {
    const candidates = Array.from(
      new Set([canonicalSubjectSlug(slug), subjectDataSlug(slug)]),
    );

    for (const candidate of candidates) {
      const response = await fetchBackend(
        `${CONTENT_BACKEND_URL}/api/subject-pages/subject/${encodeURIComponent(candidate)}?_fresh=${Date.now()}`,
        {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(15000),
        },
      ).catch(() => null);

      if (!response?.ok) continue;
      const payload = normalizePayload(await response.json().catch(() => null));
      if (payload) return payload;
    }

    return null;
  },
);

export const getFreshCityPage = cache(
  async (slug: string): Promise<ContentPagePayload | null> => {
    const citySlug = slug
      .toLowerCase()
      .split("/")
      .pop()!
      .replace(/^assignment-help-/, "")
      .replace(/-assignment-help$/, "")
      .replace(/-assignment-writing-help$/, "");

    const response = await fetchBackend(
      `${CONTENT_BACKEND_URL}/api/city-pages/cities/assignment-help-${encodeURIComponent(citySlug)}?_fresh=${Date.now()}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      },
    ).catch(() => null);

    if (!response?.ok) return null;
    return normalizePayload(await response.json().catch(() => null));
  },
);
