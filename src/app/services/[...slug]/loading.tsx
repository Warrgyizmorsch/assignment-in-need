import React from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";

export default function ServicePageLoading() {
  return (
    <div className="bg-white">
      {/* 1. Hero Section Skeleton */}
      <section className="bg-white border-b border-primary-50 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left animate-pulse">
            <div className="w-1/4 h-4 bg-slate-200 rounded" />
            <div className="w-48 h-6 bg-slate-200 rounded-full" />
            <div className="w-4/5 h-12 bg-slate-200 rounded-md" />
            <div className="w-11/12 h-4 bg-slate-200 rounded" />
            
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-12 h-6 bg-slate-200 rounded" />
                  <div className="w-16 h-3 bg-slate-200 rounded" />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="w-32 h-11 bg-slate-200 rounded-lg" />
              <div className="w-32 h-11 bg-slate-200 rounded-lg" />
            </div>
          </div>

          {/* Right Form Box */}
          <div className="lg:col-span-5 w-full animate-pulse">
            <div className="h-[460px] bg-slate-150 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* 2. Meet Your Expert Writer Skeleton */}
      <SectionContainer className="bg-slate-50/50">
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="flex items-end justify-between border-b border-slate-100 pb-3">
            <div className="flex flex-col gap-3">
              <div className="w-20 h-5 bg-slate-200 rounded-full" />
              <div className="w-56 h-7 bg-slate-200 rounded-md" />
              <div className="w-96 h-4 bg-slate-200 rounded" />
            </div>
            <div className="w-24 h-5 bg-slate-200 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-16 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-full h-8 bg-slate-200 rounded-lg mt-2" />
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
