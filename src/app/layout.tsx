import type { Metadata } from "next";
import { Montserrat, Nunito, Roboto } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import { CanonicalHeader } from "@/components/layout/CanonicalHeader";
import { ChatBot } from "@/components/ui/ChatBot";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { QuoteModal } from "@/components/ui/QuoteModal";
import "./globals.css";
// import "./blog/blog.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.assignmentinneed.co.uk",
  ),
  title: "Assignment Help UK | Human-Written Academic Support",
  description:
    "Need reliable Assignment Help UK? Get human-written essays, reports, coursework, and dissertations from subject specialists who understand UK universities.",
  keywords: [
    "assignment help",
    "plagiarism-free writing",
    "case study writing",
    "business law essays",
    "nursing assignment help",
    "engineering report help",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "vWHMdoWSmBuW-0Yi0_rkI3e3yoED357tBiyTV5OlF2w",
  },
  openGraph: {
    type: "website",
    siteName: "Assignment In Need",
    title: "Assignment Help UK | Human-Written Academic Support",
    description:
      "Need reliable Assignment Help UK? Get human-written essays, reports, coursework, and dissertations from subject specialists who understand UK universities.",
    url: "https://www.assignmentinneed.co.uk/",
    images: [
      {
        url: "https://www.assignmentinneed.co.uk/assets/media/layout/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Assignment Help UK - Human-Written Academic Support by AssignmentInNeed",
      },
    ],
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    site: "@assignment_in",
    title: "Assignment Help UK | Human-Written Academic Support",
    description:
      "Need reliable Assignment Help UK? Get human-written essays, reports, coursework, and dissertations from subject specialists who understand UK universities.",
    images: [
      {
        url: "https://www.assignmentinneed.co.uk/assets/media/layout/og-image.jpg",
        alt: "Assignment Help UK - Human-Written Academic Support by AssignmentInNeed",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${nunito.variable} ${roboto.variable}`}
    >
      <head>
        <CanonicalHeader />
        <Script
          id="chunk-error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var RETRY_KEY = 'ain:chunk-retry';
                var RETRY_WINDOW_MS = 60000;

                function isChunkError(value) {
                  var message = value && value.message
                    ? value.message
                    : String(value || '');

                  return (
                    (value && value.name === 'ChunkLoadError') ||
                    /ChunkLoadError/i.test(message) ||
                    /Loading chunk .* failed/i.test(message) ||
                    /Failed to load chunk/i.test(message)
                  );
                }

                function recoverFromChunkError() {
                  var now = Date.now();

                  try {
                    var lastRetry = Number(sessionStorage.getItem(RETRY_KEY) || 0);
                    if (now - lastRetry < RETRY_WINDOW_MS) {
                      return;
                    }
                    sessionStorage.setItem(RETRY_KEY, String(now));
                  } catch (_) {
                    return;
                  }

                  var retryUrl = new URL(window.location.href);
                  retryUrl.searchParams.set('_chunk_retry', String(now));
                  window.location.replace(retryUrl.toString());
                }

                window.addEventListener('error', function (event) {
                  var failedAsset = event && event.target;
                  var assetUrl = failedAsset && (failedAsset.src || failedAsset.href);

                  if (
                    isChunkError(event && event.error ? event.error : event) ||
                    (assetUrl && assetUrl.indexOf('/_next/static/') !== -1)
                  ) {
                    recoverFromChunkError();
                  }
                });

                window.addEventListener('unhandledrejection', function (event) {
                  if (isChunkError(event && event.reason)) {
                    recoverFromChunkError();
                  }
                });
              })();
            `,
          }}
        />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K6W6M6VS');`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K6W6M6VS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ChatBot />
        <QuoteModal />
        <Toaster
          position="top-center"
          reverseOrder={false}
          containerStyle={{ zIndex: 99999 }}
        />
      </body>
    </html>
  );
}
