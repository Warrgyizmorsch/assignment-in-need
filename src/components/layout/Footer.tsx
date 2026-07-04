"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="znh-new-footer">
      <div className="znh-footer-container">
        {/* Column 1: Brand */}
        <div className="znh-footer-brand">
          <div className="znh-footer-logo">
            <img src="/assets/media/layout/assignment_logo.webp" alt="Assignment IN NEED" />
          </div>
          <p>Helping students in the UK achieve academic success with expert support and guidance.</p>
          <div className="znh-footer-social">
            <a href="https://www.facebook.com/profile.php?id=61564613120071" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3 0-5 2-5 5v2z" />
              </svg>
            </a>
            <a href="https://twitter.com/assignment_in" aria-label="Twitter/X" target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/assignmentinneedofficial/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Group 1: Services & Subjects */}
        <div className="znh-footer-links-group">
          <div className="znh-footer-col">
            <h3>Services</h3>
            <ul>
              <li><Link href="/services/essay-writing">Essay Writing</Link></li>
              <li><Link href="/services/dissertation-help">Dissertation Help</Link></li>
              <li><Link href="/services/assignment-writing">Assignment Help</Link></li>
              <li><Link href="/services/case-study-help">Case Study Help</Link></li>
              <li><Link href="/services/report-writing">Report Writing</Link></li>
              <li><Link href="/services/proofreading-editing">Proofreading</Link></li>
              <li><Link href="/services/editing-formatting">Editing & Formatting</Link></li>
              <li className="znh-view-all"><Link href="/services/assignment-writing">View All Services</Link></li>
            </ul>
          </div>
          <div className="znh-footer-col">
            <h3>Subjects</h3>
            <ul>
              <li><Link href="/subjects/business">Business</Link></li>
              <li><Link href="/subjects/nursing">Nursing</Link></li>
              <li><Link href="/subjects/law">Law</Link></li>
              <li><Link href="/subjects/economics">Economics</Link></li>
              <li><Link href="/subjects/marketing">Marketing</Link></li>
              <li><Link href="/subjects/psychology">Psychology</Link></li>
              <li className="znh-view-all"><Link href="/subjects/business">View All Subjects</Link></li>
            </ul>
          </div>
        </div>

        {/* Group 2: Company & Resources */}
        <div className="znh-footer-links-group">
          <div className="znh-footer-col">
            <h3>Resources</h3>
            <ul>
              <li><Link href="#">Referencing Guides</Link></li>
              <li><Link href="#">Writing Tips</Link></li>
              <li><Link href="/samples">Samples</Link></li>
              <li><Link href="#">Blog</Link></li>
              <li><Link href="#">Student Resources</Link></li>
              <li className="znh-view-all"><Link href="#">View All Resources</Link></li>
            </ul>
          </div>
          <div className="znh-footer-col">
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/writers">Our Experts</Link></li>
              <li><Link href="#">Reviews</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 6: Contact Us */}
        <div className="znh-footer-col znh-footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li>
              <Phone />
              <a href="tel:+447300640066">+44 7300 640066</a>
            </li>
            <li>
              <Mail />
              <a href="mailto:support@assignmentinneed.com">support@assignmentinneed.com</a>
            </li>
            <li>
              <MapPin />
              <span>77 Great Portland Street,<br />London, W1W 6PQ, UK</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="znh-footer-bottom">
        <p>© 2024 Assignment In Need. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
