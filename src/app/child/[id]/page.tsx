"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";
import { useStickerProgress } from "@/hooks/useStickerProgress";
import { StickerSlot } from "@/components/StickerSlot";
import { SuccessModal } from "@/components/SuccessModal";
import { PROFILE_ICONS } from "@/lib/types";

function formatMinute(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function ChildStickerPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { isLoading: familyLoading, children, childrenMissions, settings } = useFamily();
  const { count, events, loading, addSticker, reset } = useStickerProgress(id);
  const loadingAny = familyLoading || loading;
  const [selectedMission, setSelectedMission] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  const child = useMemo(() => children.find((c) => c.id === id), [children, id]);
  const missions = id ? (childrenMissions[id] ?? []) : [];
  const missionOptions = useMemo(() => missions.filter((m) => m.mission_text.trim()).map((m) => m.mission_text), [missions]);
  const target = settings?.target_count ?? 10;
  const iconMap = Object.fromEntries(PROFILE_ICONS.map((p) => [p.id, p.emoji]));

  if (!id) {
    router.replace("/");
    return null;
  }
  if (!loadingAny && !child) {
    router.replace("/");
    return null;
  }

  const handleTap = useCallback(async () => {
    if (!missionOptions.length) return;
    const text = selectedMission || missionOptions[0]!;
    if (!text.trim()) return;
    if (count >= target) return;
    await addSticker(text);
    const next = count + 1;
    if (next >= target) setShowSuccess(true);
  }, [count, target, selectedMission, missionOptions, addSticker]);

  const handleReset = useCallback(async () => {
    setResetting(true);
    try {
      await reset();
      setShowSuccess(false);
    } finally {
      setResetting(false);
    }
  }, [reset]);

  if (loadingAny || !child) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50/80 to-orange-50/60">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-2 border-amber-300 border-t-amber-600"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/80 to-orange-50/60">
      <header className="flex items-center gap-3 border-b border-amber-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-amber-700 transition hover:bg-amber-100"
          aria-label="홈으로"
        >
          <ChevronLeft size={24} />
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-2xl">{iconMap[child.icon] ?? "🌟"}</span>
          <h1 className="truncate text-lg font-bold text-amber-900">{child.name}</h1>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-4">
        <div className="mb-3">
          <p className="mb-1.5 text-sm font-medium text-amber-800">오늘의 미션 (선택)</p>
          {missionOptions.length === 0 ? (
            <p className="rounded-xl bg-amber-100/80 px-3 py-2 text-sm text-amber-700">
              설정에서 미션을 추가해 주세요.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {missionOptions.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMission(selectedMission === m ? "" : m)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    selectedMission === m ? "bg-amber-400 text-amber-900" : "bg-amber-100/80 text-amber-800 hover:bg-amber-200/80"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mb-2 text-amber-700/90">
          {count} / {target}
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-5 gap-2 sm:gap-3"
          style={{ gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}
        >
          {Array.from({ length: target }, (_, i) => (
            <StickerSlot
              key={i}
              index={i}
              isFilled={i < count}
              onTap={handleTap}
            />
          ))}
        </motion.div>

        {count >= target && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              type="button"
              onClick={handleReset}
              disabled={resetting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-200/80 py-3 font-semibold text-amber-900 transition hover:bg-amber-300/80 disabled:opacity-60"
            >
              <RotateCcw size={18} /> 초기화
            </button>
          </motion.div>
        )}

        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-amber-800">히스토리</h2>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-amber-200/60 bg-white/70 p-2">
            {events.length === 0 ? (
              <p className="py-4 text-center text-sm text-amber-600/80">아직 기록이 없어요.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {events.map((e, i) => (
                  <li key={`${e.created_at}-${i}`} className="flex justify-between gap-2 rounded-lg bg-amber-50/60 px-2 py-1.5">
                    <span className="text-amber-900">{e.mission_text}</span>
                    <span className="shrink-0 text-amber-600/80">{formatMinute(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <SuccessModal
        isOpen={showSuccess}
        childName={child.name}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
