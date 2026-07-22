"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export function ProgressHeader({ currentStep, totalSteps, onBack }: ProgressHeaderProps) {
  // Hide header on Intro (Step 1) and Film Reel Gallery (Step 8)
  if (currentStep <= 1 || currentStep >= totalSteps) {
    return null;
  }

  // Calculate remaining time estimate
  const remainingSteps = totalSteps - currentStep;
  const estimatedSeconds = Math.max(5, remainingSteps * 8);

  const progressPercent = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full px-6 pt-4 pb-2 shrink-0 bg-white/95 backdrop-blur-md z-30 flex flex-col gap-2 border-b border-[#EFECE6]/50">
      <div className="flex items-center justify-between text-xs text-[#1D1C1A]/50 font-medium">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="p-1 -ml-1 text-[#1D1C1A]/60 hover:text-[#5B2EFF] transition-colors rounded-full hover:bg-[#EFECE6]/50 active:scale-95 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="font-bold text-[#5B2EFF]">Sugar.fit 5th</span>
        </div>
        <span className="text-[11px] bg-[#F2EEFF] text-[#5B2EFF] font-extrabold px-2.5 py-0.5 rounded-full">
          About {estimatedSeconds}s left
        </span>
      </div>

      {/* Progress track with glowing dot */}
      <div className="w-full h-1.5 bg-[#EFECE6] rounded-full relative overflow-visible mt-0.5">
        <motion.div
          className="h-full bg-[#5B2EFF] rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Active indicator dot */}
          <motion.div
            className="absolute -right-1 -top-0.5 w-2.5 h-2.5 bg-[#5B2EFF] ring-2 ring-white rounded-full shadow-[0_0_8px_rgba(91,46,255,0.6)]"
            layoutId="activeDot"
          />
        </motion.div>
      </div>
    </div>
  );
}
