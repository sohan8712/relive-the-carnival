"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Check, RefreshCw, Loader2, Film } from "lucide-react";
import { FilmStrip, FilmFrame } from "./FilmStrip";
import { AnimatedButton } from "./AnimatedButton";
import { Confetti } from "./Confetti";

interface FilmReelGalleryProps {
  onRestart: () => void;
  onTriggerToast: (msg: string) => void;
  onSaveMemoryPhoto?: (imageBlobUrl: string, caption: string) => Promise<void>;
}

// Self-contained SVG Data URLs for 100% offline-proof, bulletproof image rendering
const SVG_PHOTOS = {
  keynote: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" h="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%235B2EFF"/><circle cx="300" cy="180" r="120" fill="%23FF2E93" opacity="0.4"/><path d="M100 350 Q 300 200 500 350" stroke="%23FFC700" stroke-width="12" fill="none"/><text x="300" y="220" font-family="sans-serif" font-weight="900" font-size="32" fill="white" text-anchor="middle">🎉 OPENING NIGHT</text><text x="300" y="260" font-family="sans-serif" font-weight="600" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">Sugar.fit 5th Anniversary</text></svg>`,
  awards: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" h="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%23FF2E93"/><circle cx="450" cy="120" r="100" fill="%23FFC700" opacity="0.5"/><polygon points="300,100 330,190 420,190 350,240 375,330 300,280 225,330 250,240 180,190 270,190" fill="%23FFC700"/><text x="300" y="370" font-family="sans-serif" font-weight="900" font-size="30" fill="white" text-anchor="middle">🏆 TEAM CHAMPIONS</text></svg>`,
  feast: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" h="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%23FF5E2E"/><circle cx="150" cy="300" r="140" fill="%23FFC700" opacity="0.4"/><text x="300" y="210" font-family="sans-serif" font-weight="900" font-size="64" text-anchor="middle">🍽️</text><text x="300" y="290" font-family="sans-serif" font-weight="900" font-size="30" fill="white" text-anchor="middle">GOURMET SPREAD</text></svg>`,
  music: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" h="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%2300D68F"/><circle cx="300" cy="220" r="160" fill="%2300B2FF" opacity="0.3"/><text x="300" y="210" font-family="sans-serif" font-weight="900" font-size="64" text-anchor="middle">🎵</text><text x="300" y="290" font-family="sans-serif" font-weight="900" font-size="30" fill="white" text-anchor="middle">DANCE FLOOR ENERGY</text></svg>`,
  games: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" h="450" viewBox="0 0 600 450"><rect width="100%" height="100%" fill="%2300B2FF"/><circle cx="400" cy="300" r="130" fill="%235B2EFF" opacity="0.4"/><text x="300" y="210" font-family="sans-serif" font-weight="900" font-size="64" text-anchor="middle">🎯</text><text x="300" y="290" font-family="sans-serif" font-weight="900" font-size="30" fill="white" text-anchor="middle">CARNIVAL ARENA</text></svg>`,
};

// Hero 35mm Film Collection (Self-contained, 100% offline-ready)
const HERO_FILM_FRAMES: FilmFrame[] = [
  {
    id: "hero-1",
    image: SVG_PHOTOS.keynote,
    title: "Opening Ceremony",
    caption: "Kickoff speech celebrating five incredible years of team growth & impact.",
    frameNum: "35MM • 01A",
  },
  {
    id: "hero-2",
    image: SVG_PHOTOS.awards,
    title: "Sugar.fit Champions",
    caption: "Honouring outstanding contributions and team excellence awards.",
    frameNum: "35MM • 02A",
  },
  {
    id: "hero-3",
    image: SVG_PHOTOS.feast,
    title: "Gourmet Carnival Spread",
    caption: "Delightful treats, culinary spreads, and 5th anniversary celebration cakes.",
    frameNum: "35MM • 03A",
  },
  {
    id: "hero-4",
    image: SVG_PHOTOS.music,
    title: "Music & High Energy",
    caption: "Late night music performances and dance floor energy.",
    frameNum: "35MM • 04A",
  },
  {
    id: "hero-5",
    image: SVG_PHOTOS.games,
    title: "Carnival Games Arena",
    caption: "Friendly competitions, laughter, and high vibrations all night long.",
    frameNum: "35MM • 05A",
  },
];

