"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Shield, Clock, Lock, CheckCircle2 } from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { buildPageSchema } from "@/lib/data";

export default function PrivacyPolicyPage() {
  const dataRetention = [
    {
      type: "Contact Info",
      purpose: "Order updates & support",
      retention: "6 years (Legal/Tax)",
    },
    {
      type: "Order Details",
      purpose: "Service delivery",
      retention: "Duration of the project + 2 years",
    },
    {
      type: "Payment Data",
      purpose: "Secure transactions",
      retention: "Handled by 3rd party (Stripe/PayPal)",
    },
    {
      type: "Technical Data",
      purpose: "Website optimisation",
      retention: "26 months (Google Analytics)",
    },
  ];

  return (
    <div className="font-sans text-gray-800 bg-[#fbfbfe] min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPageSchema([], false), null, 2).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      {/* 1. Header Hero Banner */}
      <section className="relative w-full bg-gradient-to-r from-[#3f159a] to-[#250d5e] text-white py-12 md:py-16 overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-6 text-left relative z-10">
          <AnimateIn variant="fadeUp">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Privacy Policy</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-xs md:text-sm text-purple-100 font-semibold max-w-xl">
              At Assignment In Need, we prioritise the security and privacy of our students and clients.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* 2. Content Section */}
      <AnimateIn variant="fadeUp" delay={0.15} as="main" className="max-w-[1000px] mx-auto px-6 mt-8 md:mt-12 block">
        <div className="bg-white rounded-3xl border border-gray-150/70 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 md:p-10 flex flex-col gap-8 text-left">
          
          {/* Section 1 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">1.</span>
              Introduction & Who We Are
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              At Assignment In Need, we prioritise the security and privacy of our students and clients. This policy outlines how we handle your personal data in strict compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fbfcff] border border-purple-100/50 p-4 rounded-2xl mt-2">
              <div className="flex flex-col text-xs font-bold text-gray-700">
                <span className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-[9px]">Website</span>
                <a href="https://www.assignmentinneed.co.uk/" className="text-[#3f159a] hover:underline">
                  www.assignmentinneed.co.uk
                </a>
              </div>
              <div className="flex flex-col text-xs font-bold text-gray-700">
                <span className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-[9px]">Data Controller</span>
                <span className="text-gray-900">Assignment In Need Ltd.</span>
              </div>
              <div className="flex flex-col text-xs font-bold text-gray-700">
                <span className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-[9px]">Location</span>
                <span className="text-gray-900">London, United Kingdom</span>
              </div>
            </div>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium mt-2">
              By using our Services, you acknowledge the practices described in this policy. We believe in &ldquo;Privacy by Design,&rdquo; meaning we only collect what is necessary to help you succeed.
            </p>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">2.</span>
              At-a-Glance: Data Collection Summary
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            
            {/* Custom styled table with bold borders */}
            <div className="overflow-x-auto rounded-2xl border border-gray-950 mt-2">
              <table className="min-w-full divide-y divide-gray-950">
                <thead className="bg-[#fbfcff]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-950 uppercase tracking-wider border-r border-gray-950">
                      Data Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-950 uppercase tracking-wider border-r border-gray-950">
                      Purpose
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-950 uppercase tracking-wider">
                      Retention Period
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-950">
                  {dataRetention.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950 border-r border-gray-950">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium border-r border-gray-950">
                        {item.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {item.retention}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">3.</span>
              Information We Collect
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              To provide expert academic assistance, we collect two categories of information:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="border border-gray-150 p-5 rounded-2xl flex flex-col gap-3">
                <h3 className="font-bold text-gray-900 text-[15px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Personally Identifiable Information (PII)
                </h3>
                <ul className="text-xs text-gray-500 font-semibold space-y-2 text-left">
                  <li><strong>• Identity & Contact:</strong> Name, email address, phone number, and mailing address.</li>
                  <li><strong>• Academic Data:</strong> Assignment requirements, subject matter, deadlines, and uploaded reference files.</li>
                  <li><strong>• Communication:</strong> Logs of live chats, support tickets, and email exchanges.</li>
                  <li><strong>• Transaction Data:</strong> Billing history and order status (we do not store full credit card numbers).</li>
                </ul>
              </div>

              <div className="border border-gray-150 p-5 rounded-2xl flex flex-col gap-3">
                <h3 className="font-bold text-gray-900 text-[15px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  Technical & Usage Data (Non-PII)
                </h3>
                <ul className="text-xs text-gray-500 font-semibold space-y-2 text-left">
                  <li><strong>• Device Info:</strong> Browser type, IP address (for UK security monitoring), and operating system.</li>
                  <li><strong>• Usage Patterns:</strong> Clickstream data, pages viewed, and time spent on site via cookies.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">4.</span>
              How We Use Your Data
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We process your data based on <strong>Contractual Necessity, Legitimate Interests,</strong> or <strong>Explicit Consent:</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
              {[
                { title: "Service Delivery", desc: "To assign the right expert to your task and deliver quality work." },
                { title: "Trust & Safety", desc: "To prevent academic fraud and secure our platform." },
                { title: "Customer Support", desc: "To provide 24/7 assistance to our UK and international students." },
                { title: "Marketing", desc: "With your consent, we send discounts and academic tips (Opt-out anytime)." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50/20 border border-purple-100/50 rounded-2xl text-left">
                  <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">5.</span>
              Secure Data Sharing
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We do <strong>not</strong> sell your personal data. Sharing is strictly limited to:
            </p>
            <ol className="text-xs text-gray-500 font-semibold space-y-2 mt-2 leading-relaxed">
              <li><strong className="text-gray-800">1. Academic Experts:</strong> Only the specific details required to complete your assignment.</li>
              <li><strong className="text-gray-800">2. Service Providers:</strong> Trusted partners for payment processing (e.g., PayPal) and website hosting.</li>
              <li><strong className="text-gray-800">3. Legal Compliance:</strong> If required by UK law or to protect our legal rights.</li>
            </ol>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">6.</span>
              Your Rights Under UK GDPR
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium mb-2">
              As a user in the United Kingdom, you have significant control over your data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {["Right to Access", "Right to Rectification", "Right to Erasure", "Right to Object", "Data Portability"].map((right, idx) => (
                <div key={idx} className="bg-white border border-gray-150 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-900">{right}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] leading-relaxed text-gray-500 font-semibold mt-4">
              To exercise these rights: Email our Data Protection team at <a href="mailto:info@assignmentinneed.com" className="text-[#3f159a] hover:underline font-bold">info@assignmentinneed.com</a>. We respond to all requests within 30 days. Read more about restricting processing on the <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer" className="text-[#3f159a] hover:underline font-bold">ICO official website</a>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">7.</span>
              Security Measures
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We employ industry-standard security to protect your academic integrity and personal identity:
            </p>
            <ul className="text-xs text-gray-500 font-semibold space-y-2 mt-2 leading-relaxed">
              <li><strong>• SSL/TLS Encryption:</strong> All data transmitted is encrypted.</li>
              <li><strong>• Firewalls & Access Control:</strong> Internal data access is restricted to authorised personnel only.</li>
              <li><strong>• Anonymity:</strong> Our writers do not see your full identity unless necessary for the task.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">8.</span>
              Cookies & Tracking
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We use cookies to improve your experience. You can manage these via your browser settings.
            </p>
            <ul className="text-xs text-gray-500 font-semibold space-y-2 mt-2 leading-relaxed">
              <li><strong>• Essential Cookies:</strong> Required for logging into your account.</li>
              <li><strong>• Performance Cookies:</strong> Help us understand which academic subjects are most in demand.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="flex flex-col gap-4 border-t border-gray-100 pt-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">9.</span>
              Contact Our Privacy Team
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            
            <div className="bg-[#fcfbff] border border-purple-100 rounded-2xl p-5 flex flex-col gap-3 max-w-lg">
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Email Address</span>
                <a href="mailto:info@assignmentinneed.com" className="text-gray-800 font-bold text-sm">
                  info@assignmentinneed.com
                </a>
              </div>
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1 border-t border-gray-100 pt-3">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Phone Support</span>
                <span className="text-gray-800 font-bold text-sm">+44 78262 33106</span>
              </div>
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1 border-t border-gray-100 pt-3">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Registered Office</span>
                <span className="text-gray-800 font-bold text-sm leading-relaxed">
                  International House, Constance Street, London E16, United Kingdom
                </span>
              </div>
            </div>
          </section>

        </div>
      </AnimateIn>
    </div>
  );
}
