import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Assignment Offers & Promo Codes UK | 40% OFF - Assignment In Need",
  description:
    "Claim up to 40% OFF your UK assignment, essay, and dissertation orders. Verified promo codes, student discounts, free Turnitin reports, and 24/7 academic support.",
  keywords: [
    "assignment offers uk",
    "assignment discount code",
    "essay promo code uk",
    "student discount assignment help",
    "dissertation offer uk",
    "assignment in need promo code",
  ],
  alternates: {
    canonical: "https://www.assignmentinneed.co.uk/offer",
  },
  openGraph: {
    title: "Student Assignment Offers & Promo Codes UK | 40% OFF",
    description:
      "Exclusive discounts for UK university students. Get up to 40% off your first assignment with verified coupon codes.",
    url: "https://www.assignmentinneed.co.uk/offer",
    siteName: "Assignment In Need",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Assignment Offers & Promo Codes UK | 40% OFF",
    description: "Exclusive student discounts on assignments, essays, and dissertations.",
  },
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
