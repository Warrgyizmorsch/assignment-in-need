"use client";

import React, { useState, useEffect } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { getBaseUrl, mapExpertToWriter } from "@/lib/api";
import { Writer } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ExpertSlider } from "@/components/ui/ExpertSlider";
import Link from "next/link";

const INITIAL_EXPERTS: Writer[] = [
  {
    id: "tyler-vaughn",
    name: "Tyler Vaughn",
    role: "Statistics Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a69b051a18ab_Tyler Vaughn.jpg",
    rating: 5.0,
    reviewCount: 38,
    ordersCompleted: 1450,
    ordersInProgress: 3,
    location: "UK Based",
    successRate: 99,
    expertise: ["Data Analysis", "Biostatistics", "Econometrics", "Hypothesis Testing", "SPSS", "R"],
    qualifications: "Master's Qualified",
    experience: "8+ Years of Experience",
    skills: ["Data Analysis", "Biostatistics", "Econometrics"],
    helpsWith: ["Statistics Assignment", "Data Analysis Report", "Dissertation Methodology"],
    about: [
      "Hi, I’m Tyler Vaughn, holding a Master’s degree in Statistics from UC Berkeley with 8+ years assisting UK and global students in complex data analysis, biostatistics, and econometrics."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "8+ Years" },
      { label: "Expertise", value: "Statistics & Data Science" }
    ],
    reviews: []
  },
  {
    id: "amy-frost",
    name: "Amy Frost",
    role: "Nursing Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a689f4a76bb7_Untitled design (28).jpg",
    rating: 5.0,
    reviewCount: 42,
    ordersCompleted: 1820,
    ordersInProgress: 4,
    location: "UK Based",
    successRate: 99,
    expertise: ["Evidence-Based Practice", "Critical Care", "Healthcare Management", "Clinical Care Plans"],
    qualifications: "Master's Qualified",
    experience: "8+ Years of Experience",
    skills: ["Nursing Care Plans", "Evidence-Based Practice", "Public Health"],
    helpsWith: ["Nursing Essays", "Reflective Portfolios", "Clinical Case Studies"],
    about: [
      "Hello, I'm Amy Frost, a dedicated Nursing specialist with over 8 years of clinical and academic writing experience guiding healthcare and nursing students to top grades."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "8+ Years" },
      { label: "Expertise", value: "Nursing & Health Sciences" }
    ],
    reviews: []
  },
  {
    id: "leo-hayes",
    name: "Leo Hayes",
    role: "Computer Science Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a689e1d157ce_Untitled design (26).jpg",
    rating: 5.0,
    reviewCount: 35,
    ordersCompleted: 1640,
    ordersInProgress: 3,
    location: "UK Based",
    successRate: 98,
    expertise: ["Python", "Java", "Data Structures", "Algorithms", "Cloud Computing", "Database Systems"],
    qualifications: "Master's Qualified",
    experience: "8+ Years of Experience",
    skills: ["Software Engineering", "Full Stack", "Machine Learning"],
    helpsWith: ["Programming Assignments", "Final Year Projects", "System Design"],
    about: [
      "Hello, I'm Leo Hayes, your go-to expert for Computer Science and Software Engineering assignments, specializing in algorithms, data structures, and enterprise architecture."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "8+ Years" },
      { label: "Expertise", value: "Computer Science & IT" }
    ],
    reviews: []
  },
  {
    id: "etios-palmer",
    name: "Etios Palmer",
    role: "Law Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a689e31a09fc_Untitled design (25).jpg",
    rating: 4.5,
    reviewCount: 29,
    ordersCompleted: 1210,
    ordersInProgress: 2,
    location: "UK Based",
    successRate: 97,
    expertise: ["UK Common Law", "Contract Law", "Criminal Law", "Tort Law", "Human Rights Law"],
    qualifications: "Master's Qualified",
    experience: "7+ Years of Experience",
    skills: ["Legal Research", "Case Briefs", "OSCOLA Referencing"],
    helpsWith: ["Law Essays", "Moot Court Submissions", "Legal Dissertations"],
    about: [
      "Hello, I’m Etios Palmer, specializing in UK Common Law and Contract Law with over 7 years supporting undergraduate and LLM students across leading UK law schools."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "7+ Years" },
      { label: "Expertise", value: "UK Law Specialist" }
    ],
    reviews: []
  },
  {
    id: "declan-rhodes",
    name: "Declan Rhodes",
    role: "Finance Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a689e0984b6a_Untitled design (24).jpg",
    rating: 5.0,
    reviewCount: 36,
    ordersCompleted: 1530,
    ordersInProgress: 4,
    location: "UK Based",
    successRate: 99,
    expertise: ["Corporate Finance", "Financial Modeling", "Portfolio Management", "DCF Valuation", "Accounting"],
    qualifications: "Master's Qualified",
    experience: "8+ Years of Experience",
    skills: ["Financial Analysis", "DCF", "Valuation", "Corporate Reporting"],
    helpsWith: ["Finance Reports", "Investment Pitch Decks", "Accounting Papers"],
    about: [
      "Hello, I'm Declan Rhodes, an academic finance professional assisting university students with financial modeling, DCF valuation, and accounting dissertations."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "8+ Years" },
      { label: "Expertise", value: "Finance & Accounting" }
    ],
    reviews: []
  },
  {
    id: "chloe-finch",
    name: "Chloe Finch",
    role: "Psychology Expert",
    avatar: "https://ain.warrgyizmorsch.com/assets/media/blogthumbnail/6a689ac11eac4_Untitled design (23).jpg",
    rating: 5.0,
    reviewCount: 31,
    ordersCompleted: 1390,
    ordersInProgress: 3,
    location: "UK Based",
    successRate: 98,
    expertise: ["Cognitive Psychology", "Developmental Psychology", "Research Methodology", "SPSS", "Qualitative Analysis"],
    qualifications: "Master's Qualified",
    experience: "8+ Years of Experience",
    skills: ["APA Referencing", "Literature Review", "Empirical Research"],
    helpsWith: ["Psychology Lab Reports", "Empirical Studies", "Systematic Reviews"],
    about: [
      "Hello, I'm Chloe Finch, specializing in Cognitive and Developmental Psychology, helping students craft empirical reports, literature reviews, and research proposals."
    ],
    credentials: [
      { label: "Degree", value: "Master's Qualified" },
      { label: "Experience", value: "8+ Years" },
      { label: "Expertise", value: "Psychology & Behavioral Science" }
    ],
    reviews: []
  }
];

