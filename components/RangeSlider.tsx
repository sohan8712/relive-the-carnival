"use client";
import React from "react";
import { motion } from "framer-motion";

interface RangeSliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

const SLIDER_LABELS: Record<number, string> = {
  1: "Could be better 😅",
  2: "Slightly low key 😐",
  3: "Slightly low key 😐",
  4: "Good effort 🙂",
  5: "Good effort 🙂",
  6: "Nice energy! 😄",
  7: "Nice energy! 😄",
  8: "Super fun! 🎉",
  9: "Super fun! 🎉",
  10: "Unforgettable! 🔥",
};

export function RangeSlider({ value, onChange, min = 1, max = 10 }: RangeSliderProps) {
  const safeVal = value || 7;

  return (
    <div className="flex flex-col gap-6 py-4 px-1">
      {/* Live Rating Display Badge */}
      <div className="flex flex-col items-center gap-1.5">
        <motion.div
          key={safeVal}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-extrabold text-[#5B2EFF] tracking-tight flex items-baseline gap-1"
        >
          {safeVal}
          <span className="text-base font-semibold text-[#1D1C1A]/40">/ {max}</span>
        </motion.div>
        <span className="text-xs font-semibold bg-[#F2EEFF] text-[#5B2EFF] px-3.5 py-1 rounded-full">
          {SLIDER_LABELS[safeVal] || "Good energy!"}
        </span>
      </div>

      {/* Slider Control Container */}
      <div className="flex flex-col gap-3">
        <div className="relative py-2">
          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={safeVal}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-[#EFECE6] rounded-full appearance-none cursor-pointer focus:outline-none"
            aria-label="Entertainment rating slider"
          />
        </div>

        {/* Min / Max Labels */}
        <div className="flex justify-between items-center text-xs font-semibold text-[#1D1C1A]/50">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#1D1C1A]/20" />
            Poor
          </span>
          <span className="flex items-center gap-1 text-[#5B2EFF]">
            Excellent
            <span className="w-2 h-2 rounded-full bg-[#5B2EFF]" />
          </span>
        </div>
      </div>
    </div>
  );
}
