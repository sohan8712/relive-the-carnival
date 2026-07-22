"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  emoji?: string;
}

interface SparkleBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  emojis?: string[];
}

const COLORS = ["#5B2EFF", "#FF2E93", "#FF5E2E", "#FFC700", "#00D68F", "#00B2FF"];

export function SparkleBurst({ trigger, onComplete, emojis }: SparkleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const count = 12;
      const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        const distance = 40 + Math.random() * 50;
        return {
          id: Date.now() + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: 6 + Math.random() * 8,
          color: COLORS[i % COLORS.length],
          emoji: emojis ? emojis[i % emojis.length] : undefined,
        };
      });

      const animId = requestAnimationFrame(() => {
        setParticles(newParticles);
      });

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 700);

      return () => {
        cancelAnimationFrame(animId);
        clearTimeout(timer);
      };
    }
  }, [trigger, onComplete, emojis]);

  if (!particles.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: p.x, y: p.y, scale: 1.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ color: p.color }}
            className="absolute font-bold text-xs"
          >
            {p.emoji ? (
              <span className="text-sm select-none">{p.emoji}</span>
            ) : (
              <div
                className="rounded-full shadow-xs"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
