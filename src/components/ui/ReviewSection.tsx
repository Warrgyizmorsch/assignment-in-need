"use client";

import Image from "next/image";
import { SectionContainer } from "./SectionContainer";
import { Badge } from "./Badge";
import { Heading } from "./Heading";
import { Text } from "./Text";

const REVIEWS = [
  {
    title: "Google Review",
    description: "Real student feedback on our UK assignment help services, rated 4.4/5.",
    href: "https://www.google.com/search?kgmid=/g/11h5lkq603&hl=en-IN&q=Assignment+In+Need",
    logo: "/assets/media/layout/google_logo.png",
    rating: "4.4/5",
  },
  {
    title: "AIN Review",
    description: "Verified internal rating from students who received expert writing support.",
    href: "/review",
    logo: "/assets/media/layout/assignment_logo.webp",
    rating: "4.6/5",
  },
  {
    title: "Trustpilot",
    description: "Trusted reviews from global learners on our assignment writing standards.",
    href: "https://www.trustpilot.com/review/assignnmentinneed.com",
    logo: "/assets/media/layout/trustpilot_logo.svg",
    rating: "4.2/5",
  },
];

export const ReviewSection: React.FC = () => {
  return (
    <SectionContainer className="bg-surface-lavender py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="soft-purple" className="w-fit mx-auto text-xs px-3 py-1 font-bold">
            Trusted Reviews
          </Badge>
          <Heading level={2} className="text-3xl md:text-4xl font-extrabold text-text-heading mt-4">
            Verified Ratings from Students and Partners
          </Heading>
          <Text className="text-text-muted text-sm md:text-base mt-3">
            Real ratings from Google, Trustpilot, and our internal review network highlight the quality of our UK assignment help.
          </Text>
        </div>

        <div className="review-container">
          {REVIEWS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="review-box"
            >
              <div className="review-logo-wrapper">
                <Image src={item.logo} alt={item.title} width={48} height={48} className="review-logo" />
              </div>
              <div className="review-copy">
                <p className="text-sm font-semibold text-text-heading mb-1">{item.title}</p>
                <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
              </div>
              <span className="rating-number">{item.rating}</span>
            </a>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

ReviewSection.displayName = "ReviewSection";
