"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SparkleBurst } from "./SparkleBurst";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "pink" | "orange";
  disabled?: boolean;
  fullWidth?: boolean;
  showArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = true,
  showArrow = false,
  className = "",
  type = "button",
}: AnimatedButtonProps) {
  const [triggerSparkle, setTriggerSparkle] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setTriggerSparkle(true);
    if (onClick) onClick();
  };

  const baseStyles =
    "py-4 px-6 rounded-full font-extrabold text-base tracking-tight transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none relative overflow-hidden";

  const variants = {
    primary:
      "bg-[#5B2EFF] text-white shadow-[0_6px_24px_rgba(91,46,255,0.35)] hover:bg-[#4D24E0] hover:shadow-[0_8px_28px_rgba(91,46,255,0.45)] disabled:opacity-50 disabled:pointer-events-none",
    pink:
      "bg-[#FF2E93] text-white shadow-[0_6px_24px_rgba(255,46,147,0.35)] hover:bg-[#E0207D] hover:shadow-[0_8px_28px_rgba(255,46,147,0.45)] disabled:opacity-50 disabled:pointer-events-none",
    orange:
      "bg-[#FF5E2E] text-white shadow-[0_6px_24px_rgba(255,94,46,0.35)] hover:bg-[#E04B1D] hover:shadow-[0_8px_28px_rgba(255,94,46,0.45)] disabled:opacity-50 disabled:pointer-events-none",
    secondary:
      "bg-[#F2EEFF] text-[#5B2EFF] hover:bg-[#E4DCFF] disabled:opacity-50 disabled:pointer-events-none font-bold",
    outline:
      "bg-white text-[#1D1C1A] border border-[#EFECE6] hover:border-[#5B2EFF]/40 hover:bg-[#FCFBF8] disabled:opacity-50 disabled:pointer-events-none font-bold",
  };

  return (
    <div className={`${fullWidth ? "w-full" : "w-auto"} relative`}>
      <SparkleBurst trigger={triggerSparkle} />
      <motion.button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        whileHover={{ y: disabled ? 0 : -3, scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : "w-auto"} ${className}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        {showArrow && (
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
