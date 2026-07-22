"use client";
import React from "react";
import { Camera, Sparkles } from "lucide-react";

interface ImagePlaceholderProps {
  caption?: string;
  tagline?: string;
  aspectRatio?: string;
}

export function ImagePlaceholder({
  caption = "Event Photo",
  tagline = "Sugar.fit 5th Anniversary",
  aspectRatio = "aspect-[16/10]",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`w-full ${aspectRatio} bg-[#FCFBF8] border-2 border-dashed border-[#EFECE6] rounded-[24px] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group transition-all duration-300 hover:border-[#5B2EFF]/30 hover:bg-[#F2EEFF]/30`}
    >
      {/* Soft decorative background circles */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#5B2EFF]/5 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-28 h-28 bg-[#5B2EFF]/5 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFECE6] shadow-sm flex items-center justify-center text-[#5B2EFF] group-hover:scale-105 transition-transform duration-300">
          <Camera className="w-6 h-6 stroke-[1.75]" />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-[#5B2EFF]" />
          <span className="text-xs font-semibold text-[#5B2EFF] tracking-wide uppercase">
            {tagline}
          </span>
        </div>
        <p className="text-base font-bold text-[#1D1C1A] tracking-tight">
          {caption}
        </p>
        <span className="text-[11px] font-medium text-[#1D1C1A]/40 bg-white/80 px-2.5 py-0.5 rounded-full border border-[#EFECE6]">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
