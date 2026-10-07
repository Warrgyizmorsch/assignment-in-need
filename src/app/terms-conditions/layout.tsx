import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Assignment In Need UK",
  description: "Read the terms and conditions governing the use of Assignment In Need, including services, payments, revisions, refunds and user responsibilities.",
};

export default function TermsConditionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
