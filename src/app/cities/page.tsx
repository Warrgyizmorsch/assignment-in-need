import type { Metadata } from "next";
import CitiesListClient from "./CitiesListClient";

export const metadata: Metadata = {
  title: "Assignment Help Cities | UK & Global University Locations",
  description:
    "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  openGraph: {
    title: "Assignment Help Cities | UK & Global University Locations",
    description:
      "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  },
  twitter: {
    title: "Assignment Help Cities | UK & Global University Locations",
    description:
      "Get localized assignment help across top university cities in the UK, Australia, and worldwide.",
  },
};

export default function CitiesPage() {
  return <CitiesListClient />;
}
