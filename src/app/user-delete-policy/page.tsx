"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  UserX,
  Lock,
  Trash2,
  ExternalLink,
  Send,
  X,
  Smartphone,
} from "lucide-react";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { toast } from "react-hot-toast";
import { buildPageSchema } from "@/lib/data";

export default function UserDeletePolicyPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);

  const emailAddress = "daniel24white@gmail.com";
  const subjectLine = "Account Deletion Request";
  
  const emailTemplateText = `Hello Support Team,

I would like to request the permanent deletion of my account and associated personal data.

Please find my account details below:
• Registered Email Address: [Enter your email here]
• Username (if applicable): [Enter your username here]

Thank you.`;

  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailTemplateText)}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailTemplateText)}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${emailAddress}&subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailTemplateText)}`;

  const handleSendEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Try opening mailto protocol
    try {
      window.location.href = mailtoUrl;
    } catch (err) {}
    
    // Always open fallback modal to ensure user gets interactive choices on Mobile & PC
    setShowMailModal(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    toast.success("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySubject = () => {
    navigator.clipboard.writeText(subjectLine);
    setCopiedSubject(true);
    toast.success("Subject line copied to clipboard!");
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(emailTemplateText);
    setCopiedTemplate(true);
    toast.success("Full email template copied to clipboard!");
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const dataDeletedList = [
    {
      title: "Account information",
      desc: "Account credentials, registration records, and system account profile data.",
      icon: UserX,
    },
    {
      title: "Profile information",
      desc: "Personal preferences, user settings, display details, and profile data.",
      icon: Lock,
    },
    {
      title: "User-generated data associated with your account",
      desc: "Activity logs, saved items, history, and uploaded content associated with your account.",
      icon: Trash2,
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
      {/* 1. Header Hero Banner (Fully Responsive for Mobile App & Web) */}
      <section className="relative w-full bg-gradient-to-r from-[#3f159a] to-[#250d5e] text-white py-10 sm:py-14 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-left relative z-10">
          <AnimateIn variant="fadeUp">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-purple-200 uppercase tracking-widest mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-white">User Delete Policy</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3">
              Account Deletion Request
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 font-semibold max-w-xl leading-relaxed">
              Official policy for requesting account and associated personal data deletion.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* 2. Main Content Section */}
      <AnimateIn variant="fadeUp" delay={0.15} as="main" className="max-w-[1000px] mx-auto px-3 sm:px-6 mt-6 sm:mt-10 block">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-150/70 shadow-[0_10px_40px_rgba(0,0,0,0.02)] p-4 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8 text-left">
          
          {/* Main Notice */}
          <section className="flex flex-col gap-3">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-800 font-semibold">
              If you would like to delete your Assignment In Need account and associated personal data, please send an email to:
            </p>

            {/* Email Box */}
            <div className="bg-[#fcfbff] border border-purple-150/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm mt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-[#3f159a] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Support Email Address</span>
                    <a href={mailtoUrl} onClick={handleSendEmailClick} className="text-sm sm:text-base font-bold text-gray-900 hover:text-[#3f159a] transition-colors truncate">
                      {emailAddress}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors min-h-[40px]"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                  </button>

                  <button
                    onClick={handleSendEmailClick}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 sm:py-2 rounded-lg bg-[#3f159a] hover:bg-[#250d5e] text-white transition-colors shadow-md min-h-[40px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>

              {/* Direct Webmail Links (Gmail & Outlook) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1">
                <span className="text-xs font-bold text-gray-500">Quick open options:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 sm:py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors min-h-[38px] sm:min-h-[auto]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Gmail</span>
                  </a>
                  <a
                    href={outlookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 sm:py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors min-h-[38px] sm:min-h-[auto]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Outlook</span>
                  </a>
                </div>
              </div>

              {/* Subject Line Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-200 mt-1">
                <div className="flex flex-col">
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject Line</span>
                  <span className="text-sm sm:text-base font-bold text-gray-900">{subjectLine}</span>
                </div>
                <button
                  onClick={handleCopySubject}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors w-full sm:w-auto"
                >
                  {copiedSubject ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSubject ? "Copied" : "Copy Subject"}</span>
                </button>
              </div>

              {/* Pre-filled Email Template Box */}
              <div className="bg-purple-50/50 border border-purple-150 rounded-xl p-3.5 sm:p-4 flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold text-purple-900 uppercase tracking-wider">Email Template Preview</span>
                  <button
                    onClick={handleCopyTemplate}
                    className="flex items-center gap-1 text-xs font-bold text-[#3f159a] hover:underline"
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplate ? "Copied" : "Copy Template"}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-gray-700 bg-white p-3 rounded-lg border border-purple-100 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {emailTemplateText}
                </pre>
              </div>

            </div>
          </section>

          {/* Please Include Section */}
          <section className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-2xl font-black text-gray-950 flex items-center gap-2">
              <span className="text-[#3f159a] font-black text-base sm:text-lg select-none">•</span>
              Please include:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-[#fbfbfe] border border-gray-200 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-base font-bold text-gray-800">
                  Your registered email address.
                </span>
              </div>

              <div className="flex items-start gap-3 bg-[#fbfbfe] border border-gray-200 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-base font-bold text-gray-800">
                  Your username (if applicable).
                </span>
              </div>
            </div>

            {/* Do not send password alert */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 font-bold text-xs sm:text-base">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Do not send your password.</span>
            </div>
          </section>

          {/* Processing Timeline */}
          <section className="flex flex-col gap-3">
            <div className="bg-purple-50/70 border border-purple-150 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#3f159a] text-white flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <p className="text-xs sm:text-base text-gray-900 font-semibold leading-relaxed m-0">
                We will process your request and delete your account within <strong className="text-[#3f159a] font-black">24-48 working hours</strong> after verifying your identity.
              </p>
            </div>
          </section>

          {/* Data Deleted Section */}
          <section className="flex flex-col gap-4 border-t border-gray-150 pt-6">
            <h2 className="text-lg sm:text-2xl font-black text-gray-950 flex items-center gap-2">
              <span className="text-[#3f159a] font-black text-base sm:text-lg select-none">•</span>
              Data deleted:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {dataDeletedList.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col gap-2.5 shadow-sm hover:border-purple-300 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-[#3f159a] flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </AnimateIn>

      {/* 3. Interactive Mobile & Web Email Options Modal */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 border border-purple-100 relative">
            <button
              onClick={() => setShowMailModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#3f159a] text-white flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-lg font-black text-gray-900">Send Deletion Request</h3>
                <p className="text-xs text-gray-500 font-medium">Choose how you want to send your request</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <a
                href={mailtoUrl}
                onClick={() => setShowMailModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 transition-colors font-bold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#3f159a]" />
                  <span>Default Mail App (iOS / Android / Mail)</span>
                </div>
                <Send className="w-4 h-4 text-[#3f159a]" />
              </a>

              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMailModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 transition-colors font-bold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-red-600" />
                  <span>Open Gmail (Browser / Web)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-600" />
              </a>

              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMailModal(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-colors font-bold text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span>Open Outlook Web</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </a>

              <button
                onClick={() => {
                  handleCopyTemplate();
                  setShowMailModal(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 transition-colors font-bold text-xs sm:text-sm text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span>Copy Full Email Template</span>
                </div>
                <Check className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            <button
              onClick={() => setShowMailModal(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
