"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useStickerStorage, type ChildId } from "@/hooks/useStickerStorage";
import { StickerSlot } from "./StickerSlot";
import { SuccessModal } from "./SuccessModal";

const CONFIG: Record<
  ChildId,
  { title: string; displayName: string }
> = {
  junwoo: { title: "🎒 스스로 가방 챙기기", displayName: "준우" },
  jiwoo: { title: "🍱 편식하지 않고 골고루 밥 먹기", displayName: "지우" },
};

type Props = { childId: ChildId };

export function StickerBoard({ childId }: Props) {
  const { count, addSticker } = useStickerStorage(childId);
  const [showSuccess, setShowSuccess] = useState(false);
  const { title, displayName } = CONFIG[childId];

  const handleTap = useCallback(() => {
    if (count >= 10) return;
    addSticker((newCount) => {
      if (newCount === 10) setShowSuccess(true);
    });
  }, [count, addSticker]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/80 to-orange-50/60">
      <header className="flex items-center gap-3 border-b border-amber-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-amber-700 transition hover:bg-amber-100"
          aria-label="홈으로"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-amber-900">{title}</h1>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 text-amber-700/90"
        >
          {count} / 10
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-5 gap-3 sm:gap-4"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <StickerSlot
              key={i}
              index={i}
              isFilled={i < count}
              onTap={handleTap}
            />
          ))}
        </motion.div>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        childName={displayName}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