export function FilmReelGallery({
  onRestart,
  onTriggerToast,
  onSaveMemoryPhoto,
}: FilmReelGalleryProps) {
  const [frames, setFrames] = useState<FilmFrame[]>(HERO_FILM_FRAMES);

  // Selected Frame Lightbox State
  const [selectedFrame, setSelectedFrame] = useState<FilmFrame | null>(null);

  // Upload Photo Memory State
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState<string>("");
  const [isDevelopingPhoto, setIsDevelopingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImage(url);
    }
  };

  const handleDevelopAndInsertPhoto = async () => {
    if (!tempImage) return;

    setIsDevelopingPhoto(true);
    onTriggerToast("Developing 35mm photo memory...");

    const newFrame: FilmFrame = {
      id: `user-frame-${Date.now()}`,
      image: tempImage,
      title: "Your Carnival Memory",
      caption: tempCaption.trim() || "Preserved in the Sugar.fit Living Film Archive.",
      author: "You",
      frameNum: `35MM • ${Math.floor(Math.random() * 89 + 10)}A`,
    };

    // Trigger Google Workspace Upload if handler provided
    if (onSaveMemoryPhoto) {
      try {
        await onSaveMemoryPhoto(tempImage, tempCaption.trim());
      } catch {
        // Graceful fallback without blocking user experience
      }
    }

    // Insert newly developed frame directly into the single hero 35mm film strip
    setFrames((prev) => [newFrame, ...prev]);

    setTimeout(() => {
      setIsDevelopingPhoto(false);
      setTempImage(null);
      setTempCaption("");
      onTriggerToast("Photo developed & woven into the living film reel! 🎬✨");
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full relative select-none overflow-hidden py-1">
      <Confetti />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload memory to film strip"
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 z-30 shrink-0 border-b border-[#EFECE6]/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs shadow-xs">
            <Film className="w-3.5 h-3.5 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-[#1D1C1A] tracking-tight">
              Single 35mm Living Reel
            </span>
            <span className="text-[9px] font-bold text-[#5B2EFF] tracking-wider uppercase">
              Sugar.fit Projector
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerPicker}
            className="py-1.5 px-3 rounded-full bg-[#5B2EFF] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md hover:bg-[#4D24E0] transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Contribute Memory</span>
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="p-1.5 rounded-full bg-[#FCFBF8] border border-[#EFECE6] text-[#1D1C1A]/70 hover:text-[#5B2EFF] transition-colors"
            title="Replay Experience"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HERO SINGLE CONTINUOUS 35mm FILM STRIP (Occupies 65-75% screen height) */}
      <div className="flex-1 flex flex-col justify-center items-center my-auto overflow-hidden relative w-full">
        {/* Ambient cinema glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5B2EFF]/[0.04] to-transparent pointer-events-none" />

        <FilmStrip
          frames={frames}
          speed={18}
          onSelectFrame={(frame) => setSelectedFrame(frame)}
        />
      </div>

      {/* Floating Drag Hint Overlay */}
      <div className="text-center pb-2 shrink-0 z-30">
        <span className="text-[11px] font-bold text-[#1D1C1A]/50 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#EFECE6] shadow-xs">
          Press & drag reel left or right • Tap frame for lightbox
        </span>
      </div>

      {/* FULLSCREEN LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {selectedFrame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFrame(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[400px] bg-[#141414] text-white rounded-[28px] overflow-hidden border border-white/20 shadow-2xl flex flex-col relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedFrame(null)}
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Lightbox Large Photo View */}
              <div className="w-full aspect-[4/3] relative bg-black">
                <img
                  src={selectedFrame.image}
                  alt={selectedFrame.title || "Selected frame"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#5B2EFF] text-white text-[9px] font-mono font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {selectedFrame.frameNum || "35MM ARCHIVE"}
                </div>
              </div>

              {/* Lightbox Details & Caption */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  {selectedFrame.author && (
                    <span className="text-xs font-bold text-[#5B2EFF]">
                      ✨ Shared by {selectedFrame.author}
                    </span>
                  )}
                  <h3 className="text-xl font-extrabold text-white tracking-tight">
                    {selectedFrame.title || "Carnival Moment"}
                  </h3>
                </div>

                {selectedFrame.caption && (
                  <p className="text-xs text-white/85 leading-relaxed italic font-medium border-l-2 border-[#5B2EFF] pl-3 py-1">
                    &ldquo;{selectedFrame.caption}&rdquo;
                  </p>
                )}

                <div className="pt-2 flex justify-between items-center text-[10px] text-white/40 font-mono">
                  <span>SUGAR.FIT 5TH ANNIVERSARY</span>
                  <span>ANALOG FILM REEL</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANALOG PHOTO DEVELOPING MODAL */}
      <AnimatePresence>
        {tempImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-[380px] bg-[#161616] text-white rounded-[28px] p-6 shadow-2xl border border-white/15 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B2EFF] bg-[#5B2EFF]/20 px-3 py-1 rounded-full border border-[#5B2EFF]/30">
                  <Film className="w-3.5 h-3.5" />
                  <span>35mm Film Development</span>
                </div>
                {!isDevelopingPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempImage(null);
                      setTempCaption("");
                    }}
                    className="text-xs text-white/40 hover:text-white font-semibold"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Photo Preview with Analog Developing Shimmer */}
              <div className="w-full aspect-[16/9] rounded-[20px] overflow-hidden border border-white/20 relative shadow-inner">
                <img
                  src={tempImage}
                  alt="Uploaded photo preview"
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    isDevelopingPhoto ? "filter brightness-125 contrast-125 saturate-150" : ""
                  }`}
                />
                {isDevelopingPhoto && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[#5B2EFF]/40 to-transparent"
                  />
                )}
              </div>

              {/* Caption Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/70">
                  Add an optional caption:
                </label>
                <div className="bg-[#222222] border border-white/15 focus-within:border-[#5B2EFF] rounded-[18px] p-3 transition-all">
                  <textarea
                    value={tempCaption}
                    onChange={(e) => setTempCaption(e.target.value.slice(0, 140))}
                    placeholder="Tell us why this moment mattered..."
                    rows={2}
                    disabled={isDevelopingPhoto}
                    className="w-full bg-transparent text-xs font-normal text-white placeholder:text-white/35 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <AnimatedButton
                onClick={handleDevelopAndInsertPhoto}
                disabled={isDevelopingPhoto}
                variant="primary"
              >
                {isDevelopingPhoto ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Developing & Weaving Photo...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Develop Photo into Film Reel</span>
                  </div>
                )}
              </AnimatedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
