"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isOpen: boolean;
  childName: string;
  onClose: () => void;
};

export function SuccessModal({ isOpen, childName, onClose }: Props) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasFired.current = false;
      return;
    }
    if (hasFired.current) return;
    hasFired.current = true;

    const duration = 2500;
    const end = Date.now() + duration;

    const run = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF6B9D", "#FFD700", "#98D8C8", "#7B68EE", "#FFB347"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF6B9D", "#FFD700", "#98D8C8", "#7B68EE", "#FFB347"],
      });
      if (Date.now() < end) requestAnimationFrame(run);
    };
    run();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm rounded-3xl bg-white p-8 shadow-xl ring-2 ring-amber-200/60"
          >
            <p className="text-center text-xl font-bold text-amber-800">
              최고야! {childName}가 약속을 지켰어!
            </p>
            <p className="mt-2 text-center text-amber-600/90">
              🎉 축하해요!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-2xl bg-amber-400 py-3 font-semibold text-amber-900 shadow-md transition hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
