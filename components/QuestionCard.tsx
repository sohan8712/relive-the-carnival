"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface QuestionCardProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  accentColor?: string;
  badgeText?: string;
}

export function QuestionCard({
  emoji,
  title,
  subtitle,
  children,
  className = "",
  accentColor = "#5B2EFF",
  badgeText,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`bg-white rounded-[28px] p-6 sm:p-7 border border-[#EFECE6] shadow-[0_8px_32px_-6px_rgba(0,0,0,0.05)] flex flex-col gap-4 relative overflow-hidden ${className}`}
    >
      {/* Top right subtle decorative accent bar */}
      <div
        className="absolute top-0 right-0 left-0 h-1.5 opacity-80"
        style={{ backgroundColor: accentColor }}
      />

      {(emoji || title || subtitle || badgeText) && (
        <div className="flex flex-col gap-2 relative z-10">
          {badgeText && (
            <div
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full w-fit shadow-xs mb-1"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>
          )}

          {emoji && (
            <motion.div
              animate={{ rotate: [-4, 4, -4], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl select-none leading-none mb-1 w-fit"
            >
              {emoji}
            </motion.div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D1C1A] tracking-tight leading-snug">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm font-medium text-[#1D1C1A]/65 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
