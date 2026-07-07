import React from "react";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  steps,
  className,
  title = "How It Works",
  subtitle,
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-12 w-full max-w-[1250px] mx-auto text-center px-4", className)}>
      {title && (
        <div className="text-center max-w-2xl flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f1b3d]">
            {title.includes("5-Step") ? (
              <>
                Our Simple <span className="text-[#3f159a]">5-Step Process</span>
              </>
            ) : (
              title
            )}
          </h2>
          {subtitle && (
            <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Desktop View: Horizontal columns with absolute positioned centered arrows */}
      <div className="hidden md:grid grid-cols-5 gap-6 w-full relative mt-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center text-center relative px-2">
            
            {/* 1. Icon Circle Container */}
            <div className="w-[56px] h-[56px] rounded-full bg-[#f3f0ff] flex items-center justify-center text-[#3f159a] mb-2 shrink-0">
              {step.icon}
            </div>

            {/* 2. Step Number Badge */}
            <div className="w-5 h-5 rounded-full bg-[#3f159a] text-white text-[11px] font-extrabold flex items-center justify-center mb-3">
              {step.number}
            </div>

            {/* 3. Title */}
            <h3 className="font-extrabold text-[#0f1b3d] text-[15px] sm:text-[16px] leading-tight mb-2 tracking-tight">
              {step.title}
            </h3>

            {/* 4. Description */}
            <p className="text-[12.5px] text-gray-500 leading-relaxed font-medium max-w-[170px]">
              {step.description}
            </p>

            {/* 5. Horizontal Connector Arrow between icon circles */}
            {index < steps.length - 1 && (
              <div className="absolute right-[-24px] top-[18px] w-12 text-[#94a3b8] flex justify-center z-10 select-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile View: Vertical list with clean spacing */}
      <div className="flex md:hidden flex-col gap-8 w-full max-w-sm mx-auto text-left">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-start gap-4 relative">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-[52px] h-[52px] rounded-full bg-[#f3f0ff] flex items-center justify-center text-[#3f159a] relative z-10">
                {step.icon}
              </div>
              <div className="w-5 h-5 rounded-full bg-[#3f159a] text-white text-[10px] font-extrabold flex items-center justify-center mt-2 relative z-10">
                {step.number}
              </div>
              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-[52px] w-[2px] h-[64px] bg-slate-100 -translate-x-1/2 z-0" />
              )}
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <h3 className="font-extrabold text-[#0f1b3d] text-[15px] leading-tight">
                {step.title}
              </h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
ProcessSteps.displayName = "ProcessSteps";
