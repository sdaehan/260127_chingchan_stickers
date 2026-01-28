"use client";

import { Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

const STICKER_THEMES: { type: "star" | "heart"; color: string }[] = [
  { type: "star", color: "#FF6B9D" },
  { type: "heart", color: "#FFB347" },
  { type: "star", color: "#98D8C8" },
  { type: "heart", color: "#7B68EE" },
  { type: "star", color: "#F781BE" },
  { type: "heart", color: "#FFD700" },
  { type: "star", color: "#87CEEB" },
  { type: "heart", color: "#FF69B4" },
  { type: "star", color: "#98FB98" },
  { type: "heart", color: "#DDA0DD" },
];

type Props = {
  index: number;
  isFilled: boolean;
  onTap: () => void;
};

export function StickerSlot({ index, isFilled, onTap }: Props) {
  const theme = STICKER_THEMES[index % STICKER_THEMES.length]!;

  return (
    <motion.button
      type="button"
      onClick={onTap}
      disabled={isFilled}
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-amber-200/80 bg-amber-50/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-default disabled:border-amber-200 disabled:bg-amber-50/40 sm:h-20 sm:w-20"
      whileHover={!isFilled ? { scale: 1.05 } : {}}
      whileTap={!isFilled ? { scale: 0.98 } : {}}
    >
      {isFilled ? (
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 12,
          }}
          className="flex items-center justify-center"
        >
          {theme.type === "star" ? (
            <Star
              size={36}
              className="drop-shadow-sm sm:w-10 sm:h-10"
              style={{ color: theme.color, fill: theme.color }}
            />
          ) : (
            <Heart
              size={36}
              className="drop-shadow-sm sm:w-10 sm:h-10"
              style={{ color: theme.color, fill: theme.color }}
            />
          )}
        </motion.span>
      ) : (
        <span className="text-amber-300/60 text-2xl">+</span>
      )}
    </motion.button>
  );
}
