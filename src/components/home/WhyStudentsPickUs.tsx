import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Check, X } from "lucide-react";

export default function WhyStudentsPickUs() {
  return (
    <section className="ain-section bg-white pt-6 pb-8 sm:pt-8 sm:pb-10 md:pt-10 md:pb-12 px-4 sm:px-6 font-sans text-[#14212b] overflow-hidden">
      <style jsx>{`
        .ain-wrap {
          max-width: 1140px;
          margin: 0 auto;
        }
        .ain-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 40px;
          align-items: start;
        }

        /* Step list styles */
        .ain-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
        }
        .ain-steps:before {
          content: "";
          position: absolute;
          left: 19px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: #e2e8f0;
        }
        .ain-step-item {
          position: relative;
          padding: 0 0 32px 56px;
        }
        .ain-step-item:last-child {
          padding-bottom: 0;
        }
        .ain-step-badge {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3f159a;
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 10px rgba(63, 21, 154, 0.25);
        }
        .ain-time-pill {
          display: inline-block;
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #3f159a;
          background: #f4f0ff;
          border: 1px solid #e9dcfc;
          padding: 3px 12px;
          border-radius: 99px;
        }

        /* Table comparison styles */
        .ain-table {
          position: relative;
          background: #f8faff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 0 0 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .ain-row {
          display: grid;
          grid-template-columns: 1.05fr 1.55fr 1fr;
          align-items: center;
        }
        .ain-row > div {
          padding: 14px 18px;
          font-size: 14.5px;
          line-height: 1.35;
        }
        .ain-head > div {
          font-weight: 800;
          font-size: 15px;
          padding-top: 20px;
          padding-bottom: 16px;
        }
        .ain-head .us {
          background: linear-gradient(180deg, #3f159a 0%, #341084 100%);
          color: #ffffff;
          border-radius: 16px 16px 0 0;
          font-size: 17px;
          font-weight: 800;
          margin-top: -14px;
          padding-top: 28px;
          box-shadow: 0 -4px 15px rgba(63, 21, 154, 0.15);
        }
        .ain-row .label {
          font-weight: 700;
          color: #14212b;
          border-top: 1px solid #e8ecf2;
        }
        .ain-row .us {
          background: #3f159a;
          color: #ffffff;
          font-weight: 500;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }
        .ain-head .us {
          border-top: 0;
        }
        .ain-row .them {
          color: #64748b;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          border-top: 1px solid #e8ecf2;
        }
        .ain-head > div {
          border-top: 0 !important;
        }
        .ain-row:last-of-type .us {
          border-radius: 0 0 16px 16px;
          padding-bottom: 20px;
        }
        .ain-tick,
        .ain-cross {
          flex: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 11px;
          font-weight: 800;
          margin-top: 1px;
        }
        .ain-tick {
          background: #fbb039;
          color: #2b0c61;
        }
        .ain-cross {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Proof stats bar */
        .ain-proof {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin: 24px 0 16px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }
        .ain-proof div {
          padding: 18px 16px;
          text-align: center;
        }
        .ain-proof div + div {
          border-left: 1px solid #e2e8f0;
        }
        .ain-proof b {
          display: block;
          font-size: 34px;
          font-weight: 900;
          color: #3f159a;
          line-height: 1.1;
        }
        .ain-proof span {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        /* Guarantee Box */
        .ain-guar {
          display: flex;
          gap: 18px;
          align-items: center;
          background: #fffcf0;
          border: 2px solid #fbb039;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 4px 12px rgba(251, 176, 57, 0.12);
        }

        /* Media queries */
        @media (max-width: 900px) {
          .ain-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 560px) {
          .ain-row {
            grid-template-columns: 0.95fr 1.35fr 0.9fr;
          }
          .ain-row > div {
            padding: 12px 8px;
            font-size: 12.5px;
          }
          .ain-head > div {
            font-size: 12.5px;
          }
          .ain-head .us {
            font-size: 13.5px;
            padding-top: 22px;
          }
          .ain-tick,
          .ain-cross {
            display: none;
          }
          .ain-proof b {
            font-size: 22px;
          }
          .ain-proof div {
            padding: 14px 6px;
          }
          .ain-proof span {
            font-size: 12px;
          }
          .ain-guar {
            flex-direction: column;
            text-align: center;
            padding: 18px 16px;
          }
        }
      `}</style>

      <div className="ain-wrap">
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-extrabold text-[#06092d] tracking-tight leading-[1.2] mb-2.5">
            Why students pick us over{" "}
            <span className="bg-gradient-to-r from-[#3f159a] to-[#ff5722] bg-clip-text text-transparent">
              other services
            </span>
          </h2>
          <p className="text-[#64748b] text-[16px] sm:text-[17px] max-w-[560px] mx-auto leading-relaxed">
            Clear prices. Real experts. A promise in writing.
          </p>
        </div>

        {/* 2-Column Grid: Steps + Comparison Table */}
        <div className="ain-grid">
          {/* Left Column: 3 How-it-works Steps */}
          <ol className="ain-steps">
            <li className="ain-step-item">
              <span className="ain-step-badge">1</span>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#06092d] mb-1">
                Tell us what you need
              </h3>
              <p className="text-[#64748b] text-[14.5px] leading-relaxed">
                Upload your brief or type it in. No sign-up needed to get a price.
              </p>
              <span className="ain-time-pill">Takes 2 minutes</span>
            </li>

            <li className="ain-step-item">
              <span className="ain-step-badge">2</span>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#06092d] mb-1">
                Get matched with an expert
              </h3>
              <p className="text-[#64748b] text-[14.5px] leading-relaxed">
                See verified writers for your subject. Pick the one you like.
              </p>
              <span className="ain-time-pill">Reply in 5 minutes</span>
            </li>

            <li className="ain-step-item">
              <span className="ain-step-badge">3</span>
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#06092d] mb-1">
                Review, change, submit
              </h3>
              <p className="text-[#64748b] text-[14.5px] leading-relaxed">
                Ask for free changes until you are happy with the work.
              </p>
              <span className="ain-time-pill">Delivery from 3 hours</span>
            </li>
          </ol>

          {/* Right Column: Comparison Table */}
          <div className="ain-table" role="table" aria-label="Why Assignment In Need over other services comparison">
            <div className="ain-row ain-head" role="row">
              <div role="columnheader" className="text-[#06092d]">What you get</div>
              <div className="us" role="columnheader">AssignmentInNeed</div>
              <div role="columnheader" className="text-[#64748b]">Other providers</div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Price</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Fixed quote before you pay</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>Extra fees added later</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Speed</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Delivery from 3 hours</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>Often late</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Originality</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Free plagiarism check on every order</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>Paid extra or none</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Changes</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Free changes for 30 days</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>Limited or paid</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Help</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Real person, 24/7</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>Bots or slow replies</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Your writer</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Chat with them directly</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>No contact</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Tracking</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>Live dashboard for every order</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>No updates</span>
              </div>
            </div>

            <div className="ain-row" role="row">
              <div className="label">Refund</div>
              <div className="us">
                <i className="ain-tick" aria-hidden="true">✓</i>
                <span>100% money-back promise</span>
              </div>
              <div className="them">
                <i className="ain-cross" aria-hidden="true">✕</i>
                <span>No promise</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Stats Counter Strip */}
        <div className="ain-proof">
          <div>
            <b>25,000+</b>
            <span>orders completed</span>
          </div>
          <div>
            <b>4.9/5</b>
            <span>from 10,000+ reviews</span>
          </div>
          <div>
            <b>98%</b>
            <span>delivered on time</span>
          </div>
        </div>

        {/* Guarantee Callout Box */}
        <div className="ain-guar">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"
              fill="#3f159a"
            />
            <path
              d="M16 24l6 6 11-12"
              fill="none"
              stroke="#fbb039"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <h4 className="text-[17px] sm:text-[18px] font-extrabold text-[#06092d] m-0 mb-1">
              Our promise: 100% money-back guarantee
            </h4>
            <p className="text-[#4a4a3a] text-[14.5px] sm:text-[15px] m-0 leading-relaxed">
              If we miss your deadline or the work does not match your brief, we fix it free or refund you. Terms are on the order page.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6 sm:mt-7">
          <Link
            href="/order"
            className="btn-shutter-orange-open inline-flex items-center justify-center gap-2.5 font-extrabold text-[16px] sm:text-[18px] py-4 px-8 sm:px-10 rounded-xl no-underline shadow-[0_6px_20px_rgba(255,87,34,0.3)] transition-all duration-300"
          >
            <span>Get my free quote in 2 minutes</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
