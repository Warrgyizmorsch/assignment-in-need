"use client";

type CachedRequest = {
  expiresAt: number;
  response: Promise<Response>;
};

const requestCache = new Map<string, CachedRequest>();
const DEFAULT_TTL_MS = 5000;

function requestKey(input: RequestInfo | URL, init?: RequestInit) {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  return `${(init?.method || "GET").toUpperCase()}:${url}`;
}

export function dedupedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  ttlMs = DEFAULT_TTL_MS,
): Promise<Response> {
  const method = (init.method || "GET").toUpperCase();
  if (method !== "GET") return fetch(input, init);

  const key = requestKey(input, init);
  const now = Date.now();
  const existing = requestCache.get(key);
  if (existing && existing.expiresAt > now) {
    return existing.response.then((response) => response.clone());
  }

  const response = fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...Object.fromEntries(new Headers(init.headers).entries()),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  }).then((result) => {
    if (!result.ok) requestCache.delete(key);
    return result;
  }).catch((error) => {
    requestCache.delete(key);
    throw error;
  });

  requestCache.set(key, {
    response,
    expiresAt: now + ttlMs,
  });

  return response.then((result) => result.clone());
}
