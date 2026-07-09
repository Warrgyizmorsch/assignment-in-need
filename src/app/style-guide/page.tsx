"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { IconBadge } from "@/components/ui/IconBadge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { StatBlock } from "@/components/ui/StatBlock";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ExpertCard } from "@/components/ui/ExpertCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { Input, TextArea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PromoBanner } from "@/components/ui/PromoBanner";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ShieldCheck, Award, Zap, Clock, Users, UserCheck } from "lucide-react";

export default function StyleGuide() {
  const [selectVal, setSelectVal] = useState("");

  const promoBadges = [
    { icon: <ShieldCheck />, label: "Turnitin Checked" },
    { icon: <Clock />, label: "48h Delivery" },
    { icon: <Award />, label: "GPA Booster" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <main className="flex-1">
        {/* Style Guide Header */}
        <SectionContainer background="lavender" className="border-b border-primary-100/50">
          <div className="max-w-3xl">
            <Badge variant="soft-purple" className="mb-4">Brand System</Badge>
            <Heading level={1} highlight="Assignment In Need" highlightVariant="gradient">
              Assignment In Need Reusable UI Design System
            </Heading>
            <Text variant="muted" className="mt-4 text-lg">
              This visual style guide showcases the complete Tailwind-based design system, typography scales, design tokens, and modular components created for the academic writer platform.
            </Text>
          </div>
        </SectionContainer>

        {/* Colors & Tokens Section */}
        <SectionContainer background="white">
          <Heading level={2} className="mb-8">1. Brand Palette & Colors</Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card hoverEffect={false} className="p-4 gap-3 bg-white border border-slate-100">
              <div className="w-full h-16 rounded-lg bg-primary-700"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-heading">Primary Purple</span>
                <span className="text-xs text-text-muted">#5B21B6 (primary-700)</span>
              </div>
            </Card>
            <Card hoverEffect={false} className="p-4 gap-3 bg-white border border-slate-100">
              <div className="w-full h-16 rounded-lg bg-accent-600"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-heading">Accent Orange</span>
                <span className="text-xs text-text-muted">#F97316 (accent-600)</span>
              </div>
            </Card>
            <Card hoverEffect={false} className="p-4 gap-3 bg-white border border-slate-100">
              <div className="w-full h-16 rounded-lg bg-navy-900"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-heading">Dark Navy</span>
                <span className="text-xs text-text-muted">#120C2E (navy-900)</span>
              </div>
            </Card>
            <Card hoverEffect={false} className="p-4 gap-3 bg-white border border-slate-100">
              <div className="w-full h-16 rounded-lg bg-surface-lavender border border-primary-100"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-heading">Lavender Surface</span>
                <span className="text-xs text-text-muted">#F7F5FF (surface-lavender)</span>
              </div>
            </Card>
          </div>
        </SectionContainer>

        {/* Typography Section */}
        <SectionContainer background="lavender">
          <Heading level={2} className="mb-8">2. Heading & Text Systems</Heading>
          <div className="flex flex-col gap-8 bg-white p-8 rounded-card border border-primary-100/30">
            <div>
              <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">HEADING LEVEL 1 (Hero Title)</span>
              <Heading level={1}>Need expert help with nursing essay assignments?</Heading>
            </div>
            <hr className="border-slate-100" />
            <div>
              <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">HEADING LEVEL 2 (Section Title)</span>
              <Heading level={2}>Find answers to all your law paper questions</Heading>
            </div>
            <hr className="border-slate-100" />
            <div>
              <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">HEADING LEVEL 3 (Card Title)</span>
              <Heading level={3}>100% Plagiarism-Free Turnitin Reports</Heading>
            </div>
            <hr className="border-slate-100" />
            <div>
              <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">MIXED TWO-TONE HEADINGS (Highlighting strings)</span>
              <Heading level={2} highlight="Top Grade Locked" highlightVariant="gradient">
                Get Your Assignments Done and Keep Your Top Grade Locked in Class
              </Heading>
            </div>
            <hr className="border-slate-100" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">TEXT BODY</span>
                <Text variant="body">
                  Our professional case study writers deal with research and assignments covering all fields with proper Harvard style citation guides.
                </Text>
              </div>
              <div>
                <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">TEXT MUTED</span>
                <Text variant="muted">
                  Providing students a one-stop solution with 100% satisfaction guaranteed or full cash refund options.
                </Text>
              </div>
              <div>
                <span className="text-xs font-bold text-primary-700 tracking-wider block mb-1">TEXT SMALL</span>
                <Text variant="small">
                  * Terms and conditions apply. High-quality plagiarism reports generated are Turnitin verified.
                </Text>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* Buttons Section */}
        <SectionContainer background="white">
          <Heading level={2} className="mb-8">3. Reusable Buttons</Heading>
          <Card hoverEffect={false} className="p-8 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-text-heading">Button Variants</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="orangeOpen">Orange Open</Button>
                <Button variant="orangeClose">Orange Close</Button>
                <Button variant="blueOpen">Blue Open</Button>
                <Button variant="blueClose">Blue Close</Button>
              </div>
            </div>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-text-heading">Button Sizing</span>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm" variant="blueOpen">Small Button</Button>
                <Button size="md" variant="blueOpen">Medium Button</Button>
                <Button size="lg" variant="blueOpen">Large Button</Button>
              </div>
            </div>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-text-heading">Icon Support & Full Width</span>
              <div className="flex flex-col sm:flex-row gap-4 items-center max-w-xl">
                <Button variant="blueOpen" icon={true}>Next Step</Button>
                <Button variant="orangeOpen" icon={<Zap className="w-4 h-4 fill-white" />}>Boost Grade</Button>
                <Button variant="blueClose" fullWidth={true}>Full Width Trigger</Button>
              </div>
            </div>
          </Card>
        </SectionContainer>

        {/* Badges Section */}
        <SectionContainer background="lavender">
          <Heading level={2} className="mb-8">4. Reusable Badges & Icon Badges</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Badges */}
            <Card hoverEffect={false} className="p-6 gap-4">
              <Heading level={3} className="text-lg">Pill Badges</Heading>
              <div className="flex flex-wrap gap-3">
                <Badge variant="soft-purple">Get Instant Quote ✦</Badge>
                <Badge variant="soft-orange">100% Original Content</Badge>
                <Badge variant="outline">PhD Experts</Badge>
              </div>
            </Card>
            {/* Icon Badges */}
            <Card hoverEffect={false} className="p-6 gap-4">
              <Heading level={3} className="text-lg">Circular Icon Badges</Heading>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <IconBadge color="purple" size="md" icon={<Clock />} />
                  <span className="text-sm font-semibold">Purple (48h)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBadge color="orange" size="md" icon={<Zap />} />
                  <span className="text-sm font-semibold">Orange (Express)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBadge color="green" size="md" icon={<ShieldCheck />} />
                  <span className="text-sm font-semibold">Green (Verified)</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconBadge color="blue" size="md" icon={<Users />} />
                  <span className="text-sm font-semibold">Blue (PhD Teams)</span>
                </div>
              </div>
            </Card>
          </div>
        </SectionContainer>

        {/* Metric Banners */}
        <SectionContainer background="white">
          <Heading level={2} className="mb-8">5. Stat Blocks & Dark Banner Variant</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatBlock icon={<Users />} number="25,000+" label="Delivered Homeworks" />
            <StatBlock icon={<ShieldCheck />} number="100%" label="Originality Verified" />
            <StatBlock icon={<Clock />} number="48 Hours" label="Express Turnaround" />
          </div>
          {/* Dark purple banner variant */}
          <div className="bg-primary-900 rounded-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-primary-950">
            <StatBlock variant="dark" icon={<Users />} number="4.9 / 5.0" label="Average Student Rating" />
            <StatBlock variant="dark" icon={<Award />} number="15,000+" label="Satisfied Postgraduates" />
            <StatBlock variant="dark" icon={<UserCheck />} number="350+" label="PhD Writers in UK" />
          </div>
        </SectionContainer>

        {/* Form elements */}
        <SectionContainer background="lavender">
          <Heading level={2} className="mb-8">6. Forms & Dropdown Inputs</Heading>
          <Card hoverEffect={false} className="p-8 max-w-3xl mx-auto">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Email"
                  labelIcon={<Users />}
                  placeholder="e.g. name@university.edu"
                  helperText="Use your student email for a 15% discount."
                />
                <Input
                  label="Word Count Required"
                  labelIcon={<Clock />}
                  placeholder="e.g. 1500 words"
                  error="Please specify the word count."
                />
              </div>
              <Select
                label="Select Subject Department"
                labelIcon={<Award />}
                placeholder="Choose academic subject..."
                options={[
                  { label: "Business Marketing", value: "marketing" },
                  { label: "Finance & Corporate Accounting", value: "finance" },
                  { label: "Nursing & Healthcare Policy", value: "nursing" },
                  { label: "Business Law Case Briefs", value: "law" },
                  { label: "Civil/Mechanical Engineering", value: "engineering" },
                ]}
                value={selectVal}
                onValueChange={(val) => setSelectVal(val)}
              />
              <TextArea
                label="Detailed Assignment Guidelines"
                labelIcon={<ShieldCheck />}
                placeholder="List topics, formatting style, referencing rules, and rubrics details..."
              />
              <Button variant="orangeOpen" size="lg" className="w-full">Submit Request</Button>
            </form>
          </Card>
        </SectionContainer>

        {/* Radix Accordion */}
        <SectionContainer background="white" id="faqs">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="soft-purple">FAQ</Badge>
              <Heading level={2} className="mt-2">Answers to Common Questions</Heading>
            </div>
            <Card hoverEffect={false} className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is my assignment guaranteed to be 100% plagiarism-free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, absolutely! We write all assignments entirely from scratch. Every final deliverable comes with a Turnitin-verified plagiarism report at no additional charge to ensure original content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can you deliver the completed work in less than 48 hours?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer express delivery options as short as 24 hours. Our writer network is available 24/7 to handle tight schedules without sacrificing high quality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What referencing styles do you support?</AccordionTrigger>
                  <AccordionContent>
                    Our PhD writers cover all academic referencing styles, including Harvard, APA, MLA, Oxford, Chicago, and Vancouver. You can select your required formatting directly in the order form.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        </SectionContainer>

        {/* Promo Banners */}
        <SectionContainer background="lavender">
          <Heading level={2} className="mb-8">7. Full Width Promo Banner</Heading>
          <PromoBanner
            title="Get 30% OFF Your First Accounting Case Study Order!"
            description="Sign up with your university email today and get a turnitin-verified report, formatting, and formatting revisions completely free."
            badgeItems={promoBadges}
            ctaLabel="Get Discount Now"
            onCtaClick={() => alert("Promo applied!")}
          />
        </SectionContainer>

        {/* Cards showcase */}
        <SectionContainer background="white">
          <Heading level={2} className="mb-8">8. Testimonials & Experts Grids</Heading>
          
          <Heading level={3} className="text-lg mb-4">Testimonials (Featured Variant in Center)</Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <TestimonialCard
              name="Emma S."
              institution="London Business School"
              quote="I was struggling with a complex marketing case study due in 48 hours. The team delivered a flawless paper that got me an A grade."
              rating={5}
            />
            <TestimonialCard
              name="David P."
              institution="University of Manchester"
              quote="Fabulous support! The referencing style was completely accurate, and the plagiarism report was 100% clean."
              rating={5}
              featured={true}
            />
            <TestimonialCard
              name="Sarah L."
              institution="King's College London"
              quote="As a nursing student, my care plan assignments are extremely strict. The writer matched my rubric details perfectly."
              rating={5}
            />
          </div>

          <Heading level={3} className="text-lg mb-4">UK Academic Writers Card Grid</Heading>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ExpertCard
              name="Dr. Alisha Cooper"
              role="PhD - Business Law"
              ordersCount="1,420"
              rating={4.9}
              avatar="AC"
            />
            <ExpertCard
              name="Prof. Marcus V."
              role="PhD - Finance Accounting"
              ordersCount="980"
              rating={5.0}
              avatar="MV"
            />
            <ExpertCard
              name="Dr. Evelyn Shaw"
              role="PhD - Nursing & Healthcare"
              ordersCount="1,150"
              rating={4.8}
              avatar="ES"
            />
            <ExpertCard
              name="Dr. Stephen C."
              role="PhD - System Engineering"
              ordersCount="750"
              rating={4.9}
              avatar="SC"
            />
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
