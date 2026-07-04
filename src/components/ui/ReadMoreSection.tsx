"use client";

import React, { useState } from "react";
import { SectionContainer } from "./SectionContainer";
import { Heading } from "./Heading";
import { Text } from "./Text";
import { Button } from "./Button";
import { Badge } from "./Badge";

export const ReadMoreSection: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <SectionContainer className="bg-surface-lavender" id="seo-readmore">
      <div className="max-w-5xl mx-auto rounded-[2rem] border border-primary-100/60 bg-white p-6 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-4">
          <Badge variant="soft-purple" className="w-fit text-xs px-3 py-1 font-bold">
            Assignment In Need Insight
          </Badge>
          <Heading level={2} className="text-2xl md:text-3xl font-bold text-text-heading">
            Assignment in Need – Trusted Assignment Help UK for University Success
          </Heading>
          <Text className="text-text-muted text-sm md:text-base">
            In today’s highly competitive UK academic environment, achieving strong grades requires consistent effort, a clear understanding of subjects, and strict adherence to university guidelines.
            However, increasing academic pressure, overlapping deadlines, exams, and personal responsibilities often leave students across the UK feeling overwhelmed.
          </Text>

          <div className={`overflow-hidden transition-max-height duration-500 ${open ? "max-h-[2000px]" : "max-h-0"}`}>
            <div className="mt-4 space-y-4 text-text-body text-sm leading-relaxed">
              <Text>
                Assignments quickly become a major source of stress, yet skipping them is not an option, as they directly impact overall grades and academic progression. Assignment in Need offers professional assignment help UK that supports students at undergraduate, postgraduate, and doctoral levels.
              </Text>
              <Text>
                Our assignment writing help in UK focuses on clarity, originality, and academic depth. Every paper is written from scratch by qualified assignment writers in UK, ensuring your work meets university expectations. Unlike automated tools, our UK assignment help services are 100% human-led, research-based, and aligned with UK academic frameworks.
              </Text>
              <Text>
                If you’re looking for university assignment help that is ethical, confidential, and results-driven, Assignment in Need is your trusted partner. We provide structured guidance, in-depth referencing, and transparent communication throughout the entire process.
              </Text>
              <Heading level={3} className="text-lg font-semibold text-text-heading">
                What you can expect from our service
              </Heading>
              <ul className="list-disc pl-5 space-y-2 text-text-body text-sm leading-7">
                <li>100% original, Turnitin-friendly assignments written by UK academic experts.</li>
                <li>Fast delivery with a free plagiarism report and round-the-clock support.</li>
                <li>Accurate academic formatting using Harvard, APA, MLA, OSCOLA, and more.</li>
                <li>Unlimited revisions and complete instruction adherence for best results.</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="lg" onClick={() => setOpen(!open)}>
              {open ? "Show Less" : "Read More"}
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

ReadMoreSection.displayName = "ReadMoreSection";
