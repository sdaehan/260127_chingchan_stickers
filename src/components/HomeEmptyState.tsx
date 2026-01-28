"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

export function HomeEmptyState() {
  return (
    <div className="relative flex min-h-[60vh] w-full flex-col items-center justify-center overflow-hidden px-4">
      {/* 파스텔 배경 애니메이션: 부드럽게 움직이는 원형 블롭 */}
      <div className="pointer-events-none absolute inset-0">
        <motion.span
          className="absolute -left-12 top-1/4 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl"
          animate={{
            x: [0, 24, 0],
            y: [0, -16, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute -right-8 top-1/3 h-40 w-40 rounded-full bg-rose-200/35 blur-3xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 12, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute bottom-1/4 left-1/4 h-36 w-36 rounded-full bg-orange-200/30 blur-3xl"
          animate={{
            x: [0, 16, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute bottom-1/3 right-1/4 h-32 w-32 rounded-full bg-yellow-200/35 blur-3xl"
          animate={{
            x: [0, -12, 0],
            y: [0, -14, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 설정 버튼 안내: 우측 상단을 가리키는 힌트 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative z-10 mb-6 flex items-center gap-2 rounded-2xl border border-amber-200/70 bg-white/90 px-4 py-3 shadow-sm shadow-amber-200/20"
      >
        <span className="text-2xl">💡</span>
        <p className="text-sm text-amber-800">
          우측 상단 <span className="font-semibold">⚙️ 설정</span>에서도
          <br />
          <span className="text-amber-700">자녀를 등록할 수 있어요</span>
        </p>
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-amber-500"
        >
          →
        </motion.span>
      </motion.div>

      {/* 메인 CTA 카드/버튼 */}
      <Link href="/settings?add=1" className="relative z-10 block w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 22 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-amber-200/80 bg-white/95 p-8 shadow-xl shadow-amber-200/25 transition hover:shadow-2xl hover:shadow-amber-200/30"
        >
          <motion.span
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl sm:text-6xl"
          >
            ✨
          </motion.span>
          <p className="text-center text-lg font-bold leading-snug text-amber-900 sm:text-xl">
            우리 아이 등록하고
            <br />
            칭찬 시작하기
          </p>
          <p className="text-center text-sm text-amber-600/90">
            자녀 및 칭찬 관리 시작하기
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
            <Sparkles size={16} className="text-amber-600" />
            지금 시작
            <ChevronRight size={18} />
          </span>
        </motion.div>
      </Link>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-6 text-center text-sm text-amber-600/70"
      >
        등록한 자녀 카드를 눌러 스티커를 모아 보세요
      </motion.p>
    </div>
  );
}
