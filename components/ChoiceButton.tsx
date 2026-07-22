"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChoiceButtonProps {
  label: string;
  emoji?: string;
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  variant?: "pill" | "card";
}

export function ChoiceButton({
  label,
  emoji,
  icon,
  isSelected = false,
  onClick,
  variant = "pill",
}: ChoiceButtonProps) {
  if (variant === "card") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-4 rounded-[22px] flex items-center justify-between transition-all duration-200 text-left border cursor-pointer ${
          isSelected
            ? "bg-[#5B2EFF] text-white border-[#5B2EFF] shadow-md shadow-[#5B2EFF]/20"
            : "bg-white text-[#1D1C1A] border-[#EFECE6] hover:border-[#5B2EFF]/40 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`p-2 rounded-full ${
                isSelected ? "bg-white/20 text-white" : "bg-[#F2EEFF] text-[#5B2EFF]"
              }`}
            >
              {icon}
            </div>
          )}
          {emoji && <span className="text-xl select-none">{emoji}</span>}
          <span className="text-sm font-semibold tracking-tight">{label}</span>
        </div>

        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-white text-[#5B2EFF] border-white"
              : "border-[#EFECE6] bg-[#FCFBF8]"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3.5 px-5 rounded-[24px] flex items-center justify-between text-base font-semibold transition-all duration-200 cursor-pointer border ${
        isSelected
          ? "bg-[#5B2EFF] text-white border-[#5B2EFF] shadow-md shadow-[#5B2EFF]/25"
          : "bg-white text-[#1D1C1A] border-[#EFECE6] hover:border-[#5B2EFF]/40 shadow-xs"
      }`}
    >
      <div className="flex items-center gap-3">
        {emoji && <span className="text-xl select-none">{emoji}</span>}
        <span>{label}</span>
      </div>

      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          isSelected
            ? "bg-white text-[#5B2EFF] border-white"
            : "border-[#EFECE6] bg-[#FCFBF8]"
        }`}
      >
        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </motion.button>
  );
}
