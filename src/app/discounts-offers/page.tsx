"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Heading } from "@/components/ui/Heading";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Button } from "@/components/ui/Button";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/ui/AnimateIn";
import { CheckCircle2, Copy, Gift, GraduationCap, UserPlus, Clock, Users, Package, ArrowRight, Check } from "lucide-react";
import { dedupedFetch } from "@/lib/client-fetch";
import { toast } from "react-hot-toast";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const DISCOUNT_FAQS = [
  {
    question: "How do I apply my student discount?",
    answer: "Simply calculate your price using our tool above, click 'GET MY DISCOUNT', and your discount will be applied automatically when you place your order on the checkout page."
  },
  {
    question: "Can I use multiple discount codes at once?",
    answer: "No, you can only apply one promotional code per order. We recommend using the one that offers the highest savings for your specific assignment."
  },
  {
    question: "Are the discounts available for all subjects?",
    answer: "Yes! Unless specifically stated in the offer terms, our discounts apply to all subjects, including Nursing, Law, Management, and Engineering."
  },
  {
    question: "Is there a minimum word count required to use a discount?",
    answer: "Most of our general discounts do not require a minimum word count. However, certain special promotions might have minimum requirements, which will be clearly stated on the offer card."
  }
];

function ReadMoreContent() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-[900px] mx-auto text-slate-500 text-[15px] md:text-base font-medium leading-[28px]">
      <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1500px]' : 'max-h-[90px]'}`}>
        <p className="mb-4">
          At Assignment in Need, we understand the financial challenges students face. That's why we've tailored our discount structures to ensure premium academic assistance remains accessible to everyone. Whether you're ordering your first essay or returning for your dissertation, our transparent pricing and generous discounts guarantee you get the best value for your money. Our team of UK-based experts is dedicated to delivering high-quality, original content without breaking the bank.
        </p>
        
        <p className="mb-4">
          Our discount system is straightforward. New customers can immediately take advantage of our FIRST40 code to receive a massive 40% off their initial order. For returning students, we regularly run seasonal promotions and subject-specific deals, ensuring continuous savings throughout your academic journey.
        </p>
        <p className="mb-4">
          Furthermore, we offer bulk discounts for larger assignments like dissertations and thesis papers. We believe that quality education support shouldn't be a luxury. Every order comes with free formatting, free bibliography, and unlimited revisions. Calculate your price above, apply your discount code, and experience the peace of mind that comes with professional academic help at a student-friendly price.
        </p>

        {/* Fade Out Effect when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      <div className="text-center mt-6">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center justify-center gap-2 border border-purple-200 text-purple-800 bg-[#faf9fe] hover:bg-purple-50 transition-colors font-bold text-[15px] px-8 py-3 rounded-full mx-auto"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
          <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function DiscountsOffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState<number>(250);
  
  // API State
  const [apiUrgencies, setApiUrgencies] = useState<any[]>([]);
  const [apiWordCounts, setApiWordCounts] = useState<any[]>([]);
  const [apiBasePricePerWord, setApiBasePricePerWord] = useState<number>(0.03);
  
  // Form State
  const [selectedService, setSelectedService] = useState("Essay");
  const [selectedLevel, setSelectedLevel] = useState("University");
  const [selectedDeadline, setSelectedDeadline] = useState("7");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [urgenciesRes, wcRes] = await Promise.all([
          dedupedFetch("/api/app/urgencies"),
          dedupedFetch("/api/app/word-count"),
        ]);
        
        if (urgenciesRes.ok) {
          const payload = await urgenciesRes.json();
          if (payload.success && Array.isArray(payload.data)) {
            setApiUrgencies(payload.data);
          }
        }
        
        if (wcRes.ok) {
          const payload = await wcRes.json();
          if (payload.success) {
            if (Array.isArray(payload.data)) {
              setApiWordCounts(payload.data);
            }
            if (payload.base_price_per_word) {
              setApiBasePricePerWord(Number(payload.base_price_per_word));
            }
          }
        }
      } catch (e) {
        console.error("Error fetching calculator config", e);
      }
    };
    fetchConfigs();
  }, []);

  const calculatedBasePrice = React.useMemo(() => {
    let price = apiBasePricePerWord * wordCount;

    // Word count multiplier
    const matchedWc = apiWordCounts.find((wc: any) => Number(wc.value) === wordCount);
    if (matchedWc && matchedWc.multiplier) {
      price *= Number(matchedWc.multiplier);
    } else {
      // Range-based fallback
      if (wordCount >= 250 && wordCount < 500) price *= 2.67;
      else if (wordCount >= 500 && wordCount < 1000) price *= 2.22;
      else if (wordCount >= 1000 && wordCount < 2000) price *= 1.94;
      else if (wordCount >= 2000 && wordCount < 3000) price *= 1.67;
      else if (wordCount >= 3000 && wordCount < 4000) price *= 1.30;
      else if (wordCount >= 4000 && wordCount < 5000) price *= 1.13;
      else if (wordCount >= 5000) price *= 1.17;
    }

    // Deadline Multiplier
    let deadlineMult = 1.0;
    const matchedUrg = apiUrgencies.find(
      (urg: any) => String(urg.value) === String(selectedDeadline)
    );
    if (matchedUrg && matchedUrg.multiplier) {
      deadlineMult = Number(matchedUrg.multiplier);
    } else {
      const valStr = String(selectedDeadline).toLowerCase().trim();
      let days = 3;
      if (valStr.includes("12h")) days = 0.5;
      else if (valStr.includes("24h") || valStr === "1" || valStr === "1d" || valStr.includes("1 day")) days = 1;
      else if (valStr === "2" || valStr === "2d" || valStr.includes("2 day")) days = 2;
      else if (valStr === "3" || valStr === "3d" || valStr.includes("3 day")) days = 3;
      else if (valStr === "4" || valStr === "4d" || valStr.includes("4 day")) days = 4;
      else if (valStr === "5" || valStr === "5d" || valStr.includes("5 day")) days = 5;
      else if (valStr === "7" || valStr === "7d" || valStr.includes("7 day")) days = 7;
      else if (valStr === "10" || valStr === "10d" || valStr.includes("10 day")) days = 10;
      else {
        const parsed = parseInt(valStr.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsed) && parsed > 0) days = parsed;
      }

      if (days <= 0.5) deadlineMult = 2.2;
      else if (days <= 1) deadlineMult = 1.8;
      else if (days <= 2) deadlineMult = 1.5;
      else if (days <= 3) deadlineMult = 1.35;
      else if (days <= 5) deadlineMult = 1.2;
      else if (days <= 7) deadlineMult = 1.1;
      else if (days <= 10) deadlineMult = 1.05;
      else deadlineMult = 1.0;
    }

    price *= deadlineMult;
    
    // Default Service multiplier (mimicking order page 1.1 for dissertation etc)
    const serviceSlug = (selectedService || "").toLowerCase();
    if (
      serviceSlug.includes("dissertation") ||
      serviceSlug.includes("thesis") ||
      serviceSlug.includes("research")
    ) {
      price *= 1.1;
    }

    return Number(price.toFixed(2));
  }, [wordCount, apiBasePricePerWord, apiWordCounts, apiUrgencies, selectedDeadline, selectedService]);

  const basePrice = calculatedBasePrice;
  const discountAmount = Number((basePrice * 0.40).toFixed(2));
  const finalPrice = Number((basePrice - discountAmount).toFixed(2));

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const OFFERS = [
    {
      name: "First Order Offer",
      desc: "For new customers only",
      icon: Gift,
      discount: "40% OFF",
      code: "FIRST40",
      applicableOn: "All Services",
      minOrder: "£20",
      validTill: "30 Sept 2026",
      color: "rose",
    },
    {
      name: "Special Deal",
      desc: "Limited time offer",
      icon: Gift,
      discount: "20% OFF",
      code: "SPECIAL20",
      applicableOn: "All Services",
      minOrder: "£40",
      validTill: "30 Sept 2026",
      color: "orange",
    },
    {
      name: "Student Deal",
      desc: "On selected services",
      icon: GraduationCap,
      discount: "10% OFF",
      code: null, // Comming soon
      applicableOn: "Essay, Coursework, Report, Case Study",
      minOrder: "£30",
      validTill: "TBA",
      color: "blue",
    },
  ];

  return (
    <main className="w-full bg-surface-white">
      {/* Hero Section */}
      <section className="bg-[url('/new-home-page-images/ain-hero-bg.webp')] max-md:!bg-[#faf5ff] max-md:!bg-none bg-cover bg-center md:bg-[50%_40%] bg-no-repeat pt-12 pb-16 px-4 md:px-8 font-sans overflow-hidden relative border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="py-2 mb-6">
            <Breadcrumb items={[{ label: "Discounts & Offers" }]} />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <AnimateIn variant="fadeUp" className="w-full lg:w-1/2 text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-navy-900 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-6 shadow-md">
              <GraduationCap className="w-4 h-4 text-primary-500" />
              Exclusive Student Offer
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-[900] text-[#0f1b3d] tracking-tight font-heading leading-tight mb-4">
              Get Up to <span className="text-primary-500">40% Off</span><br />
              Your Assignment Help
            </h1>
            
            <p className="text-text-muted mt-4 text-base md:text-lg leading-relaxed max-w-xl font-medium">
              Premium academic support at a student-friendly price. Essays, coursework, dissertations, reports and more.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                variant="orangeOpen"
                size="md"
                icon={true}
                data-open-quote-modal="true"
                className="w-full sm:w-auto"
              >
                GET MY DISCOUNT
              </Button>
              <Button 
                variant="blueClose"
                size="md"
                data-open-quote-modal="true"
                className="w-full sm:w-auto border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-50"
              >
                CALCULATE MY PRICE
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> UK Based Team
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> 100% Confidential
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Free Turnitin Report
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Unlimited Revisions
              </div>
            </div>
          </AnimateIn>
          {/* Floating Coupon Card on Right Side */}
          <AnimateIn variant="scaleUp" className="w-full lg:w-1/2 relative z-0 mt-8 lg:mt-0 flex justify-center lg:justify-end">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-navy-900 w-full max-w-[340px] text-center">
              <div className="text-navy-900 font-extrabold text-sm uppercase tracking-widest mb-3">Student Offer</div>
              <div className="text-5xl font-black text-primary-500 mb-1 leading-none">40<span className="text-2xl">%</span></div>
              <div className="text-2xl font-black text-primary-500 mb-3">OFF</div>
              <div className="text-sm text-gray-500 font-semibold mb-6">On Your First Order</div>
              
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6">
                <div className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-1">Use Code:</div>
                <div className="text-primary-500 font-black text-xl tracking-wider">FIRST40</div>
              </div>
              
              <Button 
                variant="blueOpen"
                size="md"
                fullWidth
                onClick={() => handleCopy("FIRST40")}
                className="bg-navy-900 hover:bg-navy-800 text-white rounded-xl transition-colors"
              >
                {copiedCode === "FIRST40" ? (
                  <><Check className="w-5 h-5 mr-2" /> COPIED!</>
                ) : (
                  <>COPY CODE <Copy className="w-5 h-5 ml-2" /></>
                )}
              </Button>
            </div>
          </AnimateIn>
        </div>
        </div>
      </section>

      {/* Savings Calculator Section */}
      <SectionContainer background="lavender" className="!py-8">
        <div className="text-center mb-8">
          <h2 className="text-[22px] md:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading mb-2">
            See How Much You Can Save
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            {/* Form Fields */}
            <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Type of Work</label>
                <select 
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Essay">Essay</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Dissertation">Dissertation</option>
                  <option value="Coursework">Coursework</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Academic Level</label>
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="University">University</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Word Count</label>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-[46px]">
                  <button onClick={() => setWordCount(Math.max(250, wordCount - 250))} className="px-4 h-full text-gray-600 hover:bg-gray-100 hover:text-primary-500 font-bold text-lg transition-colors flex items-center justify-center border-r border-gray-200">-</button>
                  <div className="flex-1 text-center font-bold text-sm text-gray-800">
                    {wordCount.toLocaleString()} Words
                  </div>
                  <button onClick={() => setWordCount(wordCount + 250)} className="px-4 h-full text-gray-600 hover:bg-gray-100 hover:text-primary-500 font-bold text-lg transition-colors flex items-center justify-center border-l border-gray-200">+</button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Deadline</label>
                <select 
                  value={selectedDeadline}
                  onChange={(e) => setSelectedDeadline(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {apiUrgencies.length > 0 ? (
                    apiUrgencies.map((u) => (
                      <option key={u.id || u.value} value={u.value}>{u.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="7">7 Days</option>
                      <option value="3">3 Days</option>
                      <option value="1">24 Hours</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Price Display */}
            <div className="w-full lg:w-2/5 flex flex-col sm:flex-row items-center justify-between bg-gray-50 rounded-2xl p-6 border border-gray-100 gap-4 sm:gap-0">
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Original Price</div>
                  <div className="text-2xl font-bold text-gray-400 line-through">£{basePrice.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">Discount (40%)</div>
                  <div className="text-2xl font-bold text-green-600">- £{discountAmount.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="text-center sm:border-l sm:border-gray-200 sm:pl-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1">YOU PAY</div>
                <div className="text-4xl font-bold text-primary-500">£{finalPrice.toFixed(2)}</div>
                <div className="mt-2 bg-navy-900 text-white text-xs font-bold py-1 px-3 rounded-full inline-block">
                  You Save £{discountAmount.toFixed(2)}
                </div>
              </div>
            </div>

          </div>

          {isSuccess ? (
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-2">Thank you for your request!</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your discount request has been successfully registered. Our team will contact you shortly with the final discounted quote!
              </p>
              <Button variant="blueOpen" className="mt-6" onClick={() => setIsSuccess(false)}>
                Calculate Another
              </Button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <p className="text-sm text-gray-500 font-medium text-center sm:text-left">
                No obligation • Quick quote
              </p>
              <Link href="/order" className="w-full sm:w-auto">
                <Button 
                  variant="blueOpen"
                  size="md"
                  icon={true}
                  className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white"
                >
                  GET MY DISCOUNT
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SectionContainer>

      {/* Offer Cards Section */}
      <SectionContainer background="white" className="!py-8">
        <div className="text-center mb-10">
          <h2 className="text-[22px] md:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading mb-2">
            Choose the Offer That Works for You
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {OFFERS.slice(0, 3).map((offer, idx) => (
            <StaggerItem key={idx}>
              <div className={`relative bg-white rounded-3xl p-6 md:p-8 border ${idx === 0 ? 'border-2 border-primary-100 shadow-lg' : 'border-gray-200 shadow-sm'} hover:shadow-xl transition-all duration-300 text-center h-full flex flex-col group hover:-translate-y-1`}>
                {idx === 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                
                {/* Dynamically assign color tailwind classes here for cards */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform ${
                    offer.color === 'rose' ? 'bg-rose-50 text-rose-500' :
                    offer.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                    offer.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    offer.color === 'green' ? 'bg-green-50 text-green-600' :
                    'bg-gray-50 text-gray-600'
                  }`}
                >
                  <offer.icon className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{offer.name}</h3>
                <div className="text-2xl md:text-3xl font-extrabold text-navy-900 mb-2">{offer.discount}</div>
                <p className="text-sm text-gray-600 font-medium mb-8">{offer.desc}</p>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase">Use Code:</span>
                    {offer.code ? (
                      <span className={`font-bold border px-3 py-1 rounded-md text-sm tracking-widest whitespace-nowrap ${
                        offer.color === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-500' :
                        offer.color === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-500' :
                        offer.color === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                        offer.color === 'green' ? 'border-green-200 bg-green-50 text-green-600' :
                        'border-gray-200 bg-gray-50 text-gray-600'
                      }`}>
                        {offer.code}
                      </span>
                    ) : (
                      <span className="font-bold border border-gray-200 bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-sm tracking-widest whitespace-nowrap">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  
                  {offer.code ? (
                    idx === 0 ? (
                      <Button 
                        variant="orangeOpen"
                        size="md"
                        icon={true}
                        fullWidth
                        data-open-quote-modal="true"
                      >
                        USE THIS OFFER
                      </Button>
                    ) : (
                      <a href="/order" className="block w-full">
                        <Button 
                          variant="blueOpen"
                          size="md"
                          icon={true}
                          fullWidth
                        >
                          USE THIS OFFER
                        </Button>
                      </a>
                    )
                  ) : (
                    <Button 
                      variant="blueClose"
                      size="md"
                      fullWidth
                      disabled
                      className="bg-gray-100 text-gray-400 cursor-not-allowed"
                    >
                      UNAVAILABLE
                    </Button>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-8 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Only one discount code can be applied per order.
        </div>
      </SectionContainer>

      {/* Table Section */}
      <SectionContainer className="!py-8 bg-gray-50">
        <div className="text-center mb-10">
          <h2 className="text-[22px] md:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading mb-2">
            All Current Offers & Discounts
          </h2>
          <p className="text-gray-500 mt-3 text-base md:text-lg">Explore all the exciting discounts we offer for students.</p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
          
          {/* Scroll Indicator for mobile */}
          <div className="md:hidden absolute right-0 top-14 bottom-16 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          <div className="md:hidden text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 border-b border-gray-100 py-1">
            <span className="inline-block animate-pulse">← Swipe to see more →</span>
          </div>

          <div className="overflow-x-auto w-full pb-2">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-5 px-6">Offer Name</th>
                  <th className="py-5 px-6 text-center">Discount</th>
                  <th className="py-5 px-6 text-center">Code</th>
                  <th className="py-5 px-6">Applicable On</th>
                  <th className="py-5 px-6 text-center">Min. Order</th>
                  <th className="py-5 px-6 text-center">Valid Till</th>
                  <th className="py-5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {OFFERS.map((offer, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gray-50 text-navy-900">
                          <offer.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-1">{offer.name}</div>
                          <div className="text-xs text-gray-500">{offer.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="font-black text-lg text-primary-500">{offer.discount}</span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {offer.code ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="border border-gray-200 bg-gray-50 text-gray-800 font-bold px-3 py-1 rounded text-sm tracking-wider whitespace-nowrap">
                            {offer.code}
                          </span>
                          <button onClick={() => handleCopy(offer.code!)} className="text-gray-400 hover:text-primary-500 transition-colors shrink-0" title="Copy Code">
                            {copiedCode === offer.code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ) : (
                        <span className="border border-gray-200 bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded text-xs tracking-wider whitespace-nowrap">
                          COMING SOON
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-sm font-medium text-gray-700 max-w-[150px] leading-tight">
                        {offer.applicableOn}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center font-bold text-gray-700">{offer.minOrder}</td>
                    <td className="py-5 px-6 text-center text-sm font-medium text-gray-500 whitespace-nowrap">{offer.validTill}</td>
                    <td className="py-5 px-6 text-center">
                      {offer.code ? (
                        idx === 0 ? (
                          <Button 
                            variant="orangeOpen"
                            size="sm"
                            data-open-quote-modal="true"
                            className="w-full whitespace-nowrap"
                          >
                            USE CODE
                          </Button>
                        ) : (
                          <a href="/order" className="block w-full">
                            <Button 
                              variant="blueOpen"
                              size="sm"
                              className="w-full whitespace-nowrap"
                            >
                              USE CODE
                            </Button>
                          </a>
                        )
                      ) : (
                        <Button 
                          variant="blueClose"
                          size="sm"
                          disabled
                          className="w-full whitespace-nowrap bg-gray-200 text-gray-400"
                        >
                          UNAVAILABLE
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 border-t border-gray-100 p-4 text-center text-xs text-gray-500 flex justify-center items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Terms and conditions apply to all offers. Offers cannot be combined.
          </div>
        </div>
      </SectionContainer>

      {/* Long Content & FAQ Section */}
      <SectionContainer background="white" className="!py-16">
        <div className="text-center mb-8">
          <h2 className="text-[22px] md:text-[28px] font-[900] text-[#0f1b3d] tracking-tight font-heading mb-2">
            More About Our Academic Discounts
          </h2>
        </div>
        
        <ReadMoreContent />
        
        <div className="mt-16">
          <FaqAccordion 
            title="Frequently Asked Questions About Discounts"
            description="Find answers to common questions about applying codes, eligibility, and savings."
            faqs={DISCOUNT_FAQS}
            containerClassName="py-0"
          />
        </div>
      </SectionContainer>

      {/* Bottom CTA Banner */}
      <SectionContainer background="navy" className="!py-6 relative overflow-hidden">
        {/* Abstract shapes for background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          
          {/* Left Side: Graphic / Image */}
          <div className="w-full md:w-1/4 flex justify-center md:justify-start">
             <div className="w-40 h-40 md:w-56 md:h-56 relative rotate-6 hover:rotate-0 transition-transform duration-300">
               <img 
                 src="/assets/media/homepage/offer.png" 
                 alt="Gift Box" 
                 className="w-full h-full object-contain drop-shadow-xl" 
               />
             </div>
          </div>
          
          {/* Middle: Text Content */}
          <div className="w-full md:w-2/4 text-center md:text-left text-white space-y-4">
            <h2 className="text-[22px] md:text-[28px] font-[900] text-white tracking-tight font-heading mb-3 whitespace-nowrap md:whitespace-normal xl:whitespace-nowrap">
              Ready to Save on Your Assignment?
            </h2>
            <p className="text-blue-100 text-base mb-6 max-w-lg mx-auto md:mx-0">
              Get your student discount and see your personalised price before you order.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="orangeOpen"
                size="md"
                icon={true}
                data-open-quote-modal="true"
                className="shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)]"
              >
                GET MY DISCOUNT
              </Button>
            </div>
          </div>
          
          {/* Right Side: Trust Badges / Stats */}
          <div className="w-full md:w-1/4 flex flex-col items-center md:items-end text-right">
             <div className="bg-navy-800 border border-navy-700 rounded-2xl p-4 shadow-lg text-center w-full max-w-[200px]">
                <div className="text-primary-400 font-bold text-xs uppercase mb-1">TRUSTED BY</div>
                <div className="text-white font-black text-3xl mb-1">10,000+</div>
                <div className="flex justify-center gap-1 mb-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="text-gray-400 text-[10px] uppercase">UK STUDENTS</div>
             </div>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-navy-800/50 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-blue-200">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400" /> No Obligation</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400" /> Quick Quote</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400" /> 100% Confidential</div>
        </div>
      </SectionContainer>
    </main>
  );
}

// Need to import Star icon since I added it for the trust badge
import { Star } from "lucide-react";
