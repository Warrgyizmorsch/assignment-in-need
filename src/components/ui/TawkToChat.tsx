"use client";

import { useEffect } from "react";

export function TawkToChat() {
  useEffect(() => {
    let loaded = false;

    const loadTawkScript = () => {
      if (loaded || document.getElementById("tawk-to-script")) return;
      loaded = true;

      // Clean up event listeners
      window.removeEventListener("scroll", onUserAction);
      window.removeEventListener("mousemove", onUserAction);
      window.removeEventListener("touchstart", onUserAction);
      window.removeEventListener("click", onUserAction);

      const Tawk_API = (window as any).Tawk_API || {};
      
      // Add custom styling to push the widget up from the bottom edge
      Tawk_API.customStyle = {
        visibility: {
          desktop: {
            position: "br",
            xOffset: "20px",
            yOffset: "30px", // Moves it 30px UP from the bottom on PC
          },
          mobile: {
            position: "br",
            xOffset: "15px",
            yOffset: "75px", // Moves it 75px UP on mobile
          },
        },
      };

      (window as any).Tawk_API = Tawk_API;

      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];

      s1.id = "tawk-to-script";
      s1.async = true;
      s1.src = "https://embed.tawk.to/5cebb0e5a667a0210d599ac2/default";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");

      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.head.appendChild(s1);
      }
    };

    const onUserAction = () => {
      loadTawkScript();
    };

    // Load on user interaction
    window.addEventListener("scroll", onUserAction, { passive: true });
    window.addEventListener("mousemove", onUserAction, { passive: true, once: true });
    window.addEventListener("touchstart", onUserAction, { passive: true, once: true });
    window.addEventListener("click", onUserAction, { passive: true, once: true });

    // Fallback load when idle or after delay
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if ("requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(loadTawkScript, { timeout: 4000 });
    } else {
      timerId = setTimeout(loadTawkScript, 3500);
    }

    return () => {
      window.removeEventListener("scroll", onUserAction);
      window.removeEventListener("mousemove", onUserAction);
      window.removeEventListener("touchstart", onUserAction);
      window.removeEventListener("click", onUserAction);
      if (idleId && "cancelIdleCallback" in window) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return null;
}
