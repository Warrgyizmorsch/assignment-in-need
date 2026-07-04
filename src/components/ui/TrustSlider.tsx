"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ShieldCheck, Clock4, Repeat, Headphones, GraduationCap, BookOpen } from "lucide-react";
import { SectionContainer } from "./SectionContainer";
import { Heading } from "./Heading";
import { Text } from "./Text";

const TRUST_ITEMS = [
  {
    title: "100% Plagiarism-Free",
    description: "Every assignment is written from scratch and checked for originality before delivery.",
    icon: ShieldCheck,
  },
  {
    title: "On-Time Delivery",
    description: "We meet your deadlines reliably, including urgent and last-minute requests.",
    icon: Clock4,
  },
  {
    title: "Free Unlimited Revisions",
    description: "Request as many revisions as needed until your assignment matches the brief.",
    icon: Repeat,
  },
  {
    title: "Money-Back Satisfaction",
    description: "If the work does not meet the agreed brief, you are eligible for a refund.",
    icon: BookOpen,
  },
  {
    title: "24/7 Customer Support",
    description: "Our team is available around the clock to answer questions and share updates.",
    icon: Headphones,
  },
  {
    title: "Verified Expert Writers",
    description: "Assignments are handled by qualified UK academic experts with proven experience.",
    icon: GraduationCap,
  },
];

export const TrustSlider: React.FC = () => {
  return (
    <SectionContainer className="bg-[#fbf7f6] py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Heading level={2} className="section-title">
            What Sets Our <span>Assignment Writing Services</span> in the UK Apart
          </Heading>
          <Text className="text-text-muted text-sm md:text-base mt-3">
            We help UK students stay confident under pressure with original work, fast delivery, and subject-specific expert support.
          </Text>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={true}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="trust-swiper"
          >
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <SwiperSlide key={item.title} className="trust-slide">
                  <div className="trust-card">
                    <div className="trust-icon">
                      <Icon className="w-6 h-6 text-primary-700" />
                    </div>
                    <h3>{item.title}</h3>
                    <p className="trust-card-description">{item.description}</p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx>{`
        .trust-card {
          background: rgba(255, 255, 255, 0.96);
          border-radius: 18px;
          border: 1px solid rgba(63, 21, 154, 0.14);
          box-shadow: 0 12px 26px rgba(16, 24, 40, 0.10);
          padding: 30px 24px 24px;
          text-align: center;
          position: relative;
          min-height: 270px;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          backdrop-filter: blur(6px);
        }

        .trust-card:before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: radial-gradient(180px 180px at 12% 0%, rgba(63, 21, 154, 0.12), transparent 65%),
            radial-gradient(220px 220px at 100% 0%, rgba(14, 143, 206, 0.12), transparent 65%),
            radial-gradient(240px 240px at 50% 120%, rgba(99, 102, 241, 0.10), transparent 60%);
          pointer-events: none;
        }

        .trust-card:after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 17px;
          border: 1px solid rgba(209, 213, 219, 0.55);
          pointer-events: none;
        }

        .trust-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(16, 24, 40, 0.14);
          border-color: rgba(14, 143, 206, 0.28);
        }

        .trust-icon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, rgba(63, 21, 154, 0.12), rgba(14, 143, 206, 0.12));
          border: 1px solid rgba(63, 21, 154, 0.10);
        }

        .trust-icon :global(svg) {
          transform: translateZ(0);
        }

        .trust-card:hover .trust-icon :global(svg) {
          color: #0E8FCE;
          transform: scale(1.12);
        }

        .trust-card h3 {
          background: linear-gradient(to bottom, #3F159A, #0E8FCE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
          margin: 8px 0 10px;
          position: relative;
          z-index: 1;
        }

        .trust-card-description {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.45;
          color: #000;
          font-weight: 500;
          position: relative;
          z-index: 1;
          min-height: 94px;
        }

        .trust-swiper :global(.swiper-button-prev),
        .trust-swiper :global(.swiper-button-next) {
          color: #58607a;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .trust-swiper :global(.swiper-button-prev:hover),
        .trust-swiper :global(.swiper-button-next:hover) {
          transform: translateY(-50%) scale(1.05);
          border-color: rgba(110, 64, 201, 0.35);
        }

        .trust-swiper :global(.swiper-button-prev) {
          left: -10px;
        }

        .trust-swiper :global(.swiper-button-next) {
          right: -10px;
        }

        .trust-swiper :global(.swiper-button-disabled) {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .section-title {
          background: linear-gradient(to bottom, #3F159A, #0E8FCE);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 1.95rem;
          }
          .trust-swiper :global(.swiper-button-prev),
          .trust-swiper :global(.swiper-button-next) {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </SectionContainer>
  );
};

TrustSlider.displayName = "TrustSlider";
