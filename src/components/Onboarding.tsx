"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";

export function Onboarding() {
  const { createFamily, joinFamily } = useFamily();
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    setJoinError("");
    try {
      await createFamily();
    } catch (e) {
      setJoinError(e instanceof Error ? e.message : "생성에 실패했어요.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    const code = joinCode.replace(/\D/g, "");
    if (code.length !== 6) {
      setJoinError("6자리 숫자를 입력해 주세요.");
      return;
    }
    setJoining(true);
    setJoinError("");
    try {
      await joinFamily(code);
    } catch (e) {
      setJoinError(e instanceof Error ? e.message : "참여에 실패했어요.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-amber-100/80 px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 text-center text-2xl font-bold text-amber-900"
      >
        칭찬 스티커
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-amber-700/80"
      >
        가족을 만들거나 참여해 주세요
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="rounded-2xl border-2 border-amber-200/80 bg-white px-6 py-4 text-lg font-semibold text-amber-900 shadow-md transition hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
        >
          {creating ? "만드는 중…" : "🆕 새 가족 만들기"}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-amber-200/60" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gradient-to-b from-amber-50/90 to-orange-50/50 px-3 text-amber-600/80">또는</span>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-amber-200/60 bg-white/80 p-4">
          <label className="mb-2 block text-sm font-medium text-amber-800">가족 코드 6자리</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="mb-3 w-full rounded-xl border border-amber-200/80 bg-amber-50/50 px-4 py-3 text-center text-lg tracking-[0.4em] text-amber-900 placeholder:text-amber-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
          />
          <button
            type="button"
            onClick={handleJoin}
            disabled={joining || joinCode.replace(/\D/g, "").length !== 6}
            className="w-full rounded-xl bg-amber-400 py-3 font-semibold text-amber-900 transition hover:bg-amber-500 disabled:opacity-50"
          >
            {joining ? "참여 중…" : "가족에 참여하기"}
          </button>
        </div>

        {joinError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-600"
          >
            {joinError}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
