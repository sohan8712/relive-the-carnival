"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, Camera, Check, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatedButton } from "./AnimatedButton";
import { Confetti } from "./Confetti";
import { ReelItem } from "@/types";

interface MemoryDeckProps {
  onRestart: () => void;
  onTriggerToast: (msg: string) => void;
  onSaveMemoryPhoto?: (imageBlobUrl: string, caption: string) => Promise<void>;
}

// Full-bleed sample photographic backgrounds
const SAMPLE_PHOTOS: Record<string, string> = {
  "deck-1": "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
  "deck-2": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
  "deck-3": "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop",
  "deck-4": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop",
};

const INITIAL_DECK: (ReelItem & { category: string; photoUrl?: string })[] = [
  {
    id: "deck-1",
    type: "official",
    title: "The Night Begins",
    subtitle: "Celebrating five incredible years of growth, health, and community together.",
    category: "🎉 OPENING CEREMONY",
    photoUrl: SAMPLE_PHOTOS["deck-1"],
  },
  {
    id: "deck-2",
    type: "official",
    title: "Honouring Our Champions",
    subtitle: "Recognizing outstanding contributions and milestones across teams.",
    category: "🏆 AWARDS & HONOURS",
    photoUrl: SAMPLE_PHOTOS["deck-2"],
  },
  {
    id: "deck-prompt-1",
    type: "uploadPrompt",
    title: "Share Your Story",
    subtitle: "Every celebration has hundreds of stories. What's one moment you captured?",
    category: "✨ YOUR TURN",
  },
  {
    id: "deck-3",
    type: "official",
    title: "Feast for the Senses",
    subtitle: "Indulging in culinary delights and sweet carnival treats.",
    category: "🍽 GOURMET SPREAD",
    photoUrl: SAMPLE_PHOTOS["deck-3"],
  },
  {
    id: "deck-4",
    type: "official",
    title: "Dance Floor Energy",
    subtitle: "Unforgettable music and high vibes as the night reached its peak.",
    category: "🎵 MUSIC & DANCE",
    photoUrl: SAMPLE_PHOTOS["deck-4"],
  },
  {
    id: "deck-ending",
    type: "official",
    title: "5 Years. Hundreds of memories.",
    subtitle: "One incredible team. Thank you for being part of our journey.",
    category: "❤️ SEE YOU AT YEAR 6",
  },
];

