"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface FilmFrame {
  id: string;
  image: string;
  title?: string;
  caption?: string;
  author?: string;
  frameNum?: string;
}

interface FilmStripProps {
  frames: FilmFrame[];
  speed?: number; // duration in seconds for full loop (smaller = faster)
  onSelectFrame: (frame: FilmFrame) => void;
}

export function FilmStrip({
  frames,
  speed = 18,
  onSelectFrame,
}: FilmStripProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Triple frames for seamless infinite looping
  const tripleFrames = [...frames, ...frames, ...frames];

  return (
    <div className="w-full relative overflow-hidden select-none flex items-center justify-center py-2">
      {/* Hero Single 35mm Film Strip Container */}
      <motion.div
        className="flex items-center gap-0 w-max cursor-grab active:cursor-grabbing"
        animate={
          isDragging
            ? {}
            : {
                x: ["0%", "-33.33%"],
              }
        }
        transition={{
          repeat: Infinity,
          duration: speed,
          ease: "linear",
        }}
        drag="x"
        dragConstraints={{ left: -2000, right: 2000 }}
        dragElastic={0.15}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {tripleFrames.map((frame, idx) => (
          <div
            key={`${frame.id}-${idx}`}
            className="flex flex-col bg-[#111111] border-t-2 border-b-2 border-[#2A2A2A] shadow-2xl relative shrink-0 group"
          >
            {/* Top Sprocket Hole Margin */}
            <div className="h-6 sm:h-7 bg-[#0A0A0A] px-3 flex items-center justify-between border-b border-[#222222]">
              <div className="flex gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-3.5 bg-[#262626] rounded-xs group-hover:bg-[#5B2EFF]/60 transition-colors"
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">
                {frame.frameNum || `35MM • ${(idx % frames.length) + 1}A`}
              </span>
            </div>

            {/* Large Hero Photo Frame Container */}
            <div className="p-3 sm:p-4 bg-[#161616] flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectFrame(frame)}
                className="relative overflow-hidden rounded-md bg-[#000000] border border-[#333333] shadow-2xl cursor-pointer group-hover:border-[#5B2EFF] transition-all duration-300"
              >
                {/* Immersive Photo Frame */}
                <div className="w-[280px] h-[360px] sm:w-[340px] sm:h-[440px] relative overflow-hidden">
                  <img
                    src={frame.image}
                    alt={frame.title || "Hero film memory"}
                    className="w-full h-full object-cover filter contrast-[1.06] brightness-[0.96] group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Author Tag */}
                  {frame.author && (
                    <div className="absolute top-3 left-3 bg-[#5B2EFF] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-white/20">
                      <Sparkles className="w-3 h-3" />
                      <span>{frame.author}</span>
                    </div>
                  )}

                  {/* Bottom Title Overlay */}
                  {frame.title && (
                    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-0.5">
                      <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                        {frame.title}
                      </h3>
                      {frame.caption && (
                        <p className="text-[11px] text-white/80 font-medium truncate drop-shadow-sm">
                          &ldquo;{frame.caption}&rdquo;
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bottom Sprocket Hole Margin */}
            <div className="h-6 sm:h-7 bg-[#0A0A0A] px-3 flex items-center justify-between border-t border-[#222222]">
              <span className="text-[9px] font-mono text-[#5B2EFF] font-bold tracking-widest uppercase">
                KODAK 400 35MM
              </span>
              <div className="flex gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-3.5 bg-[#262626] rounded-xs group-hover:bg-[#5B2EFF]/60 transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
