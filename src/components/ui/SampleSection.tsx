"use client";

import React from "react";
import { SAMPLES } from "@/lib/data";
import { SampleCard } from "./SampleCard";
import { SectionContainer } from "./SectionContainer";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Badge } from "./Badge";

export const SampleSection: React.FC = () => {
  return (
    <SectionContainer className="bg-white py-16">
      <div className="flex flex-col gap-10">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="soft-purple" className="w-fit mx-auto text-xs px-3 py-1 font-bold">
            Free Assignment Samples
          </Badge>
          <Heading level={2} className="text-3xl md:text-4xl font-extrabold text-text-heading mt-4">
            8000+ Samples Reflect the High Standard of Our Work
          </Heading>
          <Text className="text-text-muted text-sm md:text-base mt-3">
            Explore free sample assignments, essays, reports, and research proposals written by our UK academic experts.
          </Text>
        </div>

        <div className="relative">
          <div className="samples-bg" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
            {SAMPLES.map((sample) => (
              <SampleCard
                key={`${sample.title}-${sample.subject}`}
                title={sample.title}
                subject={sample.subject}
                image={sample.image}
                href={sample.href}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .samples-bg {
          position: absolute;
          inset: 12px;
          border-radius: 3rem;
          background: radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 28%),
            radial-gradient(circle at bottom right, rgba(251, 115, 74, 0.1), transparent 30%),
            #f8f5ff;
          z-index: 0;
        }

        :global(.sample-card) {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </SectionContainer>
  );
};

SampleSection.displayName = "SampleSection";
