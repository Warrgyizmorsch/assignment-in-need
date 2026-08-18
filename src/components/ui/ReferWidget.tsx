"use client";

import React from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";

export function ReferWidget() {
  return (
    <Link
      href="/refer-and-earn"
      className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-50 flex-col items-center justify-end w-12 bg-[#ff5722] text-white shadow-lg hover:shadow-2xl hover:w-14 transition-all duration-300 rounded-r-xl group py-4 overflow-hidden"
    >
      <div className="flex-1 flex items-center justify-center [writing-mode:vertical-rl] rotate-180 font-bold text-sm tracking-widest whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity pb-4">
        REFER AND EARN
      </div>
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 mt-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
        <Wallet className="w-4 h-4 text-[#f26a36]" />
      </div>
    </Link>
  );
}
