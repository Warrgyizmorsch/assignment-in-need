"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
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
  const [activeStep, setActiveStep] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || !steps || steps.length === 0) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, steps.length]);

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
            <p className="text-gray-500 text-[15px] font-semibold leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Desktop View: Interactive Animated Step Flow */}
      <div 
        className="hidden md:grid grid-cols-5 gap-4 w-full relative mt-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {steps.map((step, index) => {
          const isActive = step.number === activeStep;
          const isCompleted = step.number < activeStep;
          const isCurrentOrPast = step.number <= activeStep;

          return (
            <div
              key={step.number}
              onMouseEnter={() => setActiveStep(step.number)}
              className="flex flex-col items-center text-center relative px-2 group cursor-pointer"
            >
              {/* 1. Icon Circle Container */}
              <div
                className={cn(
                  "w-[58px] h-[58px] rounded-full flex items-center justify-center mb-3 shrink-0 transition-all duration-500 relative z-20",
                  isCurrentOrPast
                    ? "bg-[#3f159a] text-white shadow-lg shadow-purple-300/60 scale-105"
                    : "bg-[#f3f0ff] text-[#3f159a] group-hover:bg-purple-100 group-hover:scale-105"
                )}
              >
                {step.icon}
              </div>

              {/* 2. Step Number Badge */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center mb-3 transition-all duration-500 relative z-20",
                  isCurrentOrPast
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-300 text-white"
                )}
              >
                {step.number}
              </div>

              {/* 3. Title */}
              <h3
                className={cn(
                  "font-extrabold text-[15px] sm:text-[16px] leading-tight mb-2 tracking-tight transition-colors duration-300",
                  isActive ? "text-[#3f159a]" : "text-[#0f1b3d]"
                )}
              >
                {step.title}
              </h3>

              {/* 4. Description */}
              <p className="text-[14px] sm:text-[14.5px] text-gray-500 leading-relaxed font-medium max-w-[175px]">
                {step.description}
              </p>

              {/* 5. Animated Connector Line & Arrow */}
              {index < steps.length - 1 && (
                <div className="absolute top-[27px] left-[calc(50%+32px)] w-[calc(100%-64px)] flex items-center z-10 pointer-events-none">
                  <div className="h-[3px] flex-1 bg-slate-200 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#3f159a] to-[#7c3aed] transition-all duration-700 ease-out"
                      style={{
                        width: isCompleted ? "100%" : isActive ? "50%" : "0%",
                      }}
                    />
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 shrink-0 -ml-1 transition-all duration-300",
                      isCurrentOrPast
                        ? "text-[#3f159a] translate-x-0.5"
                        : "text-slate-300"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View: Original vertical list with clean spacing */}
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
