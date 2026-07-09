"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Scale, 
  Stethoscope, 
  BarChart3, 
  Brain, 
  Settings, 
  Code2,
  Calculator,
  TrendingUp,
  BookOpen,
  Megaphone,
  HeartPulse,
  Clock,
  Target,
  Pencil,
  Timer,
  GraduationCap,
  Download,
  Quote,
  Award,
  ShoppingCart,
  RefreshCw,
  Zap,
  DollarSign,
  ChevronDown
} from "lucide-react";

const CATEGORIES = [
  { name: "Accounting", count: "1,250", type: "letter", badge: "A", category: "Account" },
  { name: "Business", count: "980", type: "icon", icon: Briefcase, category: "Business" },
  { name: "Law", count: "750", type: "icon", icon: Scale, category: "law" },
  { name: "Nursing", count: "620", type: "icon", icon: Stethoscope, category: "Nursing" },
  { name: "Marketing", count: "540", type: "icon", icon: BarChart3, category: "marketing" },
  { name: "Psychology", count: "420", type: "icon", icon: Brain, category: "psychology" },
  { name: "Engineering", count: "380", type: "icon", icon: Settings, category: "Engineering" },
  { name: "Computer Science", count: "340", type: "icon", icon: Code2, category: "Computer-Science" },
];

const SUBJECTS = [
  { name: "Accounting", count: "152", badge: "A", icon: Calculator, category: "Account" },
  { name: "Business", count: "87", badge: "B", icon: Briefcase, category: "Business" },
  { name: "Economics", count: "45", badge: "E", icon: TrendingUp, category: "Economic" },
  { name: "Law", count: "60", badge: "L", icon: BookOpen, category: "law" },
  { name: "Marketing", count: "65", badge: "M", icon: Megaphone, category: "marketing" },
  { name: "Nursing", count: "74", badge: "N", icon: HeartPulse, category: "Nursing" },
  { name: "Psychology", count: "81", badge: "P", icon: Brain, category: "psychology" },
  { name: "History", count: "30", badge: "H", icon: Clock, category: "History" },
];

const BENEFITS = [
  { title: "Understand Structure", desc: "Learn the perfect format and structure for your assignments.", icon: Target },
  { title: "Learn Referencing", desc: "See how proper referencing is done in academic writing.", icon: BookOpen },
  { title: "Improve Writing Style", desc: "Enhance your writing style and academic expression.", icon: Pencil },
  { title: "Save Research Time", desc: "Get a clear idea and save hours of research and effort.", icon: Timer },
  { title: "Better Understanding", desc: "Improve your subject knowledge with real examples.", icon: GraduationCap },
  { title: "100% Free Access", desc: "All samples are completely free to download and access.", icon: Download },
];

