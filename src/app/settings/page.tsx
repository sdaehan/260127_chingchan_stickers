export const dynamic = 'force-dynamic'; // 이 줄을 추가하세요!

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Copy, Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useFamily } from "@/contexts/FamilyContext";
import { EditableTitle } from "@/components/EditableTitle";
import { ChildFormModal } from "@/components/ChildFormModal";
import { PROFILE_ICONS } from "@/lib/types";
import type { Child } from "@/lib/types";

const TARGET_OPTIONS = [10, 20, 30, 40, 50];

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isLoading,
    isOnboarded,
    familyCode,
    settings,
    children,
    childrenMissions,
    updateSettings,
    deleteChild,
    leaveFamily,
  } = useFamily();
  const [modalOpen, setModalOpen] = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [copyOk, setCopyOk] = useState(false);
  const hasOpenedAddRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isOnboarded) router.replace("/");
  }, [isLoading, isOnboarded, router]);

  // 홈 빈 상태에서 "자녀 등록하고 칭찬 시작하기" → /settings?add=1 진입 시 모달 자동 오픈
  useEffect(() => {
    if (isLoading || !isOnboarded || hasOpenedAddRef.current) return;
    if (searchParams.get("add") === "1") {
      hasOpenedAddRef.current = true;
      setEditChild(null);
      setModalOpen(true);
      router.replace("/settings");
    }
  }, [isLoading, isOnboarded, searchParams, router]);

  const handleAdd = () => {
    setEditChild(null);
    setModalOpen(true);
  };

  const handleEdit = (c: Child) => {
    setEditChild(c);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditChild(null);
  };

  const copyFamilyCode = useCallback(() => {
    if (!familyCode) return;
    navigator.clipboard.writeText(familyCode);
    setCopyOk(true);
    setTimeout(() => setCopyOk(false), 1500);
  }, [familyCode]);

  const iconMap = Object.fromEntries(PROFILE_ICONS.map((p) => [p.id, p.emoji]));

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-amber-100/80">
      <header className="flex items-center gap-3 border-b border-amber-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-amber-700 transition hover:bg-amber-100"
          aria-label="홈으로"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-amber-900">설정</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <section className="mb-6 rounded-2xl border-2 border-amber-200/60 bg-white/80 p-4">
          <h2 className="mb-3 text-sm font-semibold text-amber-800">앱 설정</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-amber-700/80">앱 이름</label>
              <EditableTitle
                value={settings?.app_title ?? "우리집 칭찬스티커"}
                onChange={(v) => updateSettings({ app_title: v })}
                placeholder="우리집 칭찬스티커"
                className="text-lg"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-amber-700/80">목표 스티커 개수 (10~50)</label>
              <div className="flex flex-wrap gap-2">
                {TARGET_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => updateSettings({ target_count: n })}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      (settings?.target_count ?? 10) === n
                        ? "bg-amber-400 text-amber-900"
                        : "bg-amber-100/80 text-amber-800 hover:bg-amber-200/80"
                    }`}
                  >
                    {n}개
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border-2 border-amber-200/60 bg-white/80 p-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-800">Family ID</h2>
          <p className="mb-2 text-xs text-amber-600/90">다른 가족이 이 6자리 코드를 입력하면 같은 가족 그룹으로 연결돼요.</p>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-amber-100/80 px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-amber-900">
              {familyCode ?? "------"}
            </span>
            <button
              type="button"
              onClick={copyFamilyCode}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800 transition hover:bg-amber-300/80"
              title="복사"
            >
              <Copy size={18} />
            </button>
            {copyOk && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-amber-600">
                복사됨!
              </motion.span>
            )}
          </div>
        </section>

        <section className="rounded-2xl border-2 border-amber-200/60 bg-white/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-amber-800">자녀 관리 (최대 5명)</h2>
            {children.length < 5 && (
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-500"
              >
                <Plus size={16} /> 자녀 추가
              </button>
            )}
          </div>

          {children.length === 0 ? (
            <p className="py-4 text-center text-amber-600/80">등록된 자녀가 없어요. 자녀를 추가해 보세요.</p>
          ) : (
            <ul className="space-y-2">
              {children.map((c) => (
                <motion.li
                  key={c.id}
                  layout
                  className="flex items-center justify-between gap-2 rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-2.5"
                >
                  <span className="text-2xl">{iconMap[c.icon] ?? "🌟"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-amber-900">{c.name}</p>
                    <p className="text-xs text-amber-600/80">
                      {c.age}세 · {c.gender === "male" ? "남" : c.gender === "female" ? "여" : "그 외"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(c)}
                      className="rounded-lg p-2 text-amber-700 hover:bg-amber-200/60"
                      aria-label="수정"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteChild(c.id)}
                      className="rounded-lg p-2 text-red-600/80 hover:bg-red-100/60"
                      aria-label="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-8">
          <button
            type="button"
            onClick={leaveFamily}
            className="w-full rounded-xl border border-amber-200/80 py-2.5 text-sm text-amber-600/80 hover:bg-amber-100/60"
          >
            이 가족에서 나가기
          </button>
        </div>
      </main>

      <ChildFormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editChild={editChild}
        missions={editChild ? (childrenMissions[editChild.id] ?? []) : []}
      />
    </div>
  );
}
