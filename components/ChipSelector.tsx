"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { SparkleBurst } from "./SparkleBurst";

interface ChipSelectorProps {
  options: string[];
  selectedValues: string[];
  onToggle: (option: string) => void;
}

const CHIP_ACCENTS = [
  { bg: "#5B2EFF", light: "#F2EEFF", text: "#5B2EFF" },
  { bg: "#FF2E93", light: "#FFF0F6", text: "#FF2E93" },
  { bg: "#FF5E2E", light: "#FFF2EE", text: "#FF5E2E" },
  { bg: "#00D68F", light: "#E6FBF4", text: "#00B87A" },
  { bg: "#00B2FF", light: "#E6F7FF", text: "#0099E6" },
  { bg: "#9B51E0", light: "#F5EEFD", text: "#9B51E0" },
];

export function ChipSelector({ options, selectedValues, onToggle }: ChipSelectorProps) {
  const [activeOption, setActiveOption] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2.5 py-1">
      {options.map((option, idx) => {
        const isSelected = selectedValues.includes(option);
        const accent = CHIP_ACCENTS[idx % CHIP_ACCENTS.length];

        return (
          <div key={option} className="relative">
            <SparkleBurst trigger={activeOption === option && isSelected} />
            <motion.button
              type="button"
              onClick={() => {
                setActiveOption(option);
                onToggle(option);
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className={`py-2.5 px-4 rounded-full text-xs font-bold tracking-tight transition-all duration-200 flex items-center gap-1.5 border cursor-pointer select-none ${
                isSelected
                  ? "text-white border-transparent shadow-xs"
                  : "bg-[#FCFBF8] text-[#1D1C1A]/80 border-[#EFECE6] hover:border-[#5B2EFF]/40 hover:bg-white"
              }`}
              style={{
                backgroundColor: isSelected ? accent.bg : undefined,
                borderColor: isSelected ? accent.bg : undefined,
              }}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              ) : (
                <Plus className="w-3.5 h-3.5 opacity-60" />
              )}
              <span>{option}</span>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