const TESTIMONIALS = [
  {
    text: "The assignment samples helped me understand the structure and referencing style perfectly. I scored 72% in my assignment!",
    name: "Sarah M.",
    university: "University of Leeds",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "The samples are well-written and easy to understand. They really improved my academic writing and confidence.",
    name: "James T.",
    university: "University of Manchester",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "I found exactly what I needed for my subject. The examples are updated and of high quality. Thank you!",
    name: "Emily R.",
    university: "King's College London",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const FAQS = [
  {
    question: "Is the work you provide 100% original?",
    answer: "Yes, all assignments we deliver are 100% original and written from scratch by our experts. We also provide a free plagiarism report to guarantee uniqueness.",
    icon: Award
  },
  {
    question: "How do I place an order?",
    answer: "You can place an order by filling out our quick order/quote form, specifying your requirements, academic level, and deadline, or you can directly chat with us for assistance.",
    icon: ShoppingCart
  },
  {
    question: "Can I request revisions?",
    answer: "Absolutely! We offer unlimited free revisions within 14-30 days of delivery if the final document does not meet your initial requirements.",
    icon: RefreshCw
  },
  {
    question: "What if I need my order urgently?",
    answer: "No problem! We have express experts who can tackle urgent tasks and deliver high-quality assignments in as little as 3 to 6 hours.",
    icon: Zap
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we have a clear refund policy. If we fail to deliver within the deadline or if the work fails to meet acceptable academic standards, you can request a refund.",
    icon: DollarSign
  }
];

export default function SamplesPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="w-full font-sans text-gray-800 bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-500 text-left">
        Home <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Samples</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 lg:pb-6 pt-2 flex flex-col lg:flex-row items-center justify-between text-left">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 z-0 lg:hidden flex justify-center items-center opacity-10 pointer-events-none">
          <img 
            src="/new-sample-img/hero1.png" 
            alt="" 
            className="w-[150%] max-w-none h-auto object-contain" 
            style={{ 
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)", 
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" 
            }}
          />
        </div>

        <div className="lg:w-1/2 relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            100% Free Samples
          </div>
          
          <h1 className="text-4xl lg:text-5xl text-gray-900 leading-tight mb-4">
            Free Assignment <br />
            <span className="text-purple-700 font-extrabold">Samples</span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-lg">
            Access high-quality assignment examples written by academic experts. Explore 10,000+ samples across 150+ subjects to understand structure, referencing and writing style.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              "100% Free Access",
              "Subject-Wise Samples",
              "Distinction-Level Quality",
              "10,000+ Free Samples",
              "UK Referencing Formats",
              "Updated Every Week"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:hidden">
            <a href="#browse-samples" className="bg-purple-700 text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-purple-800 transition flex-1">Browse Samples &rarr;</a>
            <a href="#" className="bg-white text-purple-700 border-2 border-purple-200 text-center px-6 py-3 rounded-lg font-bold hover:bg-purple-50 transition flex-1">Get Expert Help &rarr;</a>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 mt-12 lg:mt-0 relative justify-center z-10">
          <img 
            src="/new-sample-img/hero1.png" 
            alt="Free Samples Illustration" 
            className="w-[120%] lg:w-[130%] max-w-none h-auto object-contain scale-110 lg:scale-125 -translate-x-8 lg:-translate-x-16" 
            style={{ 
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 70%, transparent 100%)", 
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 70%, transparent 100%)" 
            }}
          />
        </div>
      </section>

      {/* Popular Categories Scroll */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Categories</h2>
        <p className="text-gray-500 mb-8">Explore samples from our most popular subjects</p>
        
        <div className="relative flex items-center justify-center">
          <button 
            onClick={() => scroll("left")}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-purple-700 absolute left-0 z-10"
          >
            &lt;
          </button>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 py-2 px-2 w-full lg:w-11/12 snap-x scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat, idx) => (
              <Link 
                key={idx}
                href={`/samples/${cat.category}`}
                className="flex-shrink-0 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 bg-white hover:border-purple-300 hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 group snap-start min-w-[160px]"
              >
                <div className="w-10 h-10 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                  {cat.type === "letter" ? (
                    cat.badge
                  ) : cat.icon ? (
                    <cat.icon className="w-5 h-5 text-purple-700 group-hover:text-white transition-colors" />
                  ) : null}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">{cat.name}</h4>
                  <p className="text-xs text-gray-500">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <button 
            onClick={() => scroll("right")}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-purple-700 absolute right-0 z-10"
          >
            &gt;
          </button>
        </div>
      </section>

      {/* Browse Samples By Subject */}
      <section id="browse-samples" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-[#fafaff] rounded-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Samples By Subject</h2>
          <p className="text-gray-500">Find free assignment samples by subject area</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS.map((sub, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
              onClick={() => {
                window.location.href = `/samples/${sub.category}`;
              }}
            >
              <div className="w-12 h-12 bg-purple-700 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 group-hover:-translate-y-1 group-hover:shadow-lg transition-all">
                {sub.badge}
              </div>
              <div className="absolute top-[40%] -translate-y-1/2 right-6 w-14 h-14 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                {sub.icon && <sub.icon className="w-6 h-6 text-purple-700 group-hover:text-white transition-colors" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-800 transition-colors text-left">{sub.name}</h3>
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded mt-2 flex w-fit">
                {sub.count} Samples
              </span>
              <Link 
                href={`/samples/${sub.category}`} 
                className="mt-6 pt-4 border-t border-purple-200 flex items-center justify-between font-bold btn-shutter-blue-close py-2 px-3 rounded-lg w-full text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                View Samples <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="#browse-samples" className="btn-shutter-blue-close inline-flex items-center font-bold py-2.5 px-6 rounded-lg">
            View All Subjects <span className="ml-2">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Why Students Use Our Samples */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Students Use Our Samples</h2>
        <p className="text-gray-500 mb-12">Our samples help you learn, understand and achieve better results</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
          {BENEFITS.map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center bg-purple-50 rounded-2xl p-2 lg:p-5 border border-purple-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group cursor-pointer hover:bg-purple-100"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-purple-600 text-2xl mb-4 shadow-sm group-hover:bg-purple-600 group-hover:text-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {item.icon && <item.icon className="w-7 h-7 text-purple-700 group-hover:text-white transition-colors" />}
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm lg:text-base group-hover:text-purple-800">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed px-2 group-hover:text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Success Stories</h2>
        <p className="text-gray-500 mb-12">Loved by thousands of students across the UK</p>

        <div className="relative flex items-center justify-center">
          <button className="hidden lg:flex w-12 h-12 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-gray-400 hover:text-purple-700 absolute -left-6 z-10">
            &lt;
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {TESTIMONIALS.map((test, idx) => (
              <div 
                key={idx}
                className="bg-[#fafaff] border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-purple-600 text-3xl mb-4 opacity-80 group-hover:text-purple-800 group-hover:scale-110 transform origin-left transition-all duration-300">
                    <Quote className="w-8 h-8 fill-current" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-800 transition-colors">
                    {test.text}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <img 
                    src={test.image} 
                    alt={test.name} 
                    className="w-12 h-12 rounded-full object-cover bg-gray-200 shadow-sm border border-gray-100 group-hover:ring-2 ring-purple-400 transition-all"
                  />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{test.name}</h5>
                    <p className="text-xs text-gray-500">{test.university}</p>
                    <div className="text-yellow-400 text-xs mt-1">★★★★★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="hidden lg:flex w-12 h-12 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-gray-400 hover:text-purple-700 absolute -right-6 z-10">
            &gt;
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-700"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-start text-left">
          <div className="lg:w-1/3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide mb-4">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-snug">
              Find Answers To <span className="text-purple-700">Common Questions</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              If you have any other questions, feel free to contact our support team.
            </p>
            <a href="/contact" className="btn-shutter-blue-close inline-flex items-center justify-center font-bold px-6 py-3 rounded-lg">
              Contact Us &rarr;
            </a>
          </div>

          <div className="lg:w-2/3 w-full space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="faq-item bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group hover:-translate-y-1"
              >
                <div 
                  className="faq-header flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 group-hover:rotate-12">
                      {faq.icon && <faq.icon className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />}
                    </div>
                    <span className="font-bold text-gray-900 text-sm md:text-base group-hover:text-purple-700 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-180" : ""}`} />
                </div>
                <div className={`faq-answer px-4 pb-4 pt-1 border-t border-gray-50 transition-all duration-300 ${openFaqIndex === idx ? "block animate-[fadeIn_0.3s_ease]" : "hidden"}`}>
                  <p className="text-xs text-gray-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </main>
  );
}
