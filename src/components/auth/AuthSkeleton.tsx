import React from "react";

export function AuthSkeleton() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-gradient-to-br from-[#0c0420] via-[#1a0b36] to-[#2b0c54] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#7c3aed]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#f59e0b]/15 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_70px_rgba(0,0,0,0.35)] min-h-[580px] flex flex-col md:flex-row">
        {/* Left Side: Brand Panel */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#2a085c] via-[#431487] to-[#6b21a8] p-8 lg:p-10 flex-col justify-between text-white">
          <div className="space-y-4">
            <div className="h-9 w-40 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-6 w-3/4 bg-white/20 rounded-md animate-pulse" />
            <div className="h-4 w-full bg-white/10 rounded-md animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-full bg-white/10 rounded-xl animate-pulse" />
            <div className="h-10 w-full bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Right Side: Form Skeleton */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl mb-8 max-w-xs mx-auto w-full">
            <div className="h-10 flex-1 bg-white rounded-xl shadow-sm animate-pulse" />
            <div className="h-10 flex-1 bg-transparent rounded-xl" />
          </div>

          <div className="space-y-5 max-w-md mx-auto w-full">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 w-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-60 rounded-xl animate-pulse mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
