const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const MIN_REQUEST_INTERVAL_MS = 350;

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

let backendRequestQueue: Promise<void> = Promise.resolve();
let lastBackendRequestStartedAt = 0;

function scheduleBackendRequest(
  input: string | URL,
  init: RequestInit,
): Promise<Response> {
  const request = backendRequestQueue.then(async () => {
    const elapsed = Date.now() - lastBackendRequestStartedAt;
    const delay = Math.max(0, MIN_REQUEST_INTERVAL_MS - elapsed);
    if (delay > 0) await wait(delay);

    lastBackendRequestStartedAt = Date.now();
    return fetch(input, init);
  });

  backendRequestQueue = request.then(
    () => undefined,
    () => undefined,
  );

  return request;
}

export async function fetchBackend(
  input: string | URL,
  init: RequestInit = {},
  maxAttempts = 4,
): Promise<Response> {
  let lastResponse: Response | null = null;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const response = await scheduleBackendRequest(input, {
        ...init,
        cache: "no-store",
        headers: {
          ...Object.fromEntries(new Headers(init.headers).entries()),
          "Cache-Control": "no-cache, no-store",
          Pragma: "no-cache",
        },
      });

      if (!RETRYABLE_STATUSES.has(response.status) || attempt === maxAttempts - 1) {
        return response;
      }

      lastResponse = response;
      await response.arrayBuffer().catch(() => null);
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1000, 5000)
        : 300 * 2 ** attempt;
      await wait(delay);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts - 1) throw error;
      await wait(300 * 2 ** attempt);
    }
  }

  if (lastResponse) return lastResponse;
  
  const errorMessage = lastError instanceof Error ? lastError.message : "Backend request failed";
  const finalError = new Error(errorMessage);
  if (lastError instanceof Error) {
    finalError.name = lastError.name;
    finalError.cause = lastError;
  }
  throw finalError;
}