export function MemoryDeck({ onRestart, onTriggerToast, onSaveMemoryPhoto }: MemoryDeckProps) {
  const [items, setItems] = useState<typeof INITIAL_DECK>(INITIAL_DECK);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Upload modal state
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempCaption, setTempCaption] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Motion values for swipe drag gesture
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-220, -100, 0, 100, 220], [0, 0.9, 1, 0.9, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 70;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > 250) {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }
    x.set(0);
  };

  const handleNextCard = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTriggerPicker = (promptId: string) => {
    setActivePromptId(promptId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImage(url);
    }
  };

  const handleSaveMemory = async () => {
    if (!activePromptId || !tempImage) return;

    setIsUploadingPhoto(true);
    onTriggerToast("Uploading memory photo to Google Drive...");

    // Trigger Google Workspace Upload handler if provided
    if (onSaveMemoryPhoto) {
      await onSaveMemoryPhoto(tempImage, tempCaption.trim());
    }

    const newMemory = {
      id: `user-mem-${Date.now()}`,
      type: "userMemory" as const,
      image: tempImage,
      caption: tempCaption.trim() || undefined,
      author: "You",
      category: "✨ SHARED BY YOU",
    };

    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === activePromptId);
      if (idx === -1) return prev;
      const updated = [...prev];
      updated[idx] = newMemory as unknown as typeof INITIAL_DECK[0];
      return updated;
    });

    setIsUploadingPhoto(false);
    setActivePromptId(null);
    setTempImage(null);
    setTempCaption("");
    onTriggerToast("Photo memory saved to Google Drive! 🎉");
  };

  const isEndingCard = currentIndex === items.length - 1;

  return (
    <div className="flex-1 flex flex-col justify-between h-full relative select-none overflow-hidden p-1">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload photo to memory deck"
      />

      {/* TOP MINIMAL UI: STEP INDICATOR OVERLAY */}
      <div className="flex items-center justify-between px-3 py-2 z-30 shrink-0">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#5B2EFF] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Memory {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Minimal Swipe Hint */}
        <span className="text-[11px] font-semibold text-[#1D1C1A]/50 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#EFECE6]">
          Swipe card →
        </span>
      </div>

      {/* TINDER / BUMBLE FULL-BLEED HERO CARD STACK */}
      <div className="relative w-full flex-1 my-2 flex items-center justify-center">
        {items.map((item, index) => {
          if (index < currentIndex || index > currentIndex + 2) return null;

          const isTop = index === currentIndex;
          const stackOffset = index - currentIndex;
          const scale = 1 - stackOffset * 0.05;
          const translateY = stackOffset * 10;
          const cardOpacity = 1 - stackOffset * 0.15;

          return (
            <motion.div
              key={item.id}
              style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : cardOpacity,
                scale: scale,
                y: translateY,
                zIndex: items.length - index,
              }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isTop ? handleDragEnd : undefined}
              animate={{
                scale: scale,
                y: translateY,
                opacity: cardOpacity,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={`absolute inset-0 w-full h-full rounded-[32px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)] flex flex-col justify-end ${
                isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
            >
              {/* CARD TYPE 1: OFFICIAL HERO EVENT PHOTO (FULL BLEED) */}
              {item.type === "official" && item.id !== "deck-ending" && (
                <div className="absolute inset-0 w-full h-full bg-[#1D1C1A]">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#5B2EFF] via-[#FF2E93] to-[#FF5E2E] opacity-90 flex items-center justify-center p-8 text-center text-white font-extrabold text-2xl">
                      📸 {item.title}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 flex flex-col gap-2 z-20 text-white">
                    <span className="text-xs font-extrabold text-white/90 bg-[#5B2EFF] px-3 py-1 rounded-full w-fit shadow-md uppercase tracking-wider border border-white/20">
                      {item.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none drop-shadow-md mt-1">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed drop-shadow-sm max-w-[340px]">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CARD TYPE 2: YOUR TURN HERO UPLOAD PROMPT CARD */}
              {item.type === "uploadPrompt" && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#1D1C1A] via-[#5B2EFF]/90 to-[#1D1C1A] p-7 flex flex-col justify-between text-white">
                  <div className="flex flex-col gap-4 mt-6 z-10">
                    <span className="text-xs font-extrabold bg-white/20 backdrop-blur-md text-white px-3.5 py-1 rounded-full w-fit uppercase tracking-wider border border-white/20">
                      ✨ YOUR TURN
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                      Share Your<br />Memory
                    </h2>
                    <p className="text-sm font-medium text-white/80 leading-relaxed max-w-[300px]">
                      Every celebration has hundreds of stories. What&apos;s one moment you captured that deserves a place in this story?
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 z-10 mb-4">
                    <div className="w-full aspect-[16/9] bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] flex flex-col items-center justify-center p-4 text-center">
                      <Camera className="w-8 h-8 text-white mb-1" />
                      <span className="text-xs font-bold text-white/90">
                        Camera & Photo Library Supported
                      </span>
                    </div>

                    <AnimatedButton
                      onClick={() => handleTriggerPicker(item.id)}
                      variant="primary"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Camera className="w-5 h-5 stroke-[2]" />
                        <span>📸 Add My Photo</span>
                      </div>
                    </AnimatedButton>
                  </div>
                </div>
              )}

              {/* CARD TYPE 3: USER MEMORY POLAROID HERO CARD */}
              {item.type === "userMemory" && (
                <div className="absolute inset-0 w-full h-full bg-[#1D1C1A]">
                  <img
                    src={item.image}
                    alt={item.caption || "User uploaded memory"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7 flex flex-col gap-2 z-20 text-white">
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#FF2E93] px-3.5 py-1 rounded-full w-fit shadow-md border border-white/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>✨ Shared by {item.author}</span>
                    </div>

                    {item.caption && (
                      <p className="text-base font-bold text-white leading-relaxed italic drop-shadow-md mt-1">
                        &ldquo;{item.caption}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CARD TYPE 4: ENDING FULL-SCREEN CELEBRATION CARD */}
              {item.id === "deck-ending" && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#1D1C1A] via-[#5B2EFF] to-[#1D1C1A] p-7 flex flex-col justify-between text-center text-white">
                  <Confetti />

                  <div className="flex flex-col items-center gap-4 my-auto z-10">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl shadow-lg border border-white/20"
                    >
                      ❤️
                    </motion.div>

                    <div className="flex flex-col gap-2">
                      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                        5 Years.<br />Hundreds of memories.
                      </h2>
                      <p className="text-sm font-medium text-white/80 leading-relaxed max-w-[280px] mx-auto mt-2">
                        One incredible team. Thank you for being part of our journey. See you at Sugar.fit’s 6th Anniversary. 🎉
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 z-10 mb-2">
                    <AnimatedButton
                      onClick={() => onTriggerToast("📸 Collective gallery releasing soon!")}
                      variant="primary"
                    >
                      View Event Gallery
                    </AnimatedButton>

                    <AnimatedButton onClick={onRestart} variant="outline">
                      <div className="flex items-center gap-2 justify-center text-[#1D1C1A]">
                        <RefreshCw className="w-4 h-4" />
                        <span>Replay Experience</span>
                      </div>
                    </AnimatedButton>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* BOTTOM FLOATING CONTROL OVERLAY */}
      {!isEndingCard && (
        <div className="flex items-center justify-between px-4 py-2 z-30 shrink-0">
          <button
            type="button"
            onClick={handlePrevCard}
            disabled={currentIndex === 0}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EFECE6] text-[#1D1C1A] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-md cursor-pointer"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-[#1D1C1A]/70 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#EFECE6] shadow-xs">
            Drag card to swipe
          </span>

          <button
            type="button"
            onClick={handleNextCard}
            className="py-2.5 px-5 rounded-full bg-[#5B2EFF] text-white text-xs font-extrabold flex items-center gap-1 shadow-md hover:bg-[#4D24E0] transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Caption Drawer for Photo Upload */}
      <AnimatePresence>
        {tempImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1D1C1A]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="w-full max-w-[380px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#EFECE6] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B2EFF] bg-[#F2EEFF] px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upload to Google Drive</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isUploadingPhoto) {
                      setTempImage(null);
                      setTempCaption("");
                    }
                  }}
                  disabled={isUploadingPhoto}
                  className="text-xs text-[#1D1C1A]/40 hover:text-[#1D1C1A] font-semibold"
                >
                  Cancel
                </button>
              </div>

              <div className="w-full aspect-[16/9] rounded-[20px] overflow-hidden border border-[#EFECE6] shadow-sm relative">
                <img
                  src={tempImage}
                  alt="Uploaded photo preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#1D1C1A]/70">
                  Optional caption:
                </label>
                <div className="bg-[#FCFBF8] border border-[#EFECE6] focus-within:border-[#5B2EFF] focus-within:ring-2 focus-within:ring-[#5B2EFF]/15 rounded-[18px] p-3 transition-all">
                  <textarea
                    value={tempCaption}
                    onChange={(e) => setTempCaption(e.target.value.slice(0, 140))}
                    placeholder="Tell us why this moment mattered..."
                    rows={2}
                    disabled={isUploadingPhoto}
                    className="w-full bg-transparent text-xs font-normal text-[#1D1C1A] placeholder:text-[#1D1C1A]/40 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <AnimatedButton
                onClick={handleSaveMemory}
                disabled={isUploadingPhoto}
                variant="primary"
              >
                {isUploadingPhoto ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to Google Drive...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Save & Upload Photo</span>
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