export const WritersAndTrust: React.FC = () => {
  const [experts, setExperts] = useState<Writer[]>(INITIAL_EXPERTS);

  useEffect(() => {
    let isMounted = true;
    const fetchExperts = async () => {
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/experts?limit=8`, { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const mapped = result.data
              .map((item: any) => mapExpertToWriter(item))
              .filter((writer: Writer) => {
                return (
                  writer.avatar &&
                  writer.avatar.length > 3 &&
                  (writer.avatar.startsWith("/") || writer.avatar.startsWith("http")) &&
                  !writer.avatar.includes("blank.png") &&
                  !writer.avatar.includes("ui-avatars.com")
                );
              })
              .slice(0, 8);
            if (isMounted && mapped.length > 0) {
              setExperts(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching experts in WritersAndTrust:", err);
      }
    };

    fetchExperts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="font-sans bg-white flex flex-col animate-fade-in">
      {/* Our Academic Experts */}
      <section
        className="md:pb-10 md:px-8 pb-6 px-6 bg-white max-w-[1400px] w-full mx-auto"
        id="experts"
      >
        <AnimateIn variant="fadeUp" className="mb-10 text-center">
          <h2 className="text-3xl lg:text-[2rem] font-extrabold text-gray-900 m-0 mb-2">
            Our Academic
            <span className="bg-gradient-to-r from-purple-800 to-orange-600 bg-clip-text text-transparent overflow-hidden text-ellipsis"> Experts</span>
          </h2>
          <p className="text-base text-gray-600 m-0">
            150+ Subject Experts | PhD &amp; Master&apos;s Qualified
          </p>
        </AnimateIn>

        <ExpertSlider
          experts={experts.map((writer) => ({
            id: writer.id,
            name: writer.name,
            role: writer.role,
            avatar: writer.avatar,
            rating: writer.rating,
            ordersCount: writer.ordersCompleted,
            experience: writer.experience,
            qualifications: writer.qualifications,
            slug: writer.id,
            about: writer.about,
          }))}
          className="mb-10"
        />

        <div className="text-center mt-6">
          <Link href="/writers" className="inline-block md:w-auto w-full">
            <Button variant="blueClose" className="md:w-auto w-full" icon={true}>
              View All Experts
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
