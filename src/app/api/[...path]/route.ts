import { fetchBackend } from "@/lib/backend-fetch";

const BACKEND_URL = "https://ain.warrgyizmorsch.com";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const blockedRequestHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "transfer-encoding",
]);

const blockedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "transfer-encoding",
]);

async function forward(request: Request, { params }: RouteContext) {
  try {
    const { path } = await params;
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(
      `/api/${path.map(encodeURIComponent).join("/")}`,
      BACKEND_URL,
    );
    targetUrl.search = incomingUrl.search;

    const requestHeaders = new Headers();
    request.headers.forEach((value, key) => {
      if (!blockedRequestHeaders.has(key.toLowerCase())) {
        requestHeaders.set(key, value);
      }
    });
    requestHeaders.set("Accept", request.headers.get("accept") || "application/json");
    requestHeaders.set("Cache-Control", "no-cache, no-store");
    requestHeaders.set("Pragma", "no-cache");

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const response = await fetchBackend(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!blockedResponseHeaders.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });
    responseHeaders.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
    );
    responseHeaders.set("Pragma", "no-cache");
    responseHeaders.set("Expires", "0");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    // Only log a clean, one-line error instead of the huge stack trace
    console.error(`[Proxy] Backend fetch failed for ${request.url}: ${error?.message || "Timeout/Connection Error"}`);
    return new Response(JSON.stringify({ error: "Backend proxy error", details: error?.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
export const HEAD = forward;
export const OPTIONS = forward;
