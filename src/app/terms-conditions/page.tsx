"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  Scale,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function TermsConditionsPage() {
  return (
    <div className="font-sans text-gray-800 bg-[#fbfbfe] min-h-screen pb-16">
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
              <span className="text-white">Terms & Conditions</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
              Terms & Conditions
            </h1>
            <p className="text-xs md:text-sm text-purple-100 font-semibold max-w-xl">
              Please read these terms and conditions carefully before using our
              services.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* 2. Content Section */}
      <AnimateIn variant="fadeUp" delay={0.15} as="main" className="max-w-[1000px] mx-auto px-6 mt-8 md:mt-12 block">
        <div className="bg-white rounded-3xl border border-gray-150/70 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-6 md:p-10 flex flex-col gap-8 text-left">
          <section className="flex flex-col gap-3">
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-600 font-medium">
              Welcome to Assignment In Need. By accessing or using our website
              and services, you agree to be bound by these Terms and Conditions.
              Please read them carefully. If you do not agree with any part of
              these Terms, you must not use our services.
            </p>
          </section>

          {/* Section 1 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                1.
              </span>
              Definitions
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                {
                  title: "Company, We, Our, Us",
                  desc: "Refers to Assignment In Need.",
                },
                {
                  title: "Client, You, Your",
                  desc: "Means any individual or entity using our Services.",
                },
                {
                  title: "Services",
                  desc: "Refers to academic support, research assistance, writing guidance, and editing services.",
                },
                {
                  title: "Website",
                  desc: "Means the website located at www.assignmentinneed.co.uk.",
                },
                {
                  title: "Order",
                  desc: "Refers to a request for Services placed by the Client, specifying the work scope.",
                },
                {
                  title: "Service Deliverable",
                  desc: "Refers to the written material or output provided to the Client.",
                },
                {
                  title: "Revision",
                  desc: "A request for modifications based on the original Order instructions.",
                },
                {
                  title: "Support Team",
                  desc: "The department responsible for assisting Clients with inquiries.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-150 p-4 rounded-2xl bg-[#fbfcff]/30 text-left"
                >
                  <h4 className="font-bold text-gray-900 text-xs mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                2.
              </span>
              Use of Services
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <ul className="text-xs text-gray-500 font-semibold space-y-3 leading-relaxed">
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  2.1 Eligibility
                </strong>
                By using our Services, you confirm that you are at least 18
                years of age or have the legal capacity to enter into a binding
                agreement in the United Kingdom, or are using the Services under
                the supervision of a parent or legal guardian with such
                capacity.
              </li>
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  2.2 Academic Integrity
                </strong>
                Our Services are provided solely for academic support, research,
                and reference purposes. We strongly emphasise the importance of
                academic integrity and ethical conduct. The Service Deliverables
                are intended to serve as models or guides to aid your learning
                process. You are solely responsible for ensuring that any work
                you submit is your own original work and properly cited in
                accordance with UK academic standards. We do not endorse or
                facilitate plagiarism or any other form of academic dishonesty.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                3.
              </span>
              Ordering Process
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <ul className="text-xs text-gray-500 font-semibold space-y-3 leading-relaxed">
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  3.1 Placing an Order
                </strong>
                To place an Order, you must complete the order form available on
                our Website and provide all necessary information accurately and
                completely, including the subject, academic level, deadline,
                specific instructions, and any required materials. It is your
                responsibility to ensure that all information provided is clear,
                accurate, and sufficient for us to fulfil your request in the
                United Kingdom.
              </li>
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  3.2 Payment
                </strong>
                Full payment for the Services is required at the time of placing
                the Order. We accept payments through the methods specified on
                our Website. By placing an Order, you agree to pay the total
                price indicated. Prices are as displayed on our Website and may
                be subject to change without notice, but changes will not affect
                Orders already placed.
              </li>
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  3.3 Order Confirmation
                </strong>
                Upon successful payment, you will receive an email confirmation
                of your Order, including an order reference number and a summary
                of the details. This confirmation constitutes acceptance of your
                Order and forms a binding agreement between you and the Company,
                subject to these Terms and Conditions.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                4.
              </span>
              Revisions and Refunds
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <ul className="text-xs text-gray-500 font-semibold space-y-3 leading-relaxed">
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  4.1 Revisions
                </strong>
                We offer free revisions based on the original Order
                instructions. Requests for revisions that deviate from the
                initial instructions may be subject to additional charges, at
                our sole discretion. We strive to address revision requests
                promptly and effectively for clients in the UK.
              </li>
              <li>
                <strong className="text-gray-800 text-sm block mb-1">
                  4.2 Refunds
                </strong>
                Our refund policy is outlined separately on our Website. Refund
                requests will be considered on a case-by-case basis, taking into
                account factors such as non-delivery (due to our error),
                significant quality issues that cannot be reasonably rectified
                by revision, and technical errors resulting in double payment.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                5.
              </span>
              Privacy and Data Protection
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We are committed to protecting your privacy and handling your
              personal data in accordance with applicable UK data protection
              laws, including the UK General Data Protection Regulation (UK
              GDPR). Our Privacy Policy provides detailed information about how
              we collect, use, store, and protect your personal data. By using
              our Services, you consent to the processing of your personal data
              as described in our Privacy Policy.
            </p>
          </section>

          {/* Section 6 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                6.
              </span>
              Intellectual Property
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              All content on our Website, including text, graphics, logos, and
              software, is the property of Assignment In Need or its licensors
              and is protected by UK copyright and other intellectual property
              laws. The Service Deliverables provided to you are intended for
              your personal, non-commercial use for research and reference
              purposes only. You acknowledge that the Company retains copyright
              in the Service Deliverables.
            </p>
          </section>

          {/* Section 7 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                7.
              </span>
              Limitation of Liability
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              To the maximum extent permitted by law in the United Kingdom, the
              Company shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or in connection
              with your use of our Services or the Service Deliverables. Our
              total liability to you for any claim arising out of or in
              connection with these Terms and Conditions or our Services shall
              not exceed the amount you paid for the specific Service in
              question.
            </p>
          </section>

          {/* Section 8 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                8.
              </span>
              Termination
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We reserve the right to suspend or terminate your access to our
              Services at any time, with or without notice, if we believe you
              have violated these Terms and Conditions, engaged in illegal or
              unethical activities, or for any other reason at our sole
              discretion.
            </p>
          </section>

          {/* Section 9 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                9.
              </span>
              Amendments
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              We may update or modify these Terms and Conditions at any time
              without prior notice. Any changes will be effective upon the
              posting of the revised Terms on our Website with an updated
              &ldquo;Date of Effectiveness.&rdquo; Your continued use of our
              Services after the posting of changes constitutes your acceptance
              of the revised Terms.
            </p>
          </section>

          {/* Section 10 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                10.
              </span>
              Governing Law and Jurisdiction
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />
            <p className="text-[15px] leading-relaxed text-gray-600 font-medium">
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of England and Wales. Any dispute arising
              out of or in connection with these Terms and Conditions shall be
              subject to the exclusive jurisdiction of the courts of England and
              Wales.
            </p>
          </section>

          {/* Section 11 */}
          <section className="flex flex-col gap-4 border-t border-gray-100 pt-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2.5">
              <span className="text-[#3f159a] font-black text-lg select-none">
                11.
              </span>
              Contact Details
            </h2>
            <div className="h-0.5 w-12 bg-purple-100 rounded-full mb-2" />

            <div className="bg-[#fcfbff] border border-purple-100 rounded-2xl p-5 flex flex-col gap-3 max-w-lg">
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                  Email Support
                </span>
                <a
                  href="mailto:info@assignmentinneed.com"
                  className="text-gray-800 font-bold text-sm"
                >
                  info@assignmentinneed.com
                </a>
              </div>
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1 border-t border-gray-100 pt-3">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                  Phone Support
                </span>
                <span className="text-gray-800 font-bold text-sm">
                  +44 78262 33106
                </span>
              </div>
              <div className="flex flex-col text-xs font-semibold text-gray-500 gap-1 border-t border-gray-100 pt-3">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">
                  Registered Office
                </span>
                <span className="text-gray-800 font-bold text-sm leading-relaxed">
                  International House, Constance Street, London E16, United
                  Kingdom
                </span>
              </div>
            </div>
          </section>
        </div>
      </AnimateIn>
    </div>
  );
}
