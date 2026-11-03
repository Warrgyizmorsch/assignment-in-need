import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Integrity Policy: UK Student Guide",
  description:
    "Academic integrity policy explained for UK students: what counts as misconduct, the rules on AI, likely outcomes and how to protect yourself",
  alternates: {
    canonical: "/academic-integrity-policy",
  },
  openGraph: {
    title: "Academic Integrity Policy: UK Student Guide",
    description:
      "Academic integrity policy explained for UK students: what counts as misconduct, the rules on AI, likely outcomes and how to protect yourself",
    url: "https://www.assignmentinneed.co.uk/academic-integrity-policy",
    type: "article",
    siteName: "Assignment In Need",
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Integrity Policy: UK Student Guide",
    description:
      "Academic integrity policy explained for UK students: what counts as misconduct, the rules on AI, likely outcomes and how to protect yourself",
  },
};

export default function AcademicIntegrityPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
