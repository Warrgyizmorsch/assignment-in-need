"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const [subjects, setSubjects] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subject-pages");
        if (res.ok) {
          const payload = await res.json();
          if (
            (payload.success || payload.status === "success") &&
            Array.isArray(payload.data)
          ) {
            setSubjects(payload.data.slice(0, 6));
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchSubjects();
  }, []);

  return (
    <footer className="bg-[#0b1129] text-[#d1d5db] pt-16 px-8 pb-0 border-t border-[#1f2937] flex flex-col items-center">
      <div className="max-w-[1400px] w-full mx-auto pb-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2.2fr_2.5fr_2.5fr_1.5fr] gap-8">
        {/* Column 1: Brand */}
        <div className="flex flex-col items-start text-left">
          <Link
            href="/"
            className="inline-block bg-white p-1 rounded-lg max-h-[70px]"
          >
            <Image
              src="/assets/media/layout/ain-logo.webp"
              alt="Assignment IN NEED"
              width={180}
              height={62}
              style={{ width: "auto", height: "auto" }}
              className="max-h-[62px] object-contain"
            />
          </Link>
          <div className="mt-6 max-w-[320px] border-t border-white/5 pt-4 pb-4">
            <span className="text-[#9ca3af] text-[0.75rem] font-bold uppercase tracking-wider block mb-1.5">
              Disclaimer
            </span>
            <p className="text-[#9ca3af] text-[0.72rem] leading-relaxed m-0 font-normal">
              Assignment In Need provides writing and research material for guidance only, not for direct submission as original work. Students must follow their university's academic integrity and referencing policies. We accept no liability for how the material is used. To the extent permitted under UK law, we give no warranty on accuracy or suitability for any specific academic purpose.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=61564613120071"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center w-[38px] h-[38px] bg-white/10 text-white rounded-full no-underline transition-all duration-500 hover:bg-[#4f46e5] hover:-translate-y-0.5 hover:rotate-[360deg] text-[0.9rem]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3 0-5 2-5 5v2z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/assignmentinneedofficial/?hl=en"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center w-[38px] h-[38px] bg-white/10 text-white rounded-full no-underline transition-all duration-500 hover:bg-[#4f46e5] hover:-translate-y-0.5 hover:rotate-[360deg] text-[0.9rem]"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@Assignmentinneed-uk"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center w-[38px] h-[38px] bg-white/10 text-white rounded-full no-underline transition-all duration-500 hover:bg-[#4f46e5] hover:-translate-y-0.5 hover:rotate-[360deg] text-[0.9rem]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a
              href="https://in.pinterest.com/assignmentinneeduk/"
              aria-label="Pinterest"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex items-center justify-center w-[38px] h-[38px] bg-white/10 text-white rounded-full no-underline transition-all duration-500 hover:bg-[#4f46e5] hover:-translate-y-0.5 hover:rotate-[360deg] text-[0.9rem]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.993 3.993-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>



          {/* Secure Payment and Security Badges */}
          <div className="mt-8 flex flex-col gap-3.5">
            <span className="text-[#9ca3af] text-[0.75rem] font-bold uppercase tracking-wider">
              Secure Payment
            </span>

            {/* Payment card row */}
            <div className="flex flex-wrap gap-3 items-center">
              <img
                src="/images/badge-visa.png"
                alt="Visa"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-mastercard.png"
                alt="Mastercard"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-maestro.png"
                alt="Maestro"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-amex.png"
                alt="American Express"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-discover.png"
                alt="Discover"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
            </div>

            {/* Security badges row */}
            <div className="flex flex-wrap gap-3 items-center">
              <img
                src="/images/badge-dmca.png"
                alt="DMCA Protected"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-mcafee.png"
                alt="McAfee Secure"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
              <img
                src="/images/badge-gdpr.png"
                alt="GDPR Compliant"
                width="60"
                height="38"
                className="h-[38px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Group 1: Services & Subjects */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <p className="text-white text-[1.05rem] font-bold mb-6 mt-0">
              Services
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li>
                <Link
                  href="/essay-writing-help-services"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Essay Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/dissertation-writing-help-services"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Dissertation Help
                </Link>
              </li>
              <li>
                <Link
                  href="/assignment-writing-help-services"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Assignment Help
                </Link>
              </li>
              <li>
                <Link
                  href="/case-study-dissertation-help-uk"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Case Study Help
                </Link>
              </li>
              <li>
                <Link
                  href="/report-writing"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Report Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/proofreading-and-editing-writing-help"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Proofreading
                </Link>
              </li>
              <li>
                <Link
                  href="/dissertation-editing-and-proofreading-help-uk"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Editing & Formatting
                </Link>
              </li>
              {/* <li className="font-semibold"><Link href="/assignment-writing-help-services" className="text-[#3b82f6] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline">View All Services</Link></li> */}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-white text-[1.05rem] font-bold mb-6 mt-0">
              Subjects
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              {subjects.length > 0 ? (
                subjects.map((sub: any) => {
                  const cleanSlug = (sub.slug || "").replace(/^\/+/, "");
                  const finalSlug = cleanSlug.startsWith("subject/")
                    ? cleanSlug.replace("subject/", "")
                    : cleanSlug;
                  const humanized = finalSlug
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c: string) => c.toUpperCase());
                  const name =
                    sub.title?.split(" Help")[0]?.split(" Assignment")[0] ||
                    humanized.split(" ")[0];
                  const mappedSlug = finalSlug === "maths" || finalSlug === "math" ? "math" : finalSlug;
                  return (
                    <li key={sub.id}>
                      <Link
                        href={`/${mappedSlug}-assignment-help`}
                        className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li>
                    <Link
                      href="/business-assignment-help"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Business
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/nursing-assignment-help"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Nursing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/law-assignment-help"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Law
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/economics"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Economics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/marketing-assignment-help"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Marketing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/psychology-assignment-help"
                      className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                    >
                      Psychology
                    </Link>
                  </li>
                </>
              )}
              {/* <li className="font-semibold"><Link href="/subjects/business" className="text-[#3b82f6] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline">View All Subjects</Link></li> */}
            </ul>
          </div>
        </div>

        {/* Group 2: Company & Resources */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <p className="text-white text-[1.05rem] font-bold mb-6 mt-0">
              Resources
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li>
                <Link
                  href="/resources/referencing-guides"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Referencing Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/writing-tips"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Writing Tips
                </Link>
              </li>
              <li>
                <Link
                  href="/samples"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Samples
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/student-resources"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Student Resources
                </Link>
              </li>
              {/* <li className="font-semibold"><Link href="/resources" className="text-[#3b82f6] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline">View All Resources</Link></li> */}
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-white text-[1.05rem] font-bold mb-6 mt-0">
              Company
            </p>
            <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
              <li>
                <Link
                  href="/about"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/writers"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Our Experts
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions"
                  className="text-[#d1d5db] no-underline text-[0.9rem] transition-colors duration-200 hover:text-white hover:underline"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Column 6: Contact Us */}
        <div className="flex flex-col">
          <p className="text-white text-[1.05rem] font-bold mb-6 mt-0">
            Contact Us
          </p>
          <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
            <li className="flex items-start gap-3 text-[0.9rem] leading-relaxed">
              <Phone className="text-[#d1d5db] w-4 h-4 mt-1 shrink-0" />
              <a
                href="tel:+447826233106"
                className="text-[#d1d5db] no-underline transition-colors duration-200 hover:text-white"
              >
                +44 78262 33106
              </a>
            </li>
            <li className="flex items-start gap-3 text-[0.9rem] leading-relaxed">
              <Mail className="text-[#d1d5db] w-4 h-4 mt-1 shrink-0" />
              <a
                href="mailto:order@assignmentinneed.co.uk"
                className="text-[#d1d5db] no-underline transition-colors duration-200 hover:text-white"
              >
                order@assignmentinneed.co.uk
              </a>
            </li>
            <li className="flex items-start gap-3 text-[0.9rem] leading-relaxed">
              <MapPin className="text-[#d1d5db] w-4 h-4 mt-1 shrink-0" />
              <span className="text-[#d1d5db]">
                Roehampton Ln, London SW15
                <br />
                5PU, United Kingdom
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full border-t border-white/10 py-6 px-8 text-center flex justify-center">
        <p className="m-0 text-[#9ca3af] text-[0.85rem] max-w-[1400px] w-full">
          © 2026 Assignment In Need. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
