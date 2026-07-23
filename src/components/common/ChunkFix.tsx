"use client";

import { useEffect } from "react";

export function ChunkFix() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const msg = event.message || "";
      if (
        msg.includes("ChunkLoadError") ||
        msg.includes("Failed to load chunk") ||
        /Loading chunk .* failed/i.test(msg)
      ) {
        console.warn("Chunk load failed. Reloading page to fetch updated assets...");
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = reason?.message || String(reason || "");
      if (
        reason?.name === "ChunkLoadError" ||
        msg.includes("ChunkLoadError") ||
        msg.includes("Failed to load chunk") ||
        /Loading chunk .* failed/i.test(msg)
      ) {
        console.warn("Unhandled chunk rejection. Reloading page to fetch updated assets...");
        window.location.reload();
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
