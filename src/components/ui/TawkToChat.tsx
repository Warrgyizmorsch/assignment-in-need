"use client";

import { useEffect } from "react";

export function TawkToChat() {
  useEffect(() => {
    // Check if the script is already loaded to avoid duplicates
    if (document.getElementById("tawk-to-script")) return;

    var Tawk_API = (window as any).Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    // Add custom styling to push the widget up from the bottom edge
    Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: 'br',
          xOffset: '20px',
          yOffset: '30px' // Moves it 30px UP from the bottom on PC
        },
        mobile: {
          position: 'br',
          xOffset: '15px',
          yOffset: '75px' // Moves it 75px UP on mobile
        }
      }
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
  }, []);

  return null;
}
