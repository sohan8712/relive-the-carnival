"use client";

import React from "react";
import { motion } from "framer-motion";

interface BackgroundAmbientProps {
  currentStep: number;
}

// Screen-specific background color accents
const ACCENT_BLOBS: Record<number, { primary: string; secondary: string; tertiary: string }> = {
  1: { primary: "#5B2EFF", secondary: "#FF2E93", tertiary: "#00B2FF" },
  2: { primary: "#FF2E93", secondary: "#5B2EFF", tertiary: "#FFC700" },
  3: { primary: "#00B2FF", secondary: "#00D68F", tertiary: "#5B2EFF" },
  4: { primary: "#FFC700", secondary: "#FF5E2E", tertiary: "#5B2EFF" },
  5: { primary: "#FF5E2E", secondary: "#FF2E93", tertiary: "#FFC700" },
  6: { primary: "#FF2E93", secondary: "#00B2FF", tertiary: "#5B2EFF" },
  7: { primary: "#00D68F", secondary: "#5B2EFF", tertiary: "#FF5E2E" },
  8: { primary: "#5B2EFF", secondary: "#FF2E93", tertiary: "#FFC700" },
};

export function BackgroundAmbient({ currentStep }: BackgroundAmbientProps) {
  const colors = ACCENT_BLOBS[currentStep] || ACCENT_BLOBS[1];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Blob 1 Top Right */}
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -25, 15, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: colors.primary }}
        className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-[0.12] blur-3xl transition-colors duration-1000"
      />

      {/* Animated Blob 2 Bottom Left */}
      <motion.div
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 20, -20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: colors.secondary }}
        className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full opacity-[0.10] blur-3xl transition-colors duration-1000"
      />

      {/* Animated Blob 3 Center Floating */}
      <motion.div
        animate={{
          x: [-10, 25, -20, -10],
          y: [15, -15, 20, 15],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ backgroundColor: colors.tertiary }}
        className="absolute left-1/3 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-[0.08] blur-3xl transition-colors duration-1000"
      />

      {/* Subtle Floating Sparkles Particles */}
      {[
        { top: "12%", left: "15%", delay: 0 },
        { top: "25%", left: "82%", delay: 2 },
        { top: "65%", left: "10%", delay: 4 },
        { top: "80%", left: "88%", delay: 1 },
        { top: "45%", left: "92%", delay: 3 },
      ].map((pt, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.2, scale: 0.8 }}
          animate={{
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.3, 0.8],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: pt.delay,
            ease: "easeInOut",
          }}
          style={{ top: pt.top, left: pt.left }}
          className="absolute w-2 h-2 rounded-full bg-[#5B2EFF]/20 blur-[0.5px]"
        />
      ))}
    </div>
  );
}
