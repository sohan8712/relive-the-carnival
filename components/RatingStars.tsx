"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SparkleBurst } from "./SparkleBurst";

interface RatingStarsProps {
  value: number;
  onChange: (rating: number) => void;
}

const RATING_LABELS: Record<number, string> = {
  0: "Tap stars to rate ✨",
  1: "Needs work 😅",
  2: "Fair 🙂",
  3: "Good 😋",
  4: "Delicious! 😍",
  5: "Out of this world! 🤩🎉",
};

export function RatingStars({ value, onChange }: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [burstTrigger, setBurstTrigger] = useState(false);

  const displayRating = hoverValue !== null ? hoverValue : value;

  const handleSelectStar = (star: number) => {
    onChange(star);
    if (star === 5) {
      setBurstTrigger(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-3 relative">
      <SparkleBurst trigger={burstTrigger} emojis={["⭐", "✨", "🌟", "🎉"]} />

      {/* Stars row */}
      <div className="flex items-center gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          return (
            <motion.button
              key={star}
              type="button"
              onClick={() => handleSelectStar(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
              whileHover={{ scale: 1.3, rotate: 12 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="p-1 focus:outline-none group cursor-pointer"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-200 ${
                  isFilled
                    ? "fill-[#FFC700] text-[#FFC700] drop-shadow-[0_4px_12px_rgba(255,199,0,0.5)] scale-105"
                    : "fill-[#FCFBF8] text-[#EFECE6] group-hover:text-[#FFC700]/60"
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Feedback Label */}
      <motion.div
        key={displayRating}
        initial={{ opacity: 0, y: 6, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="h-9 flex items-center"
      >
        <span
          className={`text-sm font-extrabold px-4 py-1.5 rounded-full transition-all ${
            displayRating > 0
              ? "bg-[#FFF9E6] text-[#FF9900] border border-[#FFC700]/30 shadow-xs"
              : "bg-[#FCFBF8] text-[#1D1C1A]/50 border border-[#EFECE6]"
          }`}
        >
          {RATING_LABELS[displayRating]}
        </span>
      </motion.div>
    </div>
  );
}
