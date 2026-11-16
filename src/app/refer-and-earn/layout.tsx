import { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Refer & Earn | Assignment In Need UK",
  description: "Refer friends to Assignment In Need and earn rewards. Learn how our referral programme works, who can participate and how referral rewards are claimed.",
  canonicalUrl: "/refer-and-earn",
});

export default function ReferAndEarnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
